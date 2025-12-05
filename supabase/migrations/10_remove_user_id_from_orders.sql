-- Remove unused user_id column from orders table
-- Since we're doing guest checkout, we only need customer_email

-- Step 1: Drop the dependent policy on order_items that references orders.user_id
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

-- Step 2: Drop the policy on orders that uses user_id
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Step 3: Now we can drop the user_id column
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS user_id;

-- Step 4: Recreate the orders policy using only customer_email
CREATE POLICY "Users can view their orders by email" ON public.orders 
FOR SELECT 
USING (
  customer_email = auth.jwt()->>'email'
);

-- Step 5: Recreate the order_items policy without user_id reference
CREATE POLICY "Users can view their order items by email" ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_email = auth.jwt()->>'email'
  )
);

-- Add comment for documentation
COMMENT ON TABLE public.orders IS 'Orders table for guest and authenticated purchases. Uses customer_email for order tracking.';
