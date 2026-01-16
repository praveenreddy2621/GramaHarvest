const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, addressId, totalAmount, paymentStatus, couponCode } = req.body;
    const userId = req.user.id;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let couponId = null;
        let discountAmount = 0;

        // 0. Handle Coupon
        if (couponCode) {
            const couponRes = await client.query(
                `SELECT * FROM coupons WHERE code = $1 AND is_active = true`,
                [couponCode.toUpperCase()]
            );

            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                couponId = coupon.id;

                // Mark as used
                await client.query(
                    'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
                    [couponId]
                );

                // Record user usage
                await client.query(
                    'INSERT INTO user_coupon_usage (user_id, coupon_id) VALUES ($1, $2)',
                    [userId, couponId]
                );
            }
        }

        // 1. Create Order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, address_id, total_amount, payment_status, coupon_id, discount_amount, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
            [userId, addressId, totalAmount, paymentStatus || 'pending', couponId, discountAmount]
        );
        const order = orderResult.rows[0];

        // Update user_coupon_usage with order_id if coupon was used
        if (couponId) {
            await client.query(
                'UPDATE user_coupon_usage SET order_id = $1 WHERE user_id = $2 AND coupon_id = $3',
                [order.id, userId, couponId]
            );
        }

        // 2. Create Order Items
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');

        // Fetch details for Email
        try {
            const userRes = await client.query('SELECT name, email FROM users WHERE id = $1', [userId]);
            const addressRes = await client.query('SELECT * FROM addresses WHERE id = $1', [addressId]);

            const productIds = orderItems.map(i => i.product_id);
            const productsRes = await client.query('SELECT id, name FROM products WHERE id = ANY($1)', [productIds]);
            const productMap = {};
            productsRes.rows.forEach(p => productMap[p.id] = p.name);

            const emailItems = orderItems.map(i => ({
                name: productMap[i.product_id] || 'Product',
                quantity: i.quantity,
                price: i.price
            }));

            const html = await emailTemplates.getOrderConfirmationEmail({
                userName: userRes.rows[0].name,
                orderId: order.id,
                orderDate: new Date().toLocaleDateString(),
                paymentMethod: paymentStatus === 'paid' ? 'Online Payment' : 'Cash on Delivery',
                items: emailItems,
                totalAmount: totalAmount,
                shippingAddress: {
                    fullName: addressRes.rows[0].full_name,
                    street: addressRes.rows[0].street,
                    city: addressRes.rows[0].city,
                    state: addressRes.rows[0].state,
                    zipCode: addressRes.rows[0].zip_code,
                    phone: addressRes.rows[0].phone
                },
                websiteUrl: 'https://gramaharvest.shop'
            });

            // Send in background
            await sendEmail({
                email: userRes.rows[0].email,
                subject: `Order Confirmation #${order.id}`,
                html: html
            });

            // Notify Admin
            const ADMIN_EMAIL = 'praveenreddy@gramaharvest.shop';
            await sendEmail({
                email: ADMIN_EMAIL,
                subject: `NEW ORDER #${order.id} Received - ₹${totalAmount}`,
                html: `
                    <h2>New Order Alert!</h2>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Customer:</strong> ${userRes.rows[0].name} (${userRes.rows[0].email})</p>
                    <p><strong>Amount:</strong> ₹${totalAmount}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    <br/>
                    <a href="https://gramaharvest.shop/admin/orders" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none;">View Admin Panel</a>
                `
            });
        } catch (e) {
            console.error('Email send failed', e);
        }

        res.status(201).json(order);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error creating order' });
    } finally {
        client.release();
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await pool.query(
            `SELECT o.*, 
                    json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) AS items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(orders.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching my orders' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o
             JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );
        res.json(orders.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    try {
        const updatedOrder = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );

        if (updatedOrder.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating order' });
    }
};

// @desc    Update order tracking info
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const updateOrderTracking = async (req, res) => {
    const { courierService, trackingNumber, trackingUrl, estimatedDeliveryDate } = req.body;
    const orderId = req.params.id;

    try {
        const updatedOrder = await pool.query(
            `UPDATE orders 
             SET courier_service = $1, 
                 tracking_number = $2, 
                 tracking_url = $3, 
                 shipped_date = NOW(),
                 estimated_delivery_date = $4,
                 status = 'shipped'
             WHERE id = $5 
             RETURNING *`,
            [courierService, trackingNumber, trackingUrl, estimatedDeliveryDate, orderId]
        );

        if (updatedOrder.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating tracking info' });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/orders/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const client = await pool.connect();

        // 1. Total Sales (Consider 'paid' or all for now, assuming 'paid' implies success)
        const salesRes = await client.query("SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled'");
        const totalSales = salesRes.rows[0].total || 0;

        // 2. Total Orders
        const ordersRes = await client.query("SELECT COUNT(*) as count FROM orders");
        const totalOrders = ordersRes.rows[0].count;

        // 3. Product Count
        const productsRes = await client.query("SELECT COUNT(*) as count FROM products");
        const totalProducts = productsRes.rows[0].count;

        // 4. Sales Last 7 Days (for Chart)
        // Group by day
        const chartRes = await client.query(`
            SELECT TO_CHAR(created_at, 'Mon DD') as date, SUM(total_amount) as sales 
            FROM orders 
            WHERE status != 'cancelled' AND created_at > NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(created_at, 'Mon DD'), DATE(created_at)
            ORDER BY DATE(created_at)
        `);

        // 5. Recent Orders
        const recentRes = await client.query(`
            SELECT o.id, u.name as user_name, o.total_amount, o.status, o.created_at 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC LIMIT 5
        `);

        client.release();

        res.json({
            totalSales,
            totalOrders,
            totalProducts,
            salesChart: chartRes.rows,
            recentOrders: recentRes.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

// @desc    Get order by ID (Admin)
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const orderRes = await pool.query(`
            SELECT o.*, u.name as user_name, u.email as user_email,
                   a.full_name as shipping_name, a.street, a.city, a.state, a.zip_code, a.phone, a.country
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN addresses a ON o.address_id = a.id
            WHERE o.id = $1
        `, [id]);

        if (orderRes.rows.length === 0) return res.status(404).json({ message: 'Order not found' });

        const order = orderRes.rows[0];

        // Fetch items
        const itemsRes = await pool.query(`
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [id]);

        order.items = itemsRes.rows;
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus, updateOrderTracking, getDashboardStats, getOrderById };
