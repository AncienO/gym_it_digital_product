-- Add sort_order to products table
ALTER TABLE products 
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- Update existing products to have sequential sort order based on created_at
WITH ranked_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rnk
  FROM products
)
UPDATE products
SET sort_order = ranked_products.rnk
FROM ranked_products
WHERE products.id = ranked_products.id;
