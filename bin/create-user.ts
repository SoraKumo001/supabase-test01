import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.local" });

const endpoint = parsed?.NEXT_PUBLIC_SUPABASE_URL;
const key = parsed?.SUPABASE_KEY;

(async () => {
  if (!endpoint || !key || process.argv.length < 4) {
    console.log("create-user [email] [password]");
  } else {
    const supabase = createClient(endpoint, key);
    const email = process.argv[2];
    const password = process.argv[3];
    const result = await supabase.auth.api.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: email },
    });
    console.log(result);
  }
})();
