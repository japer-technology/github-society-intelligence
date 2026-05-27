import { describe, expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { resolve } from "path";
import { dispatch } from "./society/dispatcher.ts";

const MI_DIR = resolve(import.meta.dir, "..");
const VALIDATE_WORKFLOW = resolve(MI_DIR, "lifecycle", "validate-workflow.ts");

describe("society dispatcher", () => {
  test("manual dispatch defaults to install in act mode", () => {
    expect(dispatch({ eventName: "workflow_dispatch" })).toEqual({
      mode: "act",
      eventClass: "manual-install",
      settlementId: "",
    });
  });

  test("observe dispatch maps to observe mode", () => {
    expect(dispatch({ eventName: "workflow_dispatch", intent: "observe" }).mode).toBe("observe");
  });

  test("delegate dispatch maps to delegate mode", () => {
    expect(dispatch({ eventName: "workflow_dispatch", intent: "delegate" }).mode).toBe("delegate");
  });

  test("settle dispatch maps to settle mode", () => {
    expect(dispatch({ eventName: "workflow_dispatch", intent: "settle" }).mode).toBe("settle");
  });

  test("pull requests map to think mode and extract settlement IDs from branches", () => {
    expect(dispatch({
      eventName: "pull_request",
      headRef: "think/stl-2026-05-26-001/conversational-bee/test",
    })).toEqual({
      mode: "think",
      eventClass: "pr",
      settlementId: "stl-2026-05-26-001",
    });
  });

  test("issue comments on pull requests are ignored by the act responder", () => {
    expect(dispatch({
      eventName: "issue_comment",
      issueIsPullRequest: true,
    })).toEqual({
      mode: "act",
      eventClass: "ignored-pr-comment",
      settlementId: "",
    });
  });
});

describe("single-workflow validation", () => {
  test("the existing workflow is the only PLAN-derived workflow and all jobs are setup-gated", () => {
    const result = spawnSync(process.execPath, ["run", VALIDATE_WORKFLOW], {
      cwd: resolve(MI_DIR, ".."),
      encoding: "utf-8",
      env: { ...process.env, NO_COLOR: "1" },
    });
    expect(result.status).toBe(0);
  });
});
