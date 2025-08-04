-- Run this SQL in your Supabase Dashboard > SQL Editor to add video support

-- Add video URL column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS videourl TEXT;

-- Add comment to document the column
COMMENT ON COLUMN projects.videourl IS 'URL for project demo video (YouTube, Vimeo, Loom, or direct video URL)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'videourl';