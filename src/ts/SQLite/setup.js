import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { createProjectFiles } from "./src/updateStructure.js";
import { updatePackageJsonScripts } from "./src/jsonFileUpdate.js";
import { updatePrismaSchema } from "./src/prismaSchema.js";
import { toValidNpmName } from "../../utils/sanitize.js";

export function setupSqliteProject(projectName, packageName) {
  const projectPath = path.resolve(process.cwd(), projectName);
  const pkgName = packageName || toValidNpmName(projectName);

  try {
    //! 1. Create folder
    fs.mkdirSync(projectPath, { recursive: true });

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
    updatePackageJsonScripts(projectPath, pkgName);
    console.log("✅ package.json updated successfully!");

    //! 8. Update prisma schema
    updatePrismaSchema(projectPath);
    console.log("✅ Prisma schema updated successfully!");

    //! 9. Edit config files
    createProjectFiles(projectPath);
    console.log("✅ Config files updated successfully!");

    // Ensure no unsupported prisma.config.* file exists
    ["prisma.config.ts", "prisma.config.js", "prisma.config.mjs"].forEach((file) => {
      const filePath = path.resolve(projectPath, file);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
      }
    });

    //! 10. Database & Prisma Client Setup
    execSync("npm install prisma@6 @prisma/client@6", {
      cwd: projectPath,
      stdio: "ignore",
    });
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
    console.log("✅ Database and Prisma setup completed successfully!");




    console.log(`\n🎉 Project '${projectName}' setup finished successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("\n❌ An error occurred during setup:", error.message);
  }
}

