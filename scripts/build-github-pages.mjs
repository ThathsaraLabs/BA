import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const build = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  env: { ...process.env, GITHUB_PAGES: "true" },
  stdio: "inherit",
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

for (const file of await readdir("out/_next", { recursive: true })) {
  if (!file.endsWith(".css")) continue;
  const path = join("out/_next", file);
  const css = await readFile(path, "utf8");
  const prefixed = css.replace(/url\((['"]?)\/images\//g, "url($1/BA/images/");
  if (prefixed !== css) await writeFile(path, prefixed);
}
await writeFile("out/.nojekyll", "");
