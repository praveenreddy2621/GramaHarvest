const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const runUpdate = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'add_reset_token_columns.sql'), 'utf8');
        await pool.query(sql);
        console.log('Update migration successful');
    } catch (err) {
        console.error('Update migration failed:', err);
    } finally {
        process.exit();
    }
};

runUpdate();
