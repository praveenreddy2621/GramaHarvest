-- Add user_type column to coupons table
ALTER TABLE coupons 
ADD COLUMN user_type VARCHAR(20) DEFAULT 'all';

-- Possible values: 'all', 'first_time', 'returning'

-- Create table to track user coupon usage
CREATE TABLE IF NOT EXISTS user_coupon_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coupon_id INTEGER NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id INTEGER REFERENCES orders(id),
    UNIQUE(user_id, coupon_id)
);

CREATE INDEX idx_user_coupon_usage ON user_coupon_usage(user_id, coupon_id);

-- Update existing coupons to 'all'
UPDATE coupons SET user_type = 'all' WHERE user_type IS NULL;
