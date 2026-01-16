-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2), -- For percentage discounts
    usage_limit INTEGER, -- NULL means unlimited
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_until)
VALUES 
    ('WELCOME15', 'Welcome discount for new users', 'percentage', 15.00, 500.00, 200.00, NULL, '2026-12-31 23:59:59'),
    ('ORGANIC25', 'Special discount on organic products', 'percentage', 25.00, 1000.00, 500.00, 100, '2026-06-30 23:59:59'),
    ('FLAT100', 'Flat ₹100 off on orders above ₹500', 'fixed', 100.00, 500.00, NULL, NULL, '2026-12-31 23:59:59');
