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
      filePath: "src/config/prisma.ts",
      content: `import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

export default prisma;
`,
    },
    {
      filePath: "src/routes/user.routes.ts",
      content: `import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
`,
    },
    {
      filePath: "src/controllers/user.controller.ts",
      content: `import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

// GET all users
export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// CREATE user
export const createUser = async (
  req: Request,
  res: Response
) => {
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
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
`,
    },
    {
      filePath: "src/index.ts",
      content: `import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    },
  ];

   filesToCreate.forEach(({ filePath, content }) => {
    const fullPath = path.join(projectPath, filePath);
    const dirName = path.dirname(fullPath);

     if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

     fs.writeFileSync(fullPath, content, "utf-8");
  });

//   console.log("✅ All initial files created successfully!");
}