import fs from "fs-extra";
import path from "path";

export function updatePrismaSchema(projectPath) {
  const prismaDirPath = path.resolve(projectPath, "prisma");
  const schemaPath = path.resolve(prismaDirPath, "schema.prisma");

  fs.mkdirSync(prismaDirPath, { recursive: true });

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