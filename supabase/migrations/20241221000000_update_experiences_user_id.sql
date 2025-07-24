-- Update existing experiences with current user ID
-- Migration: 20241221000000_update_experiences_user_id.sql

-- First, let's get the current user ID from auth.users
-- This will update all experiences that have NULL user_id
UPDATE experiences 
SET user_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'shawnbrown@gmail.com'  -- Replace with your actual email
    LIMIT 1
)
WHERE user_id IS NULL;

-- Alternative: If you want to update with a specific user ID, uncomment and modify this:
-- UPDATE experiences 
-- SET user_id = 'your-user-uuid-here'  -- Replace with your actual user UUID
-- WHERE user_id IS NULL;

-- Verify the update
SELECT 
    id,
    user_id,
    title,
    company,
    period
FROM experiences 
ORDER BY order_index ASC; 