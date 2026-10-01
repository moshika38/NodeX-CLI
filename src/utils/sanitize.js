import path from "path";

/**
 * Trims and sanitizes the user input for project folder name.
 *
 * @param {string} name
 * @returns {string}
 */
export function sanitizeProjectName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim();
}

/**
 * Converts a project name to a valid npm package name according to npm rules:
 * - lowercase
 * - spaces replaced with hyphens
 * - invalid characters removed
 * - cannot start with . or _
 *
 * @param {string} name
 * @returns {string}
 */
export function toValidNpmName(name) {
  if (!name || typeof name !== "string") return "nodex-app";

  let validName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]+/, "")
    .replace(/[^a-z0-9-_.~]/g, "")
    .replace(/^[-]+/, "");

  if (validName.length > 214) {
    validName = validName.slice(0, 214);
  }

  return validName || "nodex-app";
}

/**
 * Resolves the absolute path for the target project directory.
 *
 * @param {string} projectName
 * @returns {string}
 */
export function resolveTargetDir(projectName) {
  return path.resolve(process.cwd(), sanitizeProjectName(projectName));
}
