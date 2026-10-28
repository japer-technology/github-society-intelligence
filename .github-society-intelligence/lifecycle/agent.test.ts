import { afterEach, describe, expect, test } from "bun:test";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

const fixtures: string[] = [];
afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

function runAgent(fail = "", invalidConfig = false) {
  const root = mkdtempSync(join(tmpdir(), "gsi-agent-"));
  fixtures.push(root);
  const dir = join(root, ".github-society-intelligence");
  const bin = join(root, "bin");
  for (const path of [bin, join(dir, "lifecycle"), join(dir, ".pi"), join(dir, "node_modules/.bin")]) {
    mkdirSync(path, { recursive: true });
  }
  for (const name of ["agent.ts", "pi-output.ts"]) cpSync(join(import.meta.dir, name), join(dir, "lifecycle", name));
  writeFileSync(join(dir, ".pi/settings.json"), invalidConfig ? "{" : JSON.stringify({
    defaultProvider: "openai", defaultModel: "test-model",
  }));
  writeFileSync(join(root, "event.json"), JSON.stringify({
    repository: { default_branch: "main" }, issue: { number: 1, title: "Hello", body: "test" },
  }));
  writeFileSync(join(root, "reaction-state.json"), JSON.stringify({ reactionTarget: "issue" }));
  function executable(path: string, source: string) {
    writeFileSync(path, `#!${process.execPath}\n${source}`);
    chmodSync(path, 0o755);
  }
  executable(join(bin, "git"), `
    import { appendFileSync } from "fs";
    const args = process.argv.slice(2);
    appendFileSync("git-log.jsonl", JSON.stringify(args) + "\\n");
    if (args[0] === process.env.FAIL_COMMAND) process.exit(2);
    if (process.env.FAIL_COMMAND === "pull" && args[0] === "push") process.exit(1);
    if (args[0] === "diff") process.exit(1);
  `);
  executable(join(bin, "gh"), `
    import { appendFileSync } from "fs";
    appendFileSync("gh-log.jsonl", JSON.stringify(process.argv.slice(2)) + "\\n");
  `);
  executable(join(dir, "node_modules/.bin/pi"), `
    import { writeFileSync } from "fs";
    const args = process.argv.slice(2);
    const path = args[args.indexOf("--session") + 1];
    writeFileSync("pi-args.json", JSON.stringify(args));
    writeFileSync(path, JSON.stringify({ type: "session", id: "test" }) + "\\n");
    writeFileSync(".github-society-intelligence/state/sessions/decoy.jsonl", "unrelated");
    console.log(JSON.stringify({ type: "message_end", message: {
      role: "assistant", content: [{ type: "text", text: "Agent reply" }]
    }}));
  `);
  const result = spawnSync(process.execPath, [join(dir, "lifecycle/agent.ts")], {
    cwd: root, encoding: "utf-8", timeout: 10000,
    env: {
      ...process.env, PATH: `${bin}:${process.env.PATH}`,
      GITHUB_EVENT_PATH: join(root, "event.json"), GITHUB_EVENT_NAME: "issues",
      GITHUB_REPOSITORY: "test/repo", OPENAI_API_KEY: "test-key",
      RUNNER_TEMP: root, FAIL_COMMAND: fail,
    },
  });
  const readLog = (name: string): string[][] => readFileSync(join(root, name), "utf-8")
    .trim().split("\n").map((line) => JSON.parse(line));
  return { root, dir, result, readLog };
}

describe("agent persistence", () => {
  test("maps the explicit session, not another session with a newer timestamp", () => {
    const run = runAgent();
    expect(run.result.status).toBe(0);
    const mapping = JSON.parse(readFileSync(join(run.dir, "state/issues/1.json"), "utf-8"));
    const args: string[] = JSON.parse(readFileSync(join(run.root, "pi-args.json"), "utf-8"));
    expect(mapping.sessionPath).toBe(args[args.indexOf("--session") + 1]);
    expect(mapping.sessionPath).not.toContain("decoy");
    expect(run.readLog("gh-log.jsonl").at(-1)).toContain("content=+1");
  });

  test.each(["add", "commit", "pull"])("reports %s failure instead of claiming persistence", (command) => {
    const run = runAgent(command);
    expect(run.result.status).not.toBe(0);
    const calls = run.readLog("gh-log.jsonl");
    const comment = calls.find((args) => args[0] === "issue");
    expect(comment!.join(" ")).toContain("Agent reply");
    expect(comment!.join(" ")).toContain("could not be pushed");
    expect(calls.at(-1)).toContain("content=-1");
    const gitCalls = run.readLog("git-log.jsonl");
    if (command !== "pull") expect(gitCalls.some((args) => args[0] === "push")).toBe(false);
    expect(gitCalls.some((args) => args.includes("theirs"))).toBe(false);
  });

  test("invalid settings still produce an error outcome reaction", () => {
    const run = runAgent("", true);
    expect(run.result.status).not.toBe(0);
    expect(run.readLog("gh-log.jsonl").at(-1)).toContain("content=-1");
  });
});
