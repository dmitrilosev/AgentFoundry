#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const templateDirectory = path.resolve(scriptDirectory, "../assets/template");

function fail(message) {
  process.stderr.write(`scaffold-proof: ${message}\n`);
  process.exit(1);
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) fail(`unexpected argument ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`missing value for ${key}`);
    values[key.slice(2)] = value;
    index += 1;
  }
  return values;
}

function swiftIdentifier(value) {
  const candidate = value.replace(/[^A-Za-z0-9_]/g, "");
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(candidate)) {
    fail(`invalid Swift name: ${value}`);
  }
  return candidate;
}

function productSlug(value) {
  const candidate = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!candidate) fail(`invalid product slug: ${value}`);
  return candidate;
}

function render(value, replacements) {
  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.split(placeholder).join(replacement),
    value
  );
}

function copyRenderedTree(source, destination, replacements) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const renderedName = render(entry.name, replacements);
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, renderedName);
    if (entry.isDirectory()) {
      copyRenderedTree(sourcePath, destinationPath, replacements);
    } else if (entry.isFile()) {
      const contents = fs.readFileSync(sourcePath, "utf8");
      fs.writeFileSync(destinationPath, render(contents, replacements));
    }
  }
}

function textFiles(root) {
  const results = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) results.push(...textFiles(entryPath));
    else if (entry.isFile()) results.push(entryPath);
  }
  return results;
}

const argumentsMap = parseArguments(process.argv.slice(2));
const required = ["output", "product-name", "swift-name", "slug", "bundle-id", "firebase-project-id", "region"];
for (const key of required) {
  if (!argumentsMap[key]) fail(`required option --${key} is missing`);
}

const outputDirectory = path.resolve(argumentsMap.output);
if (fs.existsSync(outputDirectory) && fs.readdirSync(outputDirectory).length > 0) {
  fail(`output directory is not empty: ${outputDirectory}`);
}

const swiftName = swiftIdentifier(argumentsMap["swift-name"]);
const slug = productSlug(argumentsMap.slug);
const bundleId = argumentsMap["bundle-id"].trim().toLowerCase();
if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(bundleId)) fail(`invalid bundle identifier: ${bundleId}`);

const projectId = argumentsMap["firebase-project-id"].trim();
const region = argumentsMap.region.trim();
const secretName = argumentsMap["secret-name"]
  ?? `AGENTFOUNDRY_${slug.replace(/-/g, "_").toUpperCase()}_OPENAI_API_KEY`;
const collectionRoot = argumentsMap["collection-root"]
  ?? `${slug.replace(/-/g, "")}Users`;
const backendBaseURL = argumentsMap["backend-base-url"]
  ?? `https://${region}-${projectId}.cloudfunctions.net`;
const organizationName = argumentsMap["organization-name"] ?? "AgentFoundry";

const replacements = {
  "__PRODUCT_NAME__": argumentsMap["product-name"].trim(),
  "__PRODUCT_SWIFT__": swiftName,
  "__PRODUCT_SLUG__": slug,
  "__BUNDLE_ID__": bundleId,
  "__FIREBASE_PROJECT_ID__": projectId,
  "__REGION__": region,
  "__BACKEND_BASE_URL__": backendBaseURL,
  "__SECRET_NAME__": secretName,
  "__COLLECTION_ROOT__": collectionRoot,
  "__ORGANIZATION_NAME__": organizationName,
};

copyRenderedTree(templateDirectory, outputDirectory, replacements);
const manifest = {
  templateVersion: 1,
  productName: replacements.__PRODUCT_NAME__,
  swiftName,
  slug,
  bundleId,
  firebaseProjectId: projectId,
  region,
  backendBaseURL,
  secretName,
  collectionRoot,
  organizationName,
  capabilities: ["foundation"],
};
fs.writeFileSync(path.join(outputDirectory, ".agentfoundry-proof.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const unresolved = textFiles(outputDirectory).flatMap((file) => {
  const matches = fs.readFileSync(file, "utf8").match(/__[A-Z0-9_]+__/g) ?? [];
  return matches.map((placeholder) => `${path.relative(outputDirectory, file)}:${placeholder}`);
});
if (unresolved.length > 0) fail(`unresolved placeholders:\n${unresolved.join("\n")}`);

process.stdout.write(`Scaffolded ${manifest.productName} at ${outputDirectory}\n`);
process.stdout.write(`Secret resource: ${secretName} (metadata only; no secret value was handled)\n`);
