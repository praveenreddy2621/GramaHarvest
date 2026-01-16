const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'praveenreddy',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default DB
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        await client.query('CREATE DATABASE gramaharvest');
        console.log('Database gramaharvest created successfully.');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database gramaharvest already exists.');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await client.end();
    }
};

createDb();
