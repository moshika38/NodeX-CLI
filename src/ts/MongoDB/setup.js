import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { updatePackageJson } from "./src/updatePackageJson.js";
import { updatePrismaSchema } from "./src/updatePrismaSchema.js";
import { createStructure } from "./src/createStructure.js";

export function setupMongoDBProject(projectName, databaseUrl) {
  const projectPath = path.join(process.cwd(), projectName);

  try {
    //! 1. Create folder
    fs.ensureDirSync(projectPath);

    console.log("⚙️ Starting setup process...\n");

    //! 2. npm init
    execSync("npm init -y", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ npm init successful!");

    //! 3. install dotenv
    execSync("npm install express cors dotenv", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ dotenv installed successfully!");

    //! 4. install prisma
    execSync("npm install @prisma/client@6 prisma@6 --save", {
      cwd: projectPath,
      stdio: "ignore",
    });
    console.log("✅ Prisma installed successfully!");

    //! 5. install typescript
    execSync(
      "npm install -D typescript tsx @types/node @types/express @types/cors",
      { cwd: projectPath, stdio: "ignore" },
    );
    execSync("npx tsc --init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ typescript installed successfully!");

    //! 6. update package.json
    updatePackageJson(projectPath);
    console.log("✅ Update Package.json successfully!");

    //! 7. init prisma
    execSync("npx prisma init", { cwd: projectPath, stdio: "ignore" });
    console.log("✅ Prisma init successfully!");

    //! 8. update database url
    if (!databaseUrl || databaseUrl.trim() === "") {
      console.log("⚠️ Warning: Database url not provided!");
    } else {
      const envPath = path.join(projectPath, ".env");
      const envContent = `DATABASE_URL="${databaseUrl}"\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");

      console.log("✅ Database url updated Successfully!");
    }

    //! 9. Update Prisma Schema
    updatePrismaSchema(projectPath);
    console.log("✅ Prisma schema updated successfully!");

    //! 10. Create project structure
    createStructure(projectPath);
    console.log("✅ Project structure created successfully!");

    //! 11. Generate Prisma Client & Push to Database
    execSync("npx prisma generate", { cwd: projectPath, stdio: "ignore" });
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
