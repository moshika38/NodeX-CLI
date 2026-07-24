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
  provider = "prisma-client-js"
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