#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const overlayDirectory = path.resolve(scriptDirectory, "../assets/overlay");
const fail = (message) => { process.stderr.write(`apply-domain-overlay: ${message}\n`); process.exit(1); };

function parse(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value || value.startsWith("--")) fail(`invalid option near ${key ?? "end"}`);
    result[key.slice(2)] = value;
  }
  return result;
}

function render(value, replacements) {
  return Object.entries(replacements).reduce((result, item) => result.split(item[0]).join(item[1]), value);
}

function copyTree(source, target, replacements) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, render(entry.name, replacements));
    if (entry.isDirectory()) copyTree(sourcePath, targetPath, replacements);
    else if (fs.existsSync(targetPath)) fail(`refusing to overwrite ${targetPath}`);
    else fs.writeFileSync(targetPath, render(fs.readFileSync(sourcePath, "utf8"), replacements));
  }
}

const options = parse(process.argv.slice(2));
for (const key of ["project", "domain-name", "domain-swift", "collection"]) {
  if (!options[key]) fail(`required option --${key} is missing`);
}
if (!/^[a-z][a-z0-9_]*$/.test(options["domain-name"])) fail("domain name must be lower_snake_case");
if (!/^[A-Z][A-Za-z0-9]*$/.test(options["domain-swift"])) fail("domain Swift name must be UpperCamelCase");
if (!/^[a-z][A-Za-z0-9]*$/.test(options.collection)) fail("collection must be lowerCamelCase");

const project = path.resolve(options.project);
const manifestPath = path.join(project, ".agentfoundry-proof.json");
if (!fs.existsSync(manifestPath)) fail("target is not an AgentFoundry proof scaffold");
const swiftName = options["domain-swift"];
const replacements = {
  "__DOMAIN_NAME__": options["domain-name"],
  "__DOMAIN_SWIFT__": swiftName,
  "__DOMAIN_CAMEL__": swiftName[0].toLowerCase() + swiftName.slice(1),
  "__DOMAIN_COLLECTION__": options.collection,
};
copyTree(overlayDirectory, project, replacements);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.capabilities = Array.from(new Set([...(manifest.capabilities ?? []), "domain-tools"]));
manifest.domainModels = Array.from(new Set([...(manifest.domainModels ?? []), options["domain-name"]]));
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`Applied ${options["domain-name"]} domain overlay to ${project}\n`);
