const pool = require('../config/db');

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
    const { fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;
    const userId = req.user.id;

    try {
        if (isDefault) {
            // Set all other addresses to not default
            await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
        }

        const newAddress = await pool.query(
            `INSERT INTO addresses (user_id, full_name, phone, street, city, state, zip_code, country, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [userId, fullName, phone, street, city, state, zipCode, country || 'India', isDefault || false]
        );

        res.status(201).json(newAddress.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding address' });
    }
};

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
    const userId = req.user.id;

    try {
        const addresses = await pool.query(
            'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [userId]
        );
        res.json(addresses.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching addresses' });
    }
};

module.exports = { addAddress, getAddresses };
