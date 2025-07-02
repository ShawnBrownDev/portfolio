-- First, let's backup the existing data
CREATE TABLE IF NOT EXISTS projects_backup AS SELECT * FROM projects;
CREATE TABLE IF NOT EXISTS project_categories_backup AS SELECT * FROM project_categories;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Anyone can view published projects" ON projects;

-- Alter existing projects table
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS demourl TEXT,
  ADD COLUMN IF NOT EXISTS githuburl TEXT,
  ADD COLUMN IF NOT EXISTS additionalimages TEXT[],
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
  ALTER COLUMN challenges SET DATA TYPE TEXT[] USING ARRAY[challenges::TEXT],
  ALTER COLUMN solutions SET DATA TYPE TEXT[] USING ARRAY[solutions::TEXT],
  ALTER COLUMN impact SET DATA TYPE TEXT USING impact::TEXT;

-- Update project_categories table structure if needed
ALTER TABLE project_categories
  DROP CONSTRAINT IF EXISTS project_categories_pkey,
  ADD CONSTRAINT project_categories_pkey PRIMARY KEY (project_id, category_id);

-- Enable RLS on both tables if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to view all published projects
CREATE POLICY "Anyone can view published projects"
ON projects
FOR SELECT
USING (is_published = true);

-- Create a policy that allows users to view their own projects regardless of published status
CREATE POLICY "Users can view their own projects"
ON projects
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own projects
CREATE POLICY "Users can insert their own projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own projects
CREATE POLICY "Users can update their own projects"
ON projects
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to delete their own projects
CREATE POLICY "Users can delete their own projects"
ON projects
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create a policy for project_categories that allows users to manage categories for their own projects
CREATE POLICY "Users can manage their project categories"
ON project_categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_categories.project_id
        AND projects.user_id = auth.uid()
    )
); 