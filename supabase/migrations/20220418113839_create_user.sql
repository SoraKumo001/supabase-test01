CREATE OR REPLACE FUNCTION public.handle_users_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
  begin
    IF (TG_OP = 'DELETE') THEN
      delete from public."User" where id=old.id;
      return old;
    ELSEIF (TG_OP = 'UPDATE') THEN
      update public."User" 
        set email=NEW.email,raw_user_meta_data=NEW.raw_user_meta_data where id=old.id;
      return new;
    ELSEIF (TG_OP = 'INSERT') THEN
      insert into public."User"(id, email,raw_user_meta_data) values(NEW.id,NEW.email,NEW.raw_user_meta_data);
      return new;
    END IF;
    return NULL;
  end;
  
$BODY$;

ALTER FUNCTION public.handle_users_update()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.handle_users_update() TO authenticated;

GRANT EXECUTE ON FUNCTION public.handle_users_update() TO postgres;

GRANT EXECUTE ON FUNCTION public.handle_users_update() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.handle_users_update() TO anon;

GRANT EXECUTE ON FUNCTION public.handle_users_update() TO service_role;

CREATE TABLE IF NOT EXISTS public."User"
(
    id uuid NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    raw_user_meta_data text,
    CONSTRAINT "User_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User"
    OWNER to postgres;

ALTER TABLE IF EXISTS public."User"
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public."User" TO anon;

GRANT ALL ON TABLE public."User" TO authenticated;

GRANT ALL ON TABLE public."User" TO postgres;

GRANT ALL ON TABLE public."User" TO service_role;
CREATE POLICY "Enable access to all users"
    ON public."User"
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

CREATE trigger on_auth_user_update
  AFTER INSERT OR UPDATE OR DELETE ON auth.users
  for each row execute procedure public.handle_users_update();