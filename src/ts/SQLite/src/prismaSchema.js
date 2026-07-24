import fs from "fs-extra";
import path from "path";

export function updatePrismaSchema(projectPath) {
  const prismaDirPath = path.join(projectPath, "prisma");
  const schemaPath = path.join(prismaDirPath, "schema.prisma");

  fs.ensureDirSync(prismaDirPath);

  const schemaContent = `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
`;

  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
}