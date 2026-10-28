import { afterEach, describe, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { spawnSync } from "child_process";

const source = resolve(import.meta.dir, "..");
const fixtures: string[] = [];

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "gsi-runtime-"));
  fixtures.push(root);
  const dir = join(root, ".github-society-intelligence");
  mkdirSync(join(dir, ".pi"), { recursive: true });
  cpSync(join(source, "lifecycle"), join(dir, "lifecycle"), { recursive: true });
  symlinkSync(join(source, "node_modules"), join(dir, "node_modules"), "dir");
  writeFileSync(join(dir, "AGENTS.md"), "GSI_TEST_PERSONALITY_MARKER\n");
  writeFileSync(join(dir, ".pi", "settings.json"), JSON.stringify({
    defaultProvider: "openai", defaultModel: "test-model",
    quietStartup: true, retry: { enabled: false },
  }));
  const script = join(dir, "lifecycle", "local-chat.ts");
  const env = {
    ...process.env, NO_COLOR: "1", PI_OFFLINE: "1", PI_SKIP_VERSION_CHECK: "1",
    LOCAL_PROVIDER: "", LOCAL_MODEL: "", LOCAL_THINKING: "",
    LOCAL_LLM_BASE_URL: "", OPENAI_BASE_URL: "", OPENAI_API_KEY: "",
  };
  return {
    root, dir, script, env,
    run: (args: string[]) => spawnSync(process.execPath, [script, ...args], {
      cwd: root, env, encoding: "utf-8", timeout: 10000,
    }),
  };
}

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("local CLI", () => {
  test.each([
    ["--thread"], ["--name"], ["--rm"], ["--thread", "--new"],
    ["--new", "--list"], ["--name", "orphan"], ["--bogus"], ["--list", "prompt"],
  ].map((args) => ({ args })))("rejects malformed arguments %j with exit 2", ({ args }) => {
    expect(fixture().run(args).status).toBe(2);
  });

  test("unknown threads fail before configuration or provider prompts", () => {
    const result = fixture().run(["--thread", "unknown", "hello"]);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain("Unknown thread");
    expect(result.stdout).not.toContain("Setup needed");
  });

  test("creation needs no provider and deleted IDs are never reused", () => {
    const f = fixture();
    expect(f.run(["--new", "--name", "first"]).status).toBe(0);
    expect(f.run(["--new", "--name", "first"]).status).toBe(2);
    expect(f.run(["--rm", "1"]).status).toBe(0);
    expect(f.run(["--new", "--name", "second"]).status).toBe(0);
    expect(JSON.parse(readFileSync(join(f.dir, "state/threads/2.json"), "utf-8")).name).toBe("second");
  });

  test("invalid config and noninteractive missing keys return exit 1", () => {
    const f = fixture();
    expect(f.run(["--new", "hello"]).status).toBe(1);
    f.env.LOCAL_PROVIDER = "openai";
    f.env.LOCAL_MODEL = "test-model";
    const result = f.run(["--new", "hello"]);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Missing API key");
  });

  test("an actual pi turn uses the local endpoint, personality and explicit session", async () => {
    const f = fixture();
    const foreignCwd = mkdtempSync(join(tmpdir(), "gsi-foreign-"));
    fixtures.push(foreignCwd);
    const requests: string[] = [];
    const server = Bun.serve({
      hostname: "127.0.0.1", port: 0,
      async fetch(request) {
        requests.push(await request.text());
        const chunks = [
          { id: "chatcmpl-test", object: "chat.completion.chunk", choices: [{ index: 0, delta: { role: "assistant", content: "local response" }, finish_reason: null }] },
          { id: "chatcmpl-test", object: "chat.completion.chunk", choices: [{ index: 0, delta: {}, finish_reason: "stop" }] },
        ];
        return new Response(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") + "data: [DONE]\n\n", {
          headers: { "Content-Type": "text/event-stream" },
        });
      },
    });
    try {
      const env = {
        ...f.env, LOCAL_PROVIDER: "lmstudio", LOCAL_MODEL: "custom-local-model",
        LOCAL_LLM_BASE_URL: `http://127.0.0.1:${server.port}/v1`,
        OPENAI_BASE_URL: "http://127.0.0.1:1/wrong-endpoint",
      };
      for (const args of [["--new", "hello"], ["--thread", "1", "follow up"]]) {
        const proc = Bun.spawn([process.execPath, f.script, ...args], {
          cwd: foreignCwd, env, stdout: "pipe", stderr: "pipe",
        });
        const [stdout, stderr, code] = await Promise.all([
          new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited,
        ]);
        expect({ code, stderr: code ? stderr : "" }).toEqual({ code: 0, stderr: "" });
        expect(stdout).toContain("local response");
      }
      expect(requests).toHaveLength(2);
      expect(requests[0]).toContain("GSI_TEST_PERSONALITY_MARKER");
      expect(JSON.parse(requests[0]).model).toBe("custom-local-model");
      expect(requests[1]).toContain("follow up");
      expect(requests[1]).toContain("hello");
      const record = JSON.parse(readFileSync(join(f.dir, "state/threads/1.json"), "utf-8"));
      expect(readdirSync(join(f.dir, "state/sessions")).filter((name) => name.endsWith(".jsonl"))).toHaveLength(1);
      expect(readFileSync(record.sessionPath, "utf-8")).toContain("local response");
      expect(readdirSync(foreignCwd)).toEqual([]);
    } finally {
      server.stop(true);
    }
  }, 30000);
});
