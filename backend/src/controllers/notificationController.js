const pool = require('../config/db');
const { sendNotification } = require('../utils/socket');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        await pool.query(
            'UPDATE notifications SET status = \'read\' WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create and send a notification (system internal use)
const createNotification = async (userId, { title, message, type = 'info', link = null }) => {
    try {
        const result = await pool.query(
            'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, message, type, link]
        );

        const newNotification = result.rows[0];

        // Push in real-time via socket
        sendNotification(userId, newNotification);

        return newNotification;
    } catch (error) {
        console.error('Failed to create notification', error);
    }
};

module.exports = { getNotifications, markAsRead, createNotification };
