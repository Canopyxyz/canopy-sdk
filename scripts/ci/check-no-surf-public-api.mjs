import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const forbiddenPattern = /@thalalabs\/surf|createSurf(?:Entry|View)FunctionPayload|SurfCompatibleAbi/;

const files = await collectDeclarationFiles(distDir);

if (files.length === 0) {
  console.error("No declaration files found in dist/. Run `pnpm build` first.");
  process.exit(1);
}

const offenders = [];

for (const file of files) {
  const content = await readFile(file, "utf8");

  if (forbiddenPattern.test(content)) {
    offenders.push(path.relative(process.cwd(), file));
  }
}

if (offenders.length > 0) {
  console.error("Surf internals leaked into the public declaration surface:");
  for (const offender of offenders) {
    console.error(`- ${offender}`);
  }
  process.exit(1);
}

console.log(`Checked ${files.length} declaration files: no Surf public API leaks found.`);

async function collectDeclarationFiles(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      files.push(...(await collectDeclarationFiles(fullPath)));
      continue;
    }

    if (entry.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}
