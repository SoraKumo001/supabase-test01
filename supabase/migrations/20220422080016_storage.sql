insert into storage.buckets (id,name,public) values ('storage','storage',true);

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'public' or auth.uid() = owner);

CREATE POLICY "Enable INSERT for authenticated users only"
    ON storage.objects
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY "Enable DELETE for users based on user_id"
    ON storage.objects
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (auth.uid() = owner);
CREATE POLICY "Enable UPDATE for users based on user_id"
    ON storage.objects
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (auth.uid() = owner);    
