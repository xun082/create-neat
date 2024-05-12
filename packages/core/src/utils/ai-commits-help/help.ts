import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const __dirname = fileURLToPath(import.meta.url);
/**
 * Check if a file has changed in the git index
 * @param path
 */
export function getFilesChangedInGitAdd() {
  const gitDiff = execSync("git diff --cached --name-only", { encoding: "utf-8" });
  return gitDiff.split("\n");
}

export function getOpenAIkey() {
  // TODO: 拿到openAI的key，目前没有可使用的key。这里后续在进行安排
  const filePath = path.join(__dirname, "..", "..", "..", ".env");
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  return content.split("=")[1].replace("\n", "");
}

interface Staged {
  filename: string;
  content: string;
}

export function allStagedFiles2Message(staged: Staged[]) {
  return staged.map((item) => item.content).join("\n");
}
