import { afterEach, describe, expect, test } from "bun:test";
import { YAML } from "bun";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { spawnSync } from "child_process";
import { dispatch, type DispatchInput } from "./society/dispatcher.ts";
import { validateWorkflow } from "./validate-workflow.ts";

const root = resolve(import.meta.dir, "../..");
type Step = { name?: string; run?: string };
type Job = { if: string; needs: string | string[]; steps: Step[] };
const workflowText = readFileSync(join(root, ".github/workflows/github-society-intelligence-agent.yml"), "utf-8");
const workflow = YAML.parse(workflowText) as { jobs: Record<string, Job> };
const action = YAML.parse(readFileSync(join(import.meta.dir, "society/setup-society/action.yml"), "utf-8")) as {
  runs: { steps: Step[] };
};
const fixtures: string[] = [];
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "gsi-workflow-"));
  fixtures.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of fixtures.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function shell(script: string, env: Record<string, string>, cwd = root) {
  return spawnSync("bash", ["-c", script], {
    cwd, env: { ...process.env, ...env }, encoding: "utf-8",
  });
}
function runStep(jobId: string, env: Record<string, string>) {
  return shell(workflow.jobs[jobId].steps.find((step) => step.run)!.run!, env);
}

describe("installed dispatcher parity", () => {
  const inputs: DispatchInput[] = [
    { eventName: "workflow_dispatch" },
    ...["install", "observe", "delegate", "settle", "import-memory", "unknown", " observe "]
      .map((intent) => ({ eventName: "workflow_dispatch", intent })),
    { eventName: "issues" },
    { eventName: "issue_comment" },
    { eventName: "issue_comment", actorIsBot: true },
    { eventName: "issue_comment", actorIsBot: true, issueIsPullRequest: true },
    { eventName: "pull_request", headRef: "think/stl-2026-05-26-001/agency/topic" },
    { eventName: "pull_request", headRef: "no-id", refName: "think/stl-2026-05-26-002/agency/topic" },
    { eventName: "pull_request", headRef: "think/stl-2026-05-26-0012/agency/topic" },
    { eventName: "pull_request_target" },
    { eventName: "merge_group" },
    { eventName: "schedule" },
    { eventName: "push", refName: "main" },
    { eventName: "push", refName: "feature" },
    { eventName: "other" },
    { eventName: "workflow_dispatch", intent: "settle", settlementIdInput: " stl-2026-05-26-001 " },
  ];

  test.each(inputs)("matches TypeScript for %j", (input) => {
    const dir = fixture();
    const eventPath = join(dir, "event.json");
    const outputPath = join(dir, "output");
    writeFileSync(eventPath, JSON.stringify({ issue: input.issueIsPullRequest ? { pull_request: {} } : {} }));
    const result = shell(action.runs.steps[0].run!, {
      GITHUB_EVENT_PATH: eventPath, GITHUB_OUTPUT: outputPath,
      GITHUB_EVENT_NAME: input.eventName,
      GITHUB_REF_NAME: input.refName ?? "", GITHUB_HEAD_REF: input.headRef ?? "",
      GITHUB_ACTOR: input.actorIsBot ? "example[bot]" : "human",
      INPUT_INTENT: input.intent ?? "", INPUT_SETTLEMENT_ID: input.settlementIdInput ?? "",
    });
    expect(result.status).toBe(0);
    const expected = dispatch(input);
    expect(readFileSync(outputPath, "utf-8")).toBe(
      `mode=${expected.mode}\nevent_class=${expected.eventClass}\nsettlement_id=${expected.settlementId}\n`,
    );
  });

  test.each(["invalid", "stl-2026-05-26-001\nmode=act", "stl-2026-05-26-0012"])("rejects invalid settlement %s", (id) => {
    expect(() => dispatch({ eventName: "workflow_dispatch", settlementIdInput: id })).toThrow("Invalid settlement");
    const dir = fixture();
    writeFileSync(join(dir, "event.json"), "{}");
    expect(shell(action.runs.steps[0].run!, {
      GITHUB_EVENT_PATH: join(dir, "event.json"), GITHUB_OUTPUT: join(dir, "output"),
      INPUT_INTENT: "settle", INPUT_SETTLEMENT_ID: id,
    }).status).toBe(1);
  });
});

describe("workflow enforcement", () => {
  test("requires a real job condition, not a mention inside a step", () => {
    const invalid = `on: pull_request
jobs:
  setup:
    runs-on: ubuntu-latest
  think-test:
    needs:
      - setup
    steps:
      - run: echo needs.setup.outputs.mode
`;
    expect(() => validateWorkflow(invalid)).toThrow("must gate");
    expect(() => validateWorkflow(invalid.replace("    steps:", "    if: needs.setup.outputs.mode == 'think'\n    steps:"))).not.toThrow();
  });

  test("rejects a job gated on the wrong mode", () => {
    expect(() => validateWorkflow(workflowText.replace("if: needs.setup.outputs.mode == 'think'", "if: needs.setup.outputs.mode == 'act'"))).toThrow("must gate");
  });

  test.each(["-1", "2", "abc", "1.0", "999999999999999999999999"])("rejects invalid delegation depth %s", (depth) => {
    expect(runStep("delegate-censor-delegation-depth", { DELEGATION_DEPTH: depth }).status).toBe(1);
  });

  test.each(["0", "1", "01"])("accepts in-range delegation depth %s", (depth) => {
    expect(runStep("delegate-censor-delegation-depth", { DELEGATION_DEPTH: depth }).status).toBe(0);
  });

  test.each(["failure", "skipped", "cancelled"])("fails aggregate and consolidation on %s", (result) => {
    expect(workflow.jobs["think-cognition-censor-aggregate"].if).toContain("always()");
    expect(workflow.jobs["think-cognition-consolidate-wait"].if).toContain("always()");
    expect(runStep("think-cognition-censor-aggregate", {
      NEEDS_JSON: JSON.stringify({ setup: { result: "success" }, censor: { result } }),
    }).status).toBe(1);
    expect(runStep("think-cognition-consolidate-wait", { AGGREGATE_RESULT: result }).status).toBe(1);
  });

  test("accepts successful prerequisites", () => {
    expect(runStep("think-cognition-censor-aggregate", {
      NEEDS_JSON: JSON.stringify({ setup: { result: "success" }, censor: { result: "success" } }),
    }).status).toBe(0);
  });

  test.each([
    "think-censor-credential", "think-censor-pii", "think-censor-representation-class",
    "think-censor-append-only", "think-censor-cross-directory-write",
  ])("%s fails when its diff base is unavailable", (job) => {
    expect(runStep(job, { BASE_SHA: "missing-base-for-regression", RUNNER_TEMP: fixture(), SETTLEMENT_ID: "" }).status).not.toBe(0);
  });
});
