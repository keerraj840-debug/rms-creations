-- Create a public bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access (anyone can read)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'images' );

-- Set up storage policies for authenticated users to upload/update/delete
CREATE POLICY "Auth Users Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Auth Users Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'images' );

CREATE POLICY "Auth Users Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'images' );
