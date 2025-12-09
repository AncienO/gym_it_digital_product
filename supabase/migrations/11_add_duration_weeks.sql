-- Add duration_weeks column to products table for automation logic
ALTER TABLE public.products 
ADD COLUMN duration_weeks INTEGER;

COMMENT ON COLUMN public.products.duration_weeks IS 'Duration of the program in weeks, used for email automation scheduling.';
