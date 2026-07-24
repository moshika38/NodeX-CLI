import inquirer from "inquirer";
// ts
import { setupSqliteProject as setupSqlProject } from "./ts/SQLite/setup.js";
import { setupPostgreSqlProject } from "./ts/PostgreSQL/setup.js";
import { setupMongoDBProject } from "./ts/MongoDB/setup.js";
// js
import { setupSqliteJsProject } from "./js/SQLite/setup.js";
import { setupPostgreSqlJsProject } from "./js/PostgreSQL/setup.js";
import { setupMongoDbJsProject } from "./js/MongoDB/setup.js";

// Global signal listener to instantly intercept Ctrl+C anytime
process.on("SIGINT", () => {
  console.log("\n\n❌ Operation cancelled. Exiting...");
  process.exit(0);
});

console.log(`
███╗   ██╗██████╗ ██████╗ ███████╗██╗  ██╗     ██████╗██╗     ██╗
████╗  ██║██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔════╝██║     ██║
██╔██╗ ██║██║   ██║██║  ██║█████╗   ╚███╔╝     ██║     ██║     ██║
██║╚██╗██║██║   ██║██║  ██║██╔══╝   ██╔██╗     ██║     ██║     ██║
██║ ╚████║╚██████╔╝██████╔╝███████╗██╔╝ ██╗    ╚██████╗███████╗██║
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝

🚀 StackKit CLI
🛠️  Build your node.js backend with one command
`);

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log("❌ Please provide project name");
  console.log("Example: npm create stackkit ecommerce-api");
  process.exit(1);
}

async function run() {
  try {
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
      ...answers,
      ...dbConfig,
    };

    console.log("\n");

    if (answers.language === "TypeScript") {
      switch (config.database) {
        case "SQLite":
          await setupSqlProject(projectName);
          break;

        case "PostgreSQL":
          await setupPostgreSqlProject(projectName, config.dbUrl);
          break;

        case "MongoDB":
          await setupMongoDBProject(projectName, config.mongoUrl);
          break;

        default:
          console.log("❌ Unsupported database selected");
      }
    } else {
      switch (config.database) {
        case "SQLite":
          await setupSqliteJsProject(projectName);
          break;

        case "PostgreSQL":
          await setupPostgreSqlJsProject(projectName, config.dbUrl);
          break;

        case "MongoDB":
          await setupMongoDbJsProject(projectName, config.mongoUrl);
          break;

        default:
          console.log("❌ Unsupported database selected");
      }
    }
  } catch (error) {
    // Gracefully handle user cancellation (Ctrl+C) from Inquirer
    if (error?.name === "ExitPromptError" || error?.message?.includes("SIGINT")) {
      console.log("\n\n❌ Setup cancelled. Exiting...");
      process.exit(0);
    }
    // Re-throw any other actual errors
    throw error;
  }
}

run();