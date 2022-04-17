import toml from "toml";
import { promises as fs } from "fs";
import { spawn } from "child_process";

const readConfig = async () => {
  const config = await fs
    .readFile("supabase/config.toml", "utf8")
    .catch(() => undefined);
  return config && toml.parse(config);
};

(async () => {
  const config = await readConfig();
  if (!config) {
    console.log("error");
  }
  const projectId = config.project_id as string;

  const proc = spawn(
    "docker",
    `exec supabase_db_${projectId} pg_dump postgresql://postgres:postgres@localhost/postgres`.split(
      " "
    )
  ).on("data", () => {});
  proc.stdout.on("data", (v) => console.log(v.toString()));
  proc.stderr.on("data", (v) => console.error(v.toString()));
})();
