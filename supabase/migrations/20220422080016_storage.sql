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


CREATE TABLE IF NOT EXISTS public."Storage"
(
  id uuid not null
  , bucket_id text
  , name text
  , owner uuid
  , created_at timestamp(6) with time zone default now()
  , updated_at timestamp(6) with time zone default now()
  , last_accessed_at timestamp(6) with time zone default now()
  , metadata jsonb
  , primary key (id)
);


CREATE OR REPLACE FUNCTION public.handle_storage_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
  begin
    IF (TG_OP = 'DELETE') THEN
      delete from public."Storage" where id=old.id;
      return old;
    ELSEIF (TG_OP = 'UPDATE') THEN
      update public."Storage" 
        set bucket_id=NEW.bucket_id,name=NEW.name,owner=NEW.owner,
            created_at=NEW.created_at,updated_at=NEW.updated_at,
            last_accessed_at=NEW.last_accessed_at,metadata=NEW.metadata where id=old.id;
      return NEW;
    ELSEIF (TG_OP = 'INSERT') THEN
      insert into public."Storage"(id, bucket_id,name,owner,created_at,updated_at,last_accessed_at,metadata) 
        values(NEW.id,NEW.bucket_id,NEW.name,NEW.owner,NEW.created_at,NEW.updated_at,NEW.last_accessed_at,NEW.metadata);
      return new;
    END IF;
    return NULL;
  end;
  
$BODY$;

CREATE trigger handle_storage_update
  AFTER INSERT OR UPDATE OR DELETE ON storage.objects
  for each row execute procedure public.handle_storage_update();

CREATE POLICY "Enable access to owner"
ON public."Storage"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid()=owner);