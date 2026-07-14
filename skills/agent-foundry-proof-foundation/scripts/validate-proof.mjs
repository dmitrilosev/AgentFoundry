#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectDirectory = path.resolve(process.argv[2] ?? ".");
const failures = [];
const warnings = [];

function requireFile(relativePath) {
  const absolutePath = path.join(projectDirectory, relativePath);
  if (!fs.existsSync(absolutePath)) failures.push(`missing ${relativePath}`);
  return absolutePath;
}

function walk(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const manifestPath = requireFile(".agentfoundry-proof.json");
const requiredFiles = [
  "Project.swift",
  "Workspace.swift",
  "Tuist/Package.swift",
  "firebase.json",
  "firestore.rules",
  "functions/package.json",
  "functions/tsconfig.json",
  "functions/src/index.ts",
  "functions/src/chat.ts",
  "Modules/Features/Chat/Sources/ChatFeature.swift",
  "Modules/Features/Chat/Sources/ChatView.swift",
  "Modules/Core/DesignSystem/Sources/AgentMarkdownText.swift",
  "AGENTFOUNDRY_PROOF_REPORT.md",
];
requiredFiles.forEach(requireFile);

let manifest;
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(manifest.capabilities) || !manifest.capabilities.includes("foundation")) {
      failures.push("manifest does not include foundation capability");
    }
  } catch (error) {
    failures.push(`invalid .agentfoundry-proof.json: ${error.message}`);
  }
}

for (const relativePath of ["firebase.json", "firestore.indexes.json", "functions/package.json", "functions/tsconfig.json"]) {
  const absolutePath = path.join(projectDirectory, relativePath);
  if (!fs.existsSync(absolutePath)) continue;
  try {
    JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    failures.push(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}

for (const file of walk(projectDirectory)) {
  if (file.includes(`${path.sep}node_modules${path.sep}`) || file.includes(`${path.sep}.git${path.sep}`)) continue;
  let contents;
  try {
    contents = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const unresolved = contents.match(/__[A-Z0-9_]+__/g) ?? [];
  if (unresolved.length > 0) failures.push(`${path.relative(projectDirectory, file)} has ${unresolved.join(", ")}`);
  if (/\bsk-[A-Za-z0-9_-]{12,}/.test(contents)) failures.push(`${path.relative(projectDirectory, file)} appears to contain an OpenAI key`);
}

const featureFiles = walk(path.join(projectDirectory, "Modules/Features"));
for (const file of featureFiles) {
  if (/import Firebase/.test(fs.readFileSync(file, "utf8"))) {
    failures.push(`${path.relative(projectDirectory, file)} imports Firebase directly`);
  }
}

const projectSource = fs.existsSync(path.join(projectDirectory, "Project.swift"))
  ? fs.readFileSync(path.join(projectDirectory, "Project.swift"), "utf8")
  : "";
if (!projectSource.includes('DeploymentTargets.iOS("26.1")')) failures.push("Project.swift does not persist the iOS 26.1 target");

const rules = fs.existsSync(path.join(projectDirectory, "firestore.rules"))
  ? fs.readFileSync(path.join(projectDirectory, "firestore.rules"), "utf8")
  : "";
if (!rules.includes("allow read, write: if false")) failures.push("firestore.rules is not deny-by-default");

const backend = ["functions/src/chat.ts", "functions/src/index.ts", "functions/src/auth.ts"]
  .map((relativePath) => {
    const absolutePath = path.join(projectDirectory, relativePath);
    return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "";
  })
  .join("\n");
for (const symbol of ["sendMessage", "loadChat", "onDocumentCreated", "verifiedUid"]) {
  if (!backend.includes(symbol)) failures.push(`backend foundation is missing ${symbol}`);
}

if (!fs.existsSync(path.join(projectDirectory, "App/Resources/GoogleService-Info.plist"))) {
  warnings.push("GoogleService-Info.plist is not present yet; Firebase registration remains an operational setup step");
}

if (failures.length > 0) {
  process.stderr.write(`Foundation validation failed:\n- ${failures.join("\n- ")}\n`);
  process.exit(1);
}

process.stdout.write(`Foundation validation passed for ${manifest?.productName ?? projectDirectory}\n`);
for (const warning of warnings) process.stdout.write(`Warning: ${warning}\n`);
