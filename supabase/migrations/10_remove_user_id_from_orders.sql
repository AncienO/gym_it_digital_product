-- Remove unused user_id column from orders table
-- Since we're doing guest checkout, we only need customer_email

-- Drop the existing policy that references user_id
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Drop the user_id column (foreign key constraint will be dropped automatically)
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS user_id;

-- Recreate the policy using only customer_email
CREATE POLICY "Users can view their orders by email" ON public.orders 
FOR SELECT 
USING (
  customer_email = auth.jwt()->>'email'
);

-- Add comment for documentation
COMMENT ON TABLE public.orders IS 'Orders table for guest and authenticated purchases. Uses customer_email for order tracking.';
