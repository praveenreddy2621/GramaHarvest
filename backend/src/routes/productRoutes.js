const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    subscribeToWaitlist,
    getWaitlist
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const cache = require('../middleware/cacheMiddleware');

// Image upload endpoint
router.post('/upload', protect, admin, (req, res, next) => {
    console.log('--- Start Image Upload ---');
    console.log('Headers:', req.headers['content-type']);
    next();
}, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            console.log('Upload Failed: No file provided');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Upload Success:', req.file.filename);
        // Return the file path that can be used as imageUrl
        const imageUrl = `/uploads/products/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Upload Route Error:', error);
        res.status(500).json({ message: 'Error uploading image: ' + error.message });
    }
});

router.post('/upload-multiple', protect, admin, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        res.json({ imageUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading images' });
    }
});

router.get('/waitlist/all', protect, admin, getWaitlist);
router.post('/:id/notify', subscribeToWaitlist);

router.route('/')
    .get(cache(300), getProducts)
    .post(protect, admin, createProduct);

router.route('/:id')
    .get(cache(300), getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
