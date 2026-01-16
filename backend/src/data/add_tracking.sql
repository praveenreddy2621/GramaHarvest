-- Add tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN courier_service VARCHAR(100),
ADD COLUMN tracking_number VARCHAR(100),
ADD COLUMN tracking_url TEXT,
ADD COLUMN shipped_date TIMESTAMP,
ADD COLUMN estimated_delivery_date DATE;
