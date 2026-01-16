const pool = require('../config/db');
const products = require('./products');

const seedProducts = async () => {
    try {
        console.log('Seeding products...');

        const countRes = await pool.query('SELECT COUNT(*) FROM products');
        if (parseInt(countRes.rows[0].count) > 0) {
            console.log('Products already exist in DB. Skipping seed.');
            process.exit(0);
        }

        for (const p of products) {
            await pool.query(
                `INSERT INTO products (name, description, price, image_url, category, stock, is_preorder)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [p.name, p.description, p.price, p.image, p.category, 100, false]
            );
            console.log(`Seeded: ${p.name}`);
        }

        console.log('Product Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedProducts();
