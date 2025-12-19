-- Add is_approved column to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Update existing testimonials to be approved
UPDATE testimonials SET is_approved = TRUE WHERE is_approved IS FALSE;

-- Enable RLS for the new column if needed (policies usually cover the whole row)
-- ensuring the existing policies cover the new column implicitly.

-- Separate policy for public insert (if we want to go that route, but we are using service role action for public submission which bypasses RLS on insert, so we don't need a public insert policy)
