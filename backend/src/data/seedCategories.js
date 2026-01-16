const pool = require('../config/db');
require('dotenv').config();

const categories = [
    { name: 'Dairy', description: 'Fresh dairy products including milk, ghee, and paneer' },
    { name: 'Grains', description: 'Organic grains and cereals' },
    { name: 'Spices', description: 'Authentic Indian spices and masalas' },
    { name: 'Pickles', description: 'Traditional homemade pickles' },
    { name: 'Oils', description: 'Cold-pressed and organic oils' },
    { name: 'Vegetables', description: 'Fresh organic vegetables' },
    { name: 'Fruits', description: 'Seasonal fresh fruits' }
];

async function seedCategories() {
    try {
        console.log('Seeding categories...');

        for (const category of categories) {
            await pool.query(
                'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
                [category.name, category.description]
            );
            console.log(`✓ Added: ${category.name}`);
        }

        console.log('\n✅ Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
