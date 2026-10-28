import { readdirSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { YAML } from "bun";

const lifecycleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(lifecycleDir, "..", "..");
const workflowDir = resolve(repoRoot, ".github", "workflows");
const agentWorkflow = resolve(workflowDir, "github-society-intelligence-agent.yml");

const allowedWorkflowFiles = new Set([
  "github-society-intelligence-agent.yml",
  "gsi-public-fabric.yml",
]);
const forbiddenWorkflowFiles = new Set([
  "agent.yml",
  "think.yml",
  "act.yml",
  "censor.yml",
  "censors.yml",
  "cognition.yml",
  "observe.yml",
  "delegate.yml",
  "settle.yml",
  "consolidate.yml",
  "perceive.yml",
  "activate.yml",
  "critique.yml",
  "import-memory.yml",
]);
const allowedJobPrefixes = [
  "act-",
  "think-",
  "observe-",
  "delegate-",
  "settle-",
];

function fail(message: string): never {
  throw new Error(message);
}

function workflowFiles(): string[] {
  return readdirSync(workflowDir)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertWorkflowInventory() {
  const files = workflowFiles();
  for (const file of files) {
    if (!allowedWorkflowFiles.has(file)) {
      fail(`unexpected workflow file: ${file}`);
    }
    if (forbiddenWorkflowFiles.has(file)) {
      fail(`forbidden PLAN-derived workflow file exists: ${file}`);
    }
  }
  if (!files.includes("github-society-intelligence-agent.yml")) {
    fail("missing existing single agent workflow");
  }
}

export function validateWorkflow(workflowText: string): void {
  const workflow = YAML.parse(workflowText);
  if (!object(workflow) || !object(workflow.jobs)) fail("workflow is missing jobs:");
  if (object(workflow.on) && "workflow_call" in workflow.on) {
    fail("reusable workflow declaration is forbidden");
  }
  const jobs = workflow.jobs;
  if (!object(jobs.setup)) fail("workflow is missing setup job");

  for (const [jobId, job] of Object.entries(jobs)) {
    if (!object(job)) fail(`invalid job ${jobId}`);
    if ("uses" in job) fail("calling another workflow file is forbidden");
    if (jobId === "setup") continue;

    if (!allowedJobPrefixes.some((prefix) => jobId.startsWith(prefix))) {
      fail(`job ${jobId} must start with one of ${allowedJobPrefixes.join(", ")}`);
    }

    const needs = Array.isArray(job.needs) ? job.needs : [job.needs];
    if (!needs.includes("setup")) {
      fail(`job ${jobId} must declare needs: setup`);
    }
    for (const dependency of needs) {
      if (typeof dependency !== "string" || !(dependency in jobs)) {
        fail(`job ${jobId} has an unknown dependency`);
      }
    }

    const mode = jobId.split("-")[0];
    if (typeof job.if !== "string" ||
        !new RegExp(`\\bneeds\\.setup\\.outputs\\.mode\\s*==\\s*['"]${mode}['"]`).test(job.if)) {
      fail(`job ${jobId} must gate on needs.setup.outputs.mode == '${mode}'`);
    }
  }
}

if (import.meta.main) {
  assertWorkflowInventory();
  validateWorkflow(readFileSync(agentWorkflow, "utf-8"));
  console.log("workflow validation passed");
}
