#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const overlayDirectory = path.resolve(scriptDirectory, "../assets/overlay");

function fail(message) {
  process.stderr.write(`apply-artifact-overlay: ${message}\n`);
  process.exit(1);
}

function argumentsMap(argv) {
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
  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.split(placeholder).join(replacement),
    value,
  );
}

function copyTree(source, target, replacements) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const destination = path.join(target, render(entry.name, replacements));
    const origin = path.join(source, entry.name);
    if (entry.isDirectory()) copyTree(origin, destination, replacements);
    else if (fs.existsSync(destination)) fail(`refusing to overwrite ${destination}`);
    else fs.writeFileSync(destination, render(fs.readFileSync(origin, "utf8"), replacements));
  }
}

const options = argumentsMap(process.argv.slice(2));
for (const key of ["project", "artifact-type", "artifact-swift"]) {
  if (!options[key]) fail(`required option --${key} is missing`);
}

const project = path.resolve(options.project);
const manifestPath = path.join(project, ".agentfoundry-proof.json");
if (!fs.existsSync(manifestPath)) fail("target is not an AgentFoundry proof scaffold");
if (!/^[a-z][a-z0-9_]*$/.test(options["artifact-type"])) fail("artifact type must be lower_snake_case");
if (!/^[A-Z][A-Za-z0-9]*$/.test(options["artifact-swift"])) fail("artifact Swift name must be UpperCamelCase");

const replacements = {
  "__ARTIFACT_TYPE__": options["artifact-type"],
  "__ARTIFACT_SWIFT__": options["artifact-swift"],
};
copyTree(overlayDirectory, project, replacements);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.capabilities = Array.from(new Set([...(manifest.capabilities ?? []), "artifact-ui"]));
manifest.artifactTypes = Array.from(new Set([...(manifest.artifactTypes ?? []), options["artifact-type"]]));
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`Applied ${options["artifact-type"]} artifact overlay to ${project}\n`);
