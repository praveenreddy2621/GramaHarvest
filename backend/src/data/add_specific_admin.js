const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const addSpecificAdmin = async () => {
    const name = 'Praveen Reddy';
    const email = 'praveenreddy@gramaharvest.shop';
    const password = 'gramaharvest_admin'; // Default password

    try {
        console.log(`Processing admin user for ${email}...`);

        // Check availability
        const checkRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkRes.rows.length > 0) {
            // User exists, upgrade to admin
            console.log('User exists. Updating role to Admin...');
            await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
            console.log('User updated to Admin successfully.');
        } else {
            // Create New
            console.log('User does not exist. Creating new Admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.query(
                `INSERT INTO users (name, email, password, role, created_at) 
                 VALUES ($1, $2, $3, 'admin', NOW())`,
                [name, email, hashedPassword]
            );
            console.log('Admin user created successfully.');
            console.log(`Password: ${password}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error adding admin:', err);
        process.exit(1);
    }
};

addSpecificAdmin();
