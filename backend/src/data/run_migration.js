const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const run = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(sql);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error(err);
    } finally {
        // Pool needs to be closed? Usually process.exit() forces it.
        process.exit();
    }
};

run();
