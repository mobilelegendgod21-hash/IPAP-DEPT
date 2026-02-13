-- Create a new storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy to allow public viewing of avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload avatar images
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Policy to allow users to update their own avatar (optional, depends on file path strategy)
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.uid() = owner )
  with check ( bucket_id = 'avatars' AND auth.uid() = owner );
