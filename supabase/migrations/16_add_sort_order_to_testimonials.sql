-- Add sort_order to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

-- Update existing testimonials to have sequential sort order based on created_at
-- This ensures existing testimonials have a valid order
WITH ranked_testimonials AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rnk
  FROM testimonials
)
UPDATE testimonials
SET sort_order = ranked_testimonials.rnk
FROM ranked_testimonials
WHERE testimonials.id = ranked_testimonials.id;
