const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const redis = require('./utils/redis');
const { RedisStore } = require('rate-limit-redis');


const app = express();

// Trust Nginx Proxy (Required for Rate Limiting & Correct Client IP)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow Nginx to serve images
}));

// CORS Configuration
// CORS Configuration
const whitelist = ['https://gramaharvest.shop', 'https://www.gramaharvest.shop', 'http://localhost:3000', 'http://localhost'];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (whitelist.indexOf(origin) !== -1 || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
            callback(null, true);
        } else {
            // Don't throw error, just block
            callback(null, false);
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix: 'rl:',
    }),
});
app.use('/api', limiter);

app.use((req, res, next) => {
    if (req.path === '/api/contact') {
        console.log('Incoming request to /api/contact:', {
            method: req.method,
            headers: req.headers,
            body: req.body
        });
    }
    next();
});

app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// Prevent HTTP Param Pollution
app.use(hpp());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Gramaharvest API' });
});

module.exports = app;
