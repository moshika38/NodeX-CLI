import inquirer from "inquirer";
import { setupProject as setupSqlProject } from "./ts/SQLite/SQLiteSetupProject.js";
import { setupPostgreSqlProject } from "./ts/PostgreSQL/postgreSqlSetupProject.js";

console.log(`
███████╗████████╗ █████╗  ██████╗██╗  ██╗██╗  ██╗██╗████████╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██║ ██╔╝██║╚══██╔══╝
███████╗   ██║   ███████║██║     █████╔╝ █████╔╝ ██║   ██║   
╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ██╔═██╗ ██║   ██║   
███████║   ██║   ██║  ██║╚██████╗██║  ██╗██║  ██╗██║   ██║   
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   

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
      default: "mongodb://localhost:27017/mydb",
    },
  ]);
}

const config = {
  projectName,
  ...answers,
  ...dbConfig,
};

console.log("\n🚀 StackKit Configuration:");
console.log(config);

// Run setup conditionally based on chosen database
switch (config.database) {
  case "SQLite":
    await setupSqlProject(projectName);
    break;

  case "PostgreSQL":
    await setupPostgreSqlProject(projectName, config.dbUrl);
    break;

  case "MongoDB":
    // TODO: Connect your Mongo setup function here
    console.log("Setting up MongoDB project...");
    break;

  default:
    console.log("❌ Unsupported database selected");
}