-- Add coupon tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN coupon_id INTEGER REFERENCES coupons(id),
ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0.00;
