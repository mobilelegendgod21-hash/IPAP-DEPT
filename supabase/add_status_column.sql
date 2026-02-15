-- Add status column to products table
ALTER TABLE public.products 
ADD COLUMN status TEXT CHECK (status IN ('ACTIVE', 'ARCHIVED', 'DRAFT')) DEFAULT 'ACTIVE';

-- Update existing records to have ACTIVE status
UPDATE public.products SET status = 'ACTIVE' WHERE status IS NULL;
