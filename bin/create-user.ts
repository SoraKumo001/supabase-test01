import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.local" });

const endpoint = parsed?.NEXT_PUBLIC_SUPABASE_URL;
const key = parsed?.SUPABASE_KEY;

const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = createClient(endpoint!, key!);
  const result = await supabase.auth.api.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: email },
  });
  return result;
};

(async () => {
  if (!endpoint || !key || process.argv.length < 4) {
    console.log("create-user [email] [password]");
  } else {
    let result;
    for (let i = 0; i < 3; i++) {
      result = await createUser({
        email: process.argv[2],
        password: process.argv[3],
      });
      if (result.error?.status !== 500) break;
    }
    console.log(result);
  }
})();
