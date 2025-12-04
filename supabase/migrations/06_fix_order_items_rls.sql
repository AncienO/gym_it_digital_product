-- Allow anyone to insert order_items (needed for guest checkout)
CREATE POLICY "Anyone can insert order items" ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view order items for their orders
CREATE POLICY "Users can view their order items" ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND (orders.customer_email = auth.jwt()->>'email' OR auth.uid() = orders.user_id)
  )
);

-- Also update orders policy to allow anyone to insert (for guest checkout)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Anyone can insert orders" ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR customer_email = auth.jwt()->>'email'
);
