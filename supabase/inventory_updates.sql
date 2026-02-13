-- =====================================================================
-- DATABASE UPDATES FOR INVENTORY MANAGEMENT & REPORTING
-- =====================================================================

-- 1. Create a function to decrement stock atomically
CREATE OR REPLACE FUNCTION public.decrement_stock(variant_id TEXT, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Perform atomic update
  UPDATE public.product_variants
  SET stock = stock - quantity
  WHERE id = variant_id AND stock >= quantity;

  -- Raise exception if update failed (e.g. insufficient stock)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variant %', variant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Trigger to update product 'sold_count' when an order is completed/paid
--    Using a trigger on order_items or orders. simpler to do on order creation 
--    if we assume 'placed' means 'sold' for now, or wait for status change to 'PAID'.
--    Let's assume insertion into order_items means a sale is confirmed for simplicity first.

CREATE OR REPLACE FUNCTION public.update_product_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET sold_count = sold_count + NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_created
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_product_sold_count();


-- 3. Views/Queries for Reporting: Total Sales
--    We calculate total sales based on SUM(total_amount) of valid orders
--    This matches the requirement: "replace total value into total sales, which should match accordingly on the system"

CREATE OR REPLACE VIEW public.admin_sales_stats AS
SELECT 
    COUNT(*) as total_orders,
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END), 0) as pending_orders,
    COALESCE(SUM(CASE WHEN created_at > (NOW() - INTERVAL '30 days') THEN total_amount ELSE 0 END), 0) as monthly_revenue
FROM public.orders
WHERE status != 'CANCELLED';

-- Grant access to this view (adjust RLS as needed, or access via service role)
-- By default views need ownership/permissions handling.
GRANT SELECT ON public.admin_sales_stats TO authenticated; 
-- (Practically limit this to admins in application logic or RLS on underlying tables)
