import fs from "fs-extra";
import path from "path";

export function createProjectFiles(projectPath) {
  // 1. .env
  const envPath = path.join(projectPath, ".env");
  const envContent = `DATABASE_URL="file:./dev.db"\n`;
  fs.outputFileSync(envPath, envContent);

  // 2. src/config/prisma.ts  
  const prismaConfigPath = path.join(projectPath, "src/config/prisma.ts");
  const prismaConfigContent = `import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
`;
  fs.outputFileSync(prismaConfigPath, prismaConfigContent.trim());

  // 3. src/index.ts
  const indexPath = path.join(projectPath, "src/index.ts");
  const indexContent = `import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Endpoint available at http://localhost:\${PORT}/api/users\`);
});
`;
  fs.outputFileSync(indexPath, indexContent.trim());

  // 4. src/routes/user.routes.ts
  const routesPath = path.join(projectPath, "src/routes/user.routes.ts");
  const routesContent = `import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);

router.post("/", createUser);

export default router;
`;
  fs.outputFileSync(routesPath, routesContent.trim());

  // 5. src/controllers/user.controller.ts
  const controllerPath = path.join(
    projectPath,
    "src/controllers/user.controller.ts"
  );
  const controllerContent = `import type { Request, Response } from "express";
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
`;
  fs.outputFileSync(controllerPath, controllerContent.trim());
}