-- Add missing SELECT policy for admins on collections table
CREATE POLICY "Admins can view all collections" 
ON collections FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Note: The existing "Public collections are viewable by everyone" policy only shows active collections.
-- This new policy allows admins to see everything.
