-- Function to allow users to claim admin rights if they have the secret code
CREATE OR REPLACE FUNCTION public.claim_admin_access(secret_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin), bypassing RLS
AS $$
BEGIN
  -- 1. Check if the provided secret code matches the server-side secret
  --    (Ideally this matches what you use in the frontend or is stored in a secrets table)
  IF secret_code = 'IPAP2025' THEN
    -- 2. Update the user's profile to be an admin
    UPDATE public.profiles
    SET is_admin = TRUE
    WHERE id = auth.uid();
    
    RETURN TRUE;
  ELSE
    -- 3. Return false if code is wrong
    RETURN FALSE;
  END IF;
END;
$$;
