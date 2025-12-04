-- Create product_duration table for tracking program start and end dates
CREATE TABLE IF NOT EXISTS public.product_duration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster lookups by order
CREATE INDEX idx_product_duration_order_id ON public.product_duration(order_id);

-- Add index for querying by end date (for future reminder automation)
CREATE INDEX idx_product_duration_end_date ON public.product_duration(end_date);

-- Enable RLS
ALTER TABLE public.product_duration ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (when order is created)
CREATE POLICY "Allow insert for completed orders" ON public.product_duration
    FOR INSERT
    WITH CHECK (true);

-- Allow users to view their own product durations
CREATE POLICY "Users can view own product durations" ON public.product_duration
    FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_email = auth.jwt() ->> 'email'
        )
    );
