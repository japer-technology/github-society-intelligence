import { readdirSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

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
  console.error(message);
  process.exit(1);
}

function workflowFiles(): string[] {
  return readdirSync(workflowDir)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();
}

function extractJobs(workflowText: string): Map<string, string> {
  const lines = workflowText.split(/\r?\n/);
  const jobsStart = lines.findIndex((line) => line === "jobs:");
  if (jobsStart === -1) fail("workflow is missing jobs:");

  const jobs = new Map<string, string>();
  let currentJob = "";
  let currentStart = -1;

  for (let i = jobsStart + 1; i < lines.length; i++) {
    const match = lines[i].match(/^  ([A-Za-z0-9_-]+):\s*$/);
    if (!match) continue;

    if (currentJob) {
      jobs.set(currentJob, lines.slice(currentStart, i).join("\n"));
    }
    currentJob = match[1];
    currentStart = i;
  }

  if (currentJob) {
    jobs.set(currentJob, lines.slice(currentStart).join("\n"));
  }

  return jobs;
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

function assertNoReusableWorkflow(workflowText: string) {
  if (/workflow_call\s*:/.test(workflowText)) {
    fail("reusable workflow declaration is forbidden");
  }
  if (/uses:\s*.*\.github\/workflows\//.test(workflowText)) {
    fail("calling another workflow file is forbidden");
  }
}

function assertJobShape(jobs: Map<string, string>) {
  if (!jobs.has("setup")) fail("workflow is missing setup job");

  for (const [jobId, block] of jobs.entries()) {
    if (jobId === "setup") continue;

    if (!allowedJobPrefixes.some((prefix) => jobId.startsWith(prefix))) {
      fail(`job ${jobId} must start with one of ${allowedJobPrefixes.join(", ")}`);
    }

    if (!/(^|\n)    needs:\s*setup\s*(\n|$)/.test(block) && !/(^|\n)    needs:\s*\[[^\]]*\bsetup\b[^\]]*\]/.test(block)) {
      fail(`job ${jobId} must declare needs: setup`);
    }

    if (!block.includes("needs.setup.outputs.mode")) {
      fail(`job ${jobId} must gate on needs.setup.outputs.mode`);
    }
  }
}

assertWorkflowInventory();

const workflowText = readFileSync(agentWorkflow, "utf-8");
assertNoReusableWorkflow(workflowText);
assertJobShape(extractJobs(workflowText));

console.log("workflow validation passed");
