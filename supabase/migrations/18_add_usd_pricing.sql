-- Add price_usd column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_usd decimal(10, 2);

-- Add currency column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'GHS';
