-- Add video URL column to projects table
ALTER TABLE projects 
ADD COLUMN videourl TEXT;

-- Add comment to document the column
COMMENT ON COLUMN projects.videourl IS 'URL for project demo video (YouTube, Vimeo, or direct video URL)';