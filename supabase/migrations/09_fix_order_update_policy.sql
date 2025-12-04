-- Add UPDATE policy for orders table to allow payment verification to update order status
-- This is needed for the payment verification API to update order status from 'pending' to 'completed'

CREATE POLICY "Allow service role to update orders" ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (true);
