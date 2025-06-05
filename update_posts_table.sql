-- Add updated_at column to existing posts table
ALTER TABLE posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing posts to have updated_at = created_at
UPDATE posts SET updated_at = created_at WHERE updated_at IS NULL; 