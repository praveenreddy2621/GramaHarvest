require('dotenv').config();
const app = require('./src/app');
const products = require('./src/data/products');

const PORT = process.env.PORT || 5001;


// API Routes are now handled in src/app.js

// Mock DB Connection for now
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
