import fs from "fs";
import path from "path";

export function updatePrismaSchema(projectPath) {
  const prismaDirPath = path.join(projectPath, "prisma");
  const schemaPath = path.join(prismaDirPath, "schema.prisma");

  if (!fs.existsSync(prismaDirPath)) {
    fs.mkdirSync(prismaDirPath, { recursive: true });
  }

  const schemaContent = `
  generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}

`;

  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
}