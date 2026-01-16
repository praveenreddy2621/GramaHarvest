const pool = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    const name = process.env.ADMIN_NAME || 'Admin User';
    const email = process.env.ADMIN_EMAIL || 'admin@gramaharvest.shop';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error('❌ Error: ADMIN_PASSWORD not set in .env file');
        console.log('Please add ADMIN_PASSWORD=your_password to your .env file');
        process.exit(1);
    }

    try {
        console.log('Creating admin user...');

        // Check if admin already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, 'admin')`,
            [name, email, hashedPassword]
        );

        console.log(`✅ Admin user created successfully.`);
        console.log(`Email: ${email}`);
        console.log(`Password: [HIDDEN - Check your .env file]`);
        process.exit(0);

    } catch (err) {
        console.error('Error creating admin user:', err);
        process.exit(1);
    }
};

createAdmin();
