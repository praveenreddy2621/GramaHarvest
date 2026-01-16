const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const { createNotification } = require('./notificationController');

// ... 

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, description, price, imageUrl, galleryUrls, sizes, category, stock, isPreorder } = req.body;
    const { id } = req.params;

    try {
        // Safe parsing for numeric fields
        const numericPrice = parseFloat(price) || 0;
        const numericStock = parseInt(stock) || 0;
        const boolPreorder = isPreorder === true || isPreorder === 'true';

        // Check previous state
        const oldRes = await pool.query('SELECT is_preorder FROM products WHERE id = $1', [id]);
        if (oldRes.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        const wasPreorder = oldRes.rows[0].is_preorder;

        // Update
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, description = $2, price = $3, image_url = $4, gallery_urls = $5, sizes = $6, category = $7, stock = $8, is_preorder = $9
             WHERE id = $10 RETURNING *`,
            [name, description, numericPrice, imageUrl, galleryUrls || [], JSON.stringify(sizes || []), category, numericStock, boolPreorder, id]
        );

        const updatedProduct = result.rows[0];
        // ... notifications logic remains same
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Server error updating product: ' + error.message });
    }
};

// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch Products Error:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Fetch Product Error:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, imageUrl, galleryUrls, sizes, category, stock, isPreorder } = req.body;
    console.log('Creating Product with data:', { name, price, stock, imageUrl });

    try {
        const numericPrice = parseFloat(price) || 0;
        const numericStock = parseInt(stock) || 0;
        const boolPreorder = isPreorder === true || isPreorder === 'true';

        const result = await pool.query(
            `INSERT INTO products (name, description, price, image_url, gallery_urls, sizes, category, stock, is_preorder)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, description, numericPrice, imageUrl, galleryUrls || [], JSON.stringify(sizes || []), category, numericStock, boolPreorder]
        );
        console.log('Product created successfully:', result.rows[0].id);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Server error creating product: ' + error.message });
    }
};



// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

// @desc    Join waitlist
// @route   POST /api/products/:id/notify
// @access  Public
const subscribeToWaitlist = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
        await pool.query(
            `INSERT INTO product_waitlist (product_id, email, user_id) 
             VALUES ($1, $2, $3)
             ON CONFLICT (product_id, email) DO NOTHING`,
            [id, email, userId]
        );

        // Fetch product details for email
        const pRes = await pool.query('SELECT name, image_url FROM products WHERE id = $1', [id]);
        const product = pRes.rows[0];

        try {
            const html = await emailTemplates.getWaitlistConfirmationEmail(
                product.name,
                `https://gramaharvest.shop${product.image_url}`,
                `https://gramaharvest.shop/harvest`
            );

            await sendEmail({
                email,
                subject: `You're on the list: ${product.name}`,
                html
            });
        } catch (e) {
            console.error("Failed to send waitlist email", e);
        }

        res.json({ message: 'You have been added to the waitlist.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to waitlist.' });
    }
};

// @desc    Get waitlist
// @route   GET /api/products/waitlist/all
// @access  Private/Admin
const getWaitlist = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT w.id, w.email, w.created_at, w.product_id, p.name as product_name, p.image_url 
            FROM product_waitlist w
            JOIN products p ON w.product_id = p.id
            ORDER BY w.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching waitlist' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    subscribeToWaitlist,
    getWaitlist
};
