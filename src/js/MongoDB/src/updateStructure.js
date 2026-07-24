import fs from "fs";
import path from "path";

/**
 * Creates starter source files for the project.
 * 
 * @param {string} projectPath - Target project root directory path
 */
export function createProjectFiles(projectPath) {
   const filesToCreate = [
    {
      filePath: "src/config/prisma.js",
      content: `                             

      import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export default prisma;

`,
    },
    {
      filePath: "src/routes/user.routes.js",
      content: `
import { Router } from "express";
import {
  getUsers,
  createUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
`,
    },
    {
      filePath: "src/controllers/user.controller.js",
      content: `
import prisma from "../config/prisma.js";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// CREATE user
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
`,
    },
    {
      filePath: "src/index.js",
      content: `
import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Endpoint available at http://localhost:\${PORT}/api/users\`);
});
`,
    },
  ];

   filesToCreate.forEach(({ filePath, content }) => {
    const fullPath = path.join(projectPath, filePath);
    const dirName = path.dirname(fullPath);

     // FIXED: Changed fs.exisjsSync to fs.existsSync
     if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

     fs.writeFileSync(fullPath, content, "utf-8");
  });
}

export function updatePrismaSchema(projectPath) {
  const prismaDirPath = path.join(projectPath, "prisma");
  const schemaPath = path.join(prismaDirPath, "schema.prisma");

  // FIXED: Changed fs.exisjsSync to fs.existsSync
  if (!fs.existsSync(prismaDirPath)) {
    fs.mkdirSync(prismaDirPath, { recursive: true });
  }

  const schemaContent = `
  
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
`;

  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
}