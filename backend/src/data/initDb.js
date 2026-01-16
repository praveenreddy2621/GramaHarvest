const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const products = require('./products');

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await pool.query(schemaSql);
        console.log('Schema created successfully.');

        // Seed Products
        const productCountRes = await pool.query('SELECT COUNT(*) FROM products');
        const productCount = parseInt(productCountRes.rows[0].count);

        if (productCount === 0) {
            console.log('Seeding products...');
            for (const product of products) {
                await pool.query(
                    `INSERT INTO products (name, category, price, description, image_url, stock)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        product.name,
                        product.category,
                        product.price,
                        product.description,
                        product.image,
                        100 // Default stock
                    ]
                );
            }
            console.log('Products seeded successfully.');
        } else {
            console.log('Products already exist. Skipping seed.');
        }

        console.log('Database initialization complete.');
        process.exit(0);

    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

initDb();
