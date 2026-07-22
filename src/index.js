import inquirer from "inquirer";
import { setupProject } from "./ts/SQLite/SQLiteSetupProject.js";

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
      name: "databaseName",
      message: "Enter PostgreSQL database name:",
      default: "my_database",
    },
    {
      type: "input",
      name: "username",
      message: "Enter PostgreSQL username:",
      default: "postgres",
    },
    {
      type: "password",
      name: "password",
      message: "Enter PostgreSQL password:",
    },
    {
      type: "input",
      name: "host",
      message: "Enter PostgreSQL host:",
      default: "localhost",
    },
    {
      type: "input",
      name: "port",
      message: "Enter PostgreSQL port:",
      default: "5432",
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

// Run setupProject function
setupProject(projectName);