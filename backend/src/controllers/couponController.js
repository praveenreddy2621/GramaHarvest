const pool = require('../config/db');

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    const { code, orderAmount } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM coupons 
             WHERE code = $1 
             AND is_active = true 
             AND (valid_until IS NULL OR valid_until > NOW())
             AND (usage_limit IS NULL OR used_count < usage_limit)`,
            [code.toUpperCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        const coupon = result.rows[0];

        // Check user type restriction
        if (coupon.user_type === 'first_time') {
            // Check if user has any previous orders
            const orderCheck = await pool.query(
                'SELECT COUNT(*) as order_count FROM orders WHERE user_id = $1',
                [userId]
            );
            if (parseInt(orderCheck.rows[0].order_count) > 0) {
                return res.status(400).json({
                    message: 'This coupon is only valid for first-time users'
                });
            }
        }

        // Check if user has already used this coupon
        const usageCheck = await pool.query(
            'SELECT * FROM user_coupon_usage WHERE user_id = $1 AND coupon_id = $2',
            [userId, coupon.id]
        );

        if (usageCheck.rows.length > 0) {
            return res.status(400).json({
                message: 'You have already used this coupon code'
            });
        }

        // Check minimum order amount
        if (orderAmount < coupon.min_order_amount) {
            return res.status(400).json({
                message: `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (orderAmount * coupon.discount_value) / 100;
            // Apply max discount limit if exists
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        } else {
            discountAmount = coupon.discount_value;
        }

        res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                finalAmount: parseFloat((orderAmount - discountAmount).toFixed(2))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error validating coupon' });
    }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM coupons ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching coupons' });
    }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    const {
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        usageLimit,
        validUntil,
        userType
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO coupons 
             (code, description, discount_type, discount_value, min_order_amount, 
              max_discount_amount, usage_limit, valid_until, user_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderAmount || 0,
                maxDiscountAmount || null,
                usageLimit || null,
                validUntil || null,
                userType || 'all'
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(500).json({ message: 'Error creating coupon' });
    }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const {
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        usageLimit,
        validUntil,
        isActive,
        userType
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE coupons 
             SET code = $1, description = $2, discount_type = $3, discount_value = $4,
                 min_order_amount = $5, max_discount_amount = $6, usage_limit = $7,
                 valid_until = $8, is_active = $9, user_type = $10, updated_at = NOW()
             WHERE id = $11
             RETURNING *`,
            [
                code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderAmount,
                maxDiscountAmount,
                usageLimit,
                validUntil,
                isActive,
                userType || 'all',
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating coupon' });
    }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM coupons WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting coupon' });
    }
};

// @desc    Increment coupon usage count & record user usage
// @route   POST /api/coupons/:id/use
// @access  Private
const useCoupon = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Added via auth middleware
    const { orderId } = req.body; // Expect orderId in body (optional but good for tracking)

    try {
        // Start transaction
        await pool.query('BEGIN');

        // Increment global count
        await pool.query(
            'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
            [id]
        );

        // Record user usage
        await pool.query(
            'INSERT INTO user_coupon_usage (user_id, coupon_id, order_id) VALUES ($1, $2, $3)',
            [userId, id, orderId || null]
        );

        await pool.query('COMMIT');

        res.json({ message: 'Coupon usage recorded' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        if (error.code === '23505') { // Unique violation (already used)
            return res.status(400).json({ message: 'Coupon already used by this user' });
        }
        res.status(500).json({ message: 'Error recording coupon usage' });
    }
};

// @desc    Get active public coupons
// @route   GET /api/coupons/public
// @access  Public
const getPublicCoupons = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT code, description, user_type FROM coupons 
             WHERE is_active = true 
             AND user_type IN ('all', 'first_time')
             AND (valid_until IS NULL OR valid_until > NOW())
             AND (usage_limit IS NULL OR used_count < usage_limit)
             ORDER BY created_at DESC
             LIMIT 5`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching public coupons' });
    }
};

module.exports = {
    validateCoupon,
    getAllCoupons,
    getPublicCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    useCoupon
};
