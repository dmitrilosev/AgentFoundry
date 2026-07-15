#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const options = { deleteSource: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--delete-source") {
      options.deleteSource = true;
      continue;
    }
    if (!token.startsWith("--")) fail(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for ${token}`);
    options[token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    index += 1;
  }
  return options;
}

function decodeValue(raw) {
  const value = raw.trim();
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return value;
}

function readEnvValue(filePath, envName) {
  let stat;
  try {
    stat = fs.lstatSync(filePath);
  } catch {
    fail("Key staging file does not exist or is not readable.");
  }
  if (!stat.isFile() || stat.isSymbolicLink()) fail("Key staging path must be a regular non-symlink file.");

  const source = fs.readFileSync(filePath, "utf8");
  const assignments = [];
  let selected;
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) fail("Key staging file contains an unsupported line.");
    assignments.push(match[1]);
    if (match[1] === envName) selected = decodeValue(match[2]);
  }
  if (!selected) fail(`${envName} is missing or empty in the staging file.`);
  if (selected.includes("\0") || selected.includes("\n") || selected.includes("\r")) fail(`${envName} must be a single-line value.`);
  return { value: selected, assignments };
}

function runGcloud(gcloud, args, options = {}) {
  const result = spawnSync(gcloud, args, {
    input: options.input,
    stdio: options.quiet ? ["pipe", "ignore", "ignore"] : ["pipe", "inherit", "inherit"],
  });
  if (result.error) fail(`Could not run gcloud: ${result.error.message}`);
  return result.status ?? 1;
}

const options = parseArgs(process.argv.slice(2));
for (const required of ["envFile", "envName", "secret", "project"]) {
  if (!options[required]) fail(`Missing --${required.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}.`);
}
if (!path.isAbsolute(options.envFile)) fail("--env-file must be absolute.");
if (!/^[A-Z][A-Z0-9_]{0,254}$/.test(options.secret)) fail("--secret must be an uppercase product-scoped secret name.");
if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(options.project)) fail("--project is not a valid Google Cloud project id.");
if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(options.envName)) fail("--env-name is invalid.");

const { value, assignments } = readEnvValue(options.envFile, options.envName);
if (options.deleteSource && assignments.some(name => name !== options.envName)) {
  fail("Refusing to delete a staging file that contains other environment variables.");
}

const gcloud = process.env.AGENTFOUNDRY_GCLOUD_BIN || "gcloud";
const common = ["--project", options.project, "--quiet"];
const described = runGcloud(gcloud, ["secrets", "describe", options.secret, ...common], { quiet: true });
if (described !== 0) {
  const created = runGcloud(gcloud, ["secrets", "create", options.secret, "--replication-policy=automatic", ...common]);
  if (created !== 0) fail("Could not create the backend secret resource.");
}

const stored = runGcloud(
  gcloud,
  ["secrets", "versions", "add", options.secret, "--data-file=-", ...common],
  { input: Buffer.from(value, "utf8") },
);
if (stored !== 0) fail("Could not add the OpenAI API key to Secret Manager.");

const verified = runGcloud(
  gcloud,
  ["secrets", "versions", "describe", "latest", "--secret", options.secret, "--format=value(name,state)", ...common],
);
if (verified !== 0) fail("The secret version was added, but metadata verification failed.");

if (options.deleteSource) fs.rmSync(options.envFile);
console.log(`Stored ${options.envName} in Secret Manager${options.deleteSource ? " and removed the dedicated staging file" : ""}.`);
