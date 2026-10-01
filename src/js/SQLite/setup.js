import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process"; 

import { updatePackageJson } from "./src/packageJsonUpdate.js";
import {
  createProjectFiles,
  updatePrismaSchema,
} from "./src/updateStructure.js";
import { toValidNpmName } from "../../utils/sanitize.js";

export function setupSqliteJsProject(projectName, packageName) {
  const projectPath = path.resolve(process.cwd(), projectName);
  const pkgName = packageName || toValidNpmName(projectName);

  try {
    //! 1. Create folder
    fs.mkdirSync(projectPath, { recursive: true });

    console.log("⚙️ Starting setup process...\n");

    //! 2. npm init
    execSync("npm init -y", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ npm init successful!");

    //! 3. install packages
     
    execSync("npm install express cors dotenv @prisma/client@6 prisma@6", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ packages installed successfully!");

    //! 4. update package.json
    updatePackageJson(projectPath, pkgName);
    console.log("✅ package.json updated successfully!");

    //! 5. update database url

    const envPath = path.resolve(projectPath, ".env");
    const envContent = `DATABASE_URL="file:./dev.db"\n`;
    fs.writeFileSync(envPath, envContent, "utf-8");

    console.log("✅ Database url updated Successfully!");

    //! 6. Creating project folders
    updatePrismaSchema(projectPath);
    createProjectFiles(projectPath);
    console.log("✅ Update  Structure Successfully!");

    // Ensure no unsupported prisma.config.* file exists
    ["prisma.config.ts", "prisma.config.js", "prisma.config.mjs"].forEach((file) => {
      const filePath = path.resolve(projectPath, file);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
      }
    });

    //! 7. generate prisma client

    execSync("npx prisma generate --schema=./prisma/schema.prisma", {
      cwd: projectPath,
      stdio: "ignore",
    });
    execSync("npx prisma migrate dev --name init --schema=./prisma/schema.prisma", {
      cwd: projectPath,
      stdio: "ignore",
    });
    execSync("npx prisma db push --schema=./prisma/schema.prisma", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Configured Successfully!");



    console.log(`\n🎉 Project '${projectName}' setup finished successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("\n❌ An error occurred during setup:", error.message);
  }
}

