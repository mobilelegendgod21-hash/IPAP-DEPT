-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );

-- Allow admins to update orders (e.g. status)
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );

-- Allow admins to view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );
