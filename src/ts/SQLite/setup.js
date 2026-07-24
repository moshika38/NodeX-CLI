import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createProjectFiles } from "./src/updateStructure.js";
import { updatePackageJsonScripts } from "./src/jsonFileUpdate.js";
import { updatePrismaSchema } from "./src/prismaSchema.js";

export function setupProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  try {
    //! 1. Create folder
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    console.log("⚙️ Starting setup process...\n");

    //! 2. npm init
    execSync("npm init -y", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ npm init successful!");

    //! 3. install express
    execSync("npm install express", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ express installed successfully!");

    //! 4. npm install express dotenv
    execSync("npm install express dotenv", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ dotenv installed successfully!");

    //! 5. npm install typescript (dev dependencies)
    execSync("npm install -D typescript tsx @types/node @types/express", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ typescript installed successfully!");

    //! 6. init tsc
   
    execSync("npx tsc --init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ init tsc successfully!");

    //! 7. update package.json
    updatePackageJsonScripts(projectPath);
    console.log("✅ package.json updated successfully!");

    //! 8. Installing prisma
    execSync("npx prisma init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ Prisma installed successfully!");

    //! 9. Update prisma schema
    updatePrismaSchema(projectPath);
    console.log("✅ Prisma schema updated successfully!");

    //! 10. Edit config files
    createProjectFiles(projectPath);
    console.log("✅ Config files updated successfully!");

    //! 11. Database & Prisma Client Setup
    execSync("npm install prisma@latest @prisma/client@latest --save-dev", {
      cwd: projectPath,
      stdio: "ignore",
    });
    execSync(
      "npm install @prisma/adapter-better-sqlite3 better-sqlite3 && npm install -D @types/better-sqlite3 && npx prisma generate && npx prisma migrate dev --name init",
      { cwd: projectPath, stdio: "ignore" },
    );
    console.log("✅ Database and Prisma setup completed successfully!");

    console.log(`\n🎉 Project '${projectName}' setup finished successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("\n❌ An error occurred during setup:", error.message);
  }
}
