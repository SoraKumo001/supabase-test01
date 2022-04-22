import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.local" });

const endpoint = parsed?.NEXT_PUBLIC_SUPABASE_URL;
//const key = parsed?.NEXT_PRIVATE_SUPABASE_KEY;
const key = parsed?.NEXT_PUBLIC_SUPABASE_KEY;

const upload = async () => {
  const supabase = createClient(endpoint!, key!);
  console.log(
    await supabase.auth.signIn({ email: "a@example.com", password: "a" })
  );
  console.log(await supabase.storage.createBucket("test"));
  console.log(
    await supabase.storage
      .from("storage")
      .upload("test.txt", "aaaa", { upsert: true })
  );
  //console.log(await supabase.storage.from("storage").remove(["test2.txt"]));
  // console.log(
  //   await supabase.storage.from("storage").createSignedUrl("test.txt", 1000000)
  // );
  console.log(await supabase.storage.from("storage").getPublicUrl("test.txt"));
  console.log(await supabase.storage.from("storage").list());
};

(async () => {
  return upload();
})();
