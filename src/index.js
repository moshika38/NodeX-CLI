import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { sanitizeProjectName, toValidNpmName, resolveTargetDir } from "./utils/sanitize.js";
// ts
import { setupSqliteProject as setupSqlProject } from "./ts/SQLite/setup.js";
import { setupPostgreSqlProject } from "./ts/PostgreSQL/setup.js";
import { setupMongoDBProject } from "./ts/MongoDB/setup.js";
// js
import { setupSqliteJsProject } from "./js/SQLite/setup.js";
import { setupPostgreSqlJsProject } from "./js/PostgreSQL/setup.js";
import { setupMongoDbJsProject } from "./js/MongoDB/setup.js";

process.on("SIGINT", () => {
  console.log("\n\n👋 Operation cancelled by user. Exiting...");
  process.exit(0);
});

console.log(`
███╗   ██╗██████╗ ██████╗ ███████╗██╗  ██╗     ██████╗██╗     ██╗
████╗  ██║██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔════╝██║     ██║
██╔██╗ ██║██║   ██║██║  ██║█████╗   ╚███╔╝     ██║     ██║     ██║
██║╚██╗██║██║   ██║██║  ██║██╔══╝   ██╔██╗     ██║     ██║     ██║
██║ ╚████║╚██████╔╝██████╔╝███████╗██╔╝ ██╗    ╚██████╗███████╗██║
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝ 

🚀 NodeX CLI
🛠️  Build your node.js backend with one command
`);

try {
  const args = process.argv.slice(2);
  let rawProjectName = args[0];

  if (!rawProjectName || !rawProjectName.trim()) {
    const input = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter project name:",
        default: "my-nodex-app",
        validate: (input) => {
          if (!input || !input.trim()) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    rawProjectName = input.projectName;
  }

  const projectName = sanitizeProjectName(rawProjectName);
  const sanitizedPackageName = toValidNpmName(projectName);
  const targetDir = resolveTargetDir(projectName);

  // Check if target directory already exists and is not empty
  if (fs.existsSync(targetDir)) {
    const existingFiles = fs.readdirSync(targetDir);
    if (existingFiles.length > 0) {
      const { confirmContinue } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmContinue",
          message: `Target directory '${path.basename(targetDir)}' already exists and is not empty. Do you want to continue?`,
          default: false,
        },
      ]);

      if (!confirmContinue) {
        console.log("\n❌ Setup cancelled. Target directory is not empty.");
        process.exit(0);
      }
    }
  }

  // Ensure directory exists using recursive creation
  fs.mkdirSync(targetDir, { recursive: true });

  const answers = await inquirer.prompt([
    {
      type: "select",
      name: "language",
      message: "Select language:",
      choices: ["TypeScript", "JavaScript"],
    },
    {
      type: "select",
      name: "database",
      message: "Select database:",
      choices: ["SQLite", "PostgreSQL", "MongoDB"],
    },
  ]);

  let dbConfig = {};

  if (answers.database === "PostgreSQL") {
    dbConfig = await inquirer.prompt([
      {
        type: "input",
        name: "dbUrl",
        message: "Enter PostgreSQL Connection String/URL:",
        default: "",
      },
    ]);
  }

  if (answers.database === "MongoDB") {
    dbConfig = await inquirer.prompt([
      {
        type: "input",
        name: "mongoUrl",
        message: "Enter MongoDB connection URL:",
        default: "",
      },
    ]);
  }

  const config = {
    projectName,
    sanitizedPackageName,
    ...answers,
    ...dbConfig,
  };

  console.log("\n");

  if (answers.language === "TypeScript") {
    switch (config.database) {
      case "SQLite":
        await setupSqlProject(projectName, sanitizedPackageName);
        break;

      case "PostgreSQL":
        await setupPostgreSqlProject(projectName, config.dbUrl, sanitizedPackageName);
        break;

      case "MongoDB":
        await setupMongoDBProject(projectName, config.mongoUrl, sanitizedPackageName);
        break;

      default:
        console.log("❌ Unsupported database selected");
    }
  } else {
    switch (config.database) {
      case "SQLite":
        setupSqliteJsProject(projectName, sanitizedPackageName);
        break;

      case "PostgreSQL":
        setupPostgreSqlJsProject(projectName, config.dbUrl, sanitizedPackageName);
        break;

      case "MongoDB":
        setupMongoDbJsProject(projectName, config.mongoUrl, sanitizedPackageName);
        break;

      default:
        console.log("❌ Unsupported database selected");
    }
  }
} catch (error) {
  if (
    error?.name === "ExitPromptError" ||
    error?.message?.includes("SIGINT")
  ) {
    console.log("\n\n👋 Setup cancelled. Goodbye!");
    process.exit(0);
  }
  throw error;
}

