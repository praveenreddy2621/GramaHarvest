require('dotenv').config({ debug: true });
const app = require('./src/app');
const products = require('./src/data/products');

const PORT = process.env.PORT || 5001;


const http = require('http');
const socketUtils = require('./src/utils/socket');

const server = http.createServer(app);

// Initialize Socket.io
socketUtils.init(server);

// API Routes are now handled in src/app.js

// Mock DB Connection for now
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
