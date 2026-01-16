const bcrypt = require('bcryptjs');
const pool = require('../config/db');
require('dotenv').config();

const adminUser = {
    name: 'Praveen Reddy',
    email: 'praveenreddy@gramaharvest.shop',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    role: 'admin'
};

async function createOrUpdateAdmin() {
    try {
        console.log('Creating/Updating admin user...');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);

        // Check if user exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminUser.email]
        );

        if (existingUser.rows.length > 0) {
            // Update existing user
            await pool.query(
                'UPDATE users SET name = $1, password = $2, role = $3 WHERE email = $4',
                [adminUser.name, hashedPassword, adminUser.role, adminUser.email]
            );
            console.log('✅ Admin user updated successfully!');
        } else {
            // Create new user
            await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                [adminUser.name, adminUser.email, hashedPassword, adminUser.role]
            );
            console.log('✅ Admin user created successfully!');
        }

        console.log('\nAdmin Credentials:');
        console.log('Email:', adminUser.email);
        console.log('Password: [HIDDEN - Check your .env file]');
        console.log('Role:', adminUser.role);

        process.exit(0);
    } catch (error) {
        console.error('Error creating/updating admin:', error);
        process.exit(1);
    }
}

createOrUpdateAdmin();
