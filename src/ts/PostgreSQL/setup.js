import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { updatePackageJson } from "./src/updatePackageJson.js";
import { updatePrismaSchema } from "./src/prismaSchema.js";
import { createProjectFiles } from "./src/createStructure.js";
import { toValidNpmName } from "../../utils/sanitize.js";

export function setupPostgreSqlProject(projectName, databaseUrl, packageName) {
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
    execSync("npm install express cors dotenv", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Express installed successful!");

    //! 4. install prisma
    execSync("npm install @prisma/client@6", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Prisma installed successful!");

    //! 5. install typescript
    execSync(
      "npm install -D typescript tsx @types/node @types/express @types/cors prisma@6",
      { cwd: projectPath, stdio: "ignore" },
    );
    execSync("npx tsc --init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ TypeScript installed successful!");

    //! 6. update Package Json
    updatePackageJson(projectPath, pkgName);
    console.log("✅ updated Package Json");

    //! 7. update database url
    if (!databaseUrl || databaseUrl.trim() === "") {
      console.log("⚠️ Warning: Database url not provided!");
    } else {
      const envPath = path.resolve(projectPath, ".env");
      const envContent = `DATABASE_URL="${databaseUrl}"\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");
      
      console.log("✅ Database url updated Successfully!");
    }

    //! 8. Creating project folders
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

    //! 9. generate prisma client

    execSync("npx prisma generate --schema=./prisma/schema.prisma", {
      cwd: projectPath,
      stdio: "ignore",
    });
    if (databaseUrl && databaseUrl.trim() !== "") {
      execSync("npx prisma db push --schema=./prisma/schema.prisma", {
        cwd: projectPath,
        stdio: "ignore",
      });
    } else {
      console.log("⚠️ Warning: Cannot push database to remote server! Update database url in .env and run `npx prisma db push`");
    }
    console.log("✅ Configured Successfully!");



    console.log(`\n🎉 Project '${projectName}' setup finished Successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("\n❌ An error occurred during setup:", error.message);
  }
}

