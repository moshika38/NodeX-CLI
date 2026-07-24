import fs from "fs";
import path from "path";
import { execSync } from "child_process";
// import { createProjectFiles } from "./projectConfig.js";
import { updatePackageJson } from "./src/updatePackageJson.js";
import { updatePrismaSchema } from "./src/prismaSchema.js";
import { createProjectFiles } from "./src/createStructure.js";

export function setupPostgreSqlProject(projectName, databaseUrl) {
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
    execSync("npm install express cors dotenv", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Express installed successful!");

    //! 4. install prisma
    execSync("npm install @prisma/client", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Prisma installed successful!");

    //! 5. install typescript
    execSync(
      "npm install -D typescript tsx @types/node @types/express @types/cors prisma",
      { cwd: projectPath, stdio: "ignore" },
    );
    execSync("npx tsc --init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ TypeScript installed successful!");

    //! 6. update Package Json
    updatePackageJson(projectPath);
    console.log("✅ updated Package Json");

    //! 7. init prisma
    execSync("npx prisma init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ npx prisma init successful!");

    //! 8. update database url
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
    console.log("✅ Update  Structure Successfully!");

    //! 10. generate adapter
    execSync("npm install @prisma/adapter-pg pg", {
      cwd: projectPath,
      stdio: "ignore",
    });
    execSync("npx prisma generate", { cwd: projectPath, stdio: "ignore" });
    if (databaseUrl && databaseUrl.trim() !== "") {
      execSync("npx prisma db push    ", { cwd: projectPath, stdio: "ignore" });
    }else{
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
