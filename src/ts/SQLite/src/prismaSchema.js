import fs from "fs-extra";
import path from "path";

export function updatePrismaSchema(projectPath) {
  const prismaDirPath = path.resolve(projectPath, "prisma");
  const schemaPath = path.resolve(prismaDirPath, "schema.prisma");

  fs.mkdirSync(prismaDirPath, { recursive: true });

  const schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
`;

  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
}