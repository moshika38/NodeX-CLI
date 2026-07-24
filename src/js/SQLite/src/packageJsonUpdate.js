import fs from "fs-extra";
import path from "path";

/**
 * Replaces existing type and scripts in package.json with brand new ones.
 *
 * @param {string} projectPath - Path to the target project directory
 */
export function updatePackageJson(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ package.json non-existent at: ${packageJsonPath}`);
    return;
  }

  try {
    const fileData = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(fileData);

    packageJson.type = "module";

    packageJson.scripts = {
      "dev": "node --watch src/index.js",
      "start": "node src/index.js"
    };

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8",
    );

   
  } catch (error) {
    console.error("❌ Error updating package.json:", error.message);
  }
}
