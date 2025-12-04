-- 1. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', true) -- Using public for now for simplicity, ideally private with signed URLs
ON CONFLICT (id) DO NOTHING;

-- 2. Set up security policies for product-images
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users (admins) to upload/update/delete
CREATE POLICY "Admin Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );


-- 3. Set up security policies for product-files
-- Allow public read access (or restrict as needed)
CREATE POLICY "Public Access Files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-files' );

-- Allow authenticated users (admins) to upload/update/delete
CREATE POLICY "Admin Insert Files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-files' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update Files"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-files' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Files"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-files' AND auth.role() = 'authenticated' );
