import inquirer from "inquirer";

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

const answers = await inquirer.prompt([
  {
    type: "input",
    name: "projectName",
    message: "Enter project name:",
    default: "my-app",
  },

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

// Database specific questions

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
  ...answers,
  ...dbConfig,
};

console.log("\n🚀 StackKit Configuration:");
console.log(config);
