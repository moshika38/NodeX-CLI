import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

import { updatePackageJson } from "./src/packageJsonUpdate.js";
import {
  createProjectFiles,
  updatePrismaSchema,
} from "./src/updateStructure.js";

export function setupPostgreSqlJsProject(projectName, databaseUrl) {
  const projectPath = path.join(process.cwd(), projectName);

  try {
    //! 1. Create folder
    fs.ensureDirSync(projectPath);

    console.log("⚙️ Starting setup process...\n");

    //! 2. npm init
    execSync("npm init -y", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ npm init successful!");

    //! 3. install packages

    execSync(
      "npm install express cors dotenv @prisma/client @prisma/adapter-pg pg prisma",
      {
        cwd: projectPath,
        stdio: "ignore",
      },
    );
    console.log("✅ packages installed successfully!");

    //! 4. update package.json
    updatePackageJson(projectPath);
    console.log("✅ package.json updated successfully!");

    //! 5. init prisma
    execSync("npx prisma init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ prisma init successful!");

    //! 6. update database url

    if (!databaseUrl || databaseUrl.trim() === "") {
      console.log("⚠️ Warning: Database url not provided!");
    } else {
      const envPath = path.join(projectPath, ".env");
      const envContent = `DATABASE_URL="${databaseUrl}"\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");
      console.log("✅ Database url updated Successfully!");
    }

    //! 9. Creating project folders

    updatePrismaSchema(projectPath);
    createProjectFiles(projectPath);
    execSync("npm install @prisma/adapter-pg pg", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Update  Structure Successfully!");

    //! 10. generate prisma client
    execSync("npx prisma generate", { cwd: projectPath, stdio: "ignore" });
    // execSync("npx prisma migrate dev --name init", {
    //   cwd: projectPath,
    //   stdio: "ignore",
    // });
    if (databaseUrl && databaseUrl.trim() !== "") {
      execSync("npx prisma db push", { cwd: projectPath, stdio: "ignore" });
    } else {
      console.log(
        "⚠️ Warning: Cannot push database to remote server! Update database url in .env and run `npx prisma db push`",
      );
    }
    console.log("✅ Configured Successfully!");

    console.log(`\n🎉 Project '${projectName}' setup finished successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("\n❌ An error occurred during setup:", error.message);
  }
}
