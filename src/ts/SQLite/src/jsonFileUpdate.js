import fs from "fs";
import path from "path";


export function updatePackageJsonScripts(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "tsx watch src/index.ts",
      build: "tsc",
      start: "node dist/index.js",
      "db:migrate": "prisma migrate dev",
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}