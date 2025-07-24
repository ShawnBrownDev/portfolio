-- Create experiences table
-- Migration: 20241219000000_create_experiences_table.sql

-- Create experiences table (if not exists)
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on experiences table (if not already enabled)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for experiences table (only if they don't exist)
DO $$
BEGIN
    -- Users can view their own experiences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'experiences' AND policyname = 'Users can view their own experiences') THEN
        CREATE POLICY "Users can view their own experiences"
        ON experiences
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    -- Users can insert their own experiences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'experiences' AND policyname = 'Users can insert their own experiences') THEN
        CREATE POLICY "Users can insert their own experiences"
        ON experiences
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Users can update their own experiences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'experiences' AND policyname = 'Users can update their own experiences') THEN
        CREATE POLICY "Users can update their own experiences"
        ON experiences
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Users can delete their own experiences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'experiences' AND policyname = 'Users can delete their own experiences') THEN
        CREATE POLICY "Users can delete their own experiences"
        ON experiences
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create a function to update the updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for experiences table (if not exists)
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON experiences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 