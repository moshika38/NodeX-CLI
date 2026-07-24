import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { updatePackageJson } from "./src/packageJsonUpdate.js";
import {
  createProjectFiles,
  updatePrismaSchema,
} from "./src/updateStructure.js";

export function setupMongoDbJsProject(projectName, databaseUrl) {
  const projectPath = path.join(process.cwd(), projectName);

  try {
    fs.ensureDirSync(projectPath);

    console.log("⚙️ Starting setup process...\n");

    execSync("npm init -y", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ npm init successful!");

    execSync("npm install express cors dotenv @prisma/client@6", {
      cwd: projectPath,
      stdio: "ignore",
    });

    execSync("npm install -D prisma@6", {
      cwd: projectPath,
      stdio: "ignore",
    });

    console.log("✅ Packages installed successfully!");

    updatePackageJson(projectPath);
    console.log("✅ package.json updated successfully!");

    execSync("npx prisma init", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ prisma init successful!");

    if (!databaseUrl || databaseUrl.trim() === "") {
      console.log("⚠️ Warning: Database url not provided!");
    } else {
      const envPath = path.join(projectPath, ".env");
      const envContent = `DATABASE_URL="${databaseUrl}"\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");
      console.log("✅ Database url updated Successfully!");
    }

    updatePrismaSchema(projectPath);
    createProjectFiles(projectPath);
    console.log("✅ Update Structure Successfully!");

    execSync("npx prisma generate", {
      cwd: projectPath,
      stdio: "ignore",
    });

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
