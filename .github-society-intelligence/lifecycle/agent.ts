/**
 * agent.ts — Core agent orchestrator for Society Intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the main entry point for the Society Intelligence AI coding agent.  It receives
 * a GitHub issue (or issue comment) event, runs the `pi` AI agent against the
 * user's prompt, and posts the result back as an issue comment.  It also
 * manages all session state so that multi-turn conversations across multiple
 * workflow runs are seamlessly resumed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE POSITION
 * ─────────────────────────────────────────────────────────────────────────────
 * Workflow step order:
 *   1. Authorize   (inline shell)            — auth check + add 🚀 reaction indicator
 *   2. Install     (bun install)            — install npm/bun dependencies
 *   3. Run         (agent.ts)               ← YOU ARE HERE
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT EXECUTION PIPELINE
 * ─────────────────────────────────────────────────────────────────────────────
 *   1. Fetch issue title/body from GitHub via the `gh` CLI.
 *   2. Resolve (or create) a conversation session for this issue number.
 *      - New issue  → create a fresh session; record the mapping in state/.
 *      - Follow-up  → load the existing session file for conversation context.
 *   3. Build a prompt string from the event payload.
 *   4. Run the `pi` coding agent binary with the prompt (+ prior session if resuming).
 *      Agent output is streamed through `tee` to provide a live Actions log AND
 *      persist a per-run raw JSONL file for post-processing.
 *   5. Extract the assistant's final reply and detect provider errors.
 *   6. Persist the issue → session mapping so the next run can resume the conversation.
 *   7. Stage, commit, and push all changes (session log, mapping, repo edits)
 *      back to the default branch with an automatic retry-on-conflict loop.
 *   8. Post the extracted reply as a new comment on the originating issue.
 *   9. [finally] Add an outcome reaction: 👍 (thumbs up) on success or
 *      👎 (thumbs down) on error.  The 🚀 rocket from the Authorize step
 *      is left in place for both success and error cases.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SESSION CONTINUITY
 * ─────────────────────────────────────────────────────────────────────────────
 * Society Intelligence maintains per-issue session state in:
 *   .github-society-intelligence/state/issues/<number>.json   — maps issue # → session file path
 *   .github-society-intelligence/state/sessions/<timestamp>.jsonl — the `pi` session transcript
 *
 * On every run the agent checks for an existing mapping.  If the mapped session
 * file is still present, the run "resumes" by passing `--session <path>` to `pi`,
 * giving the agent full memory of all prior exchanges for that issue.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PUSH CONFLICT RESOLUTION
 * ─────────────────────────────────────────────────────────────────────────────
 * Multiple agents may race to push to the same branch.  To handle this gracefully
 * the script retries a failed `git push` up to 10 times with increasing backoff
 * delays, pulling with `--rebase` between attempts. Conflicts stop the run
 * rather than silently overwriting either side's changes.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GITHUB COMMENT SIZE LIMIT
 * ─────────────────────────────────────────────────────────────────────────────
 * GitHub enforces a ~65 535 character limit on issue comments.  The agent reply
 * is capped at 60 000 characters to leave a comfortable safety margin.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ─────────────────────────────────────────────────────────────────────────────
 * - Node.js built-in `fs` module  (existsSync, readFileSync, writeFileSync, mkdirSync)
 * - Node.js built-in `path` module (resolve)
 * - GitHub CLI (`gh`)             — must be authenticated via GITHUB_TOKEN
 * - `pi` binary                   — installed by `bun install` from package.json
 * - System tools: `tee`, `tac`, `jq`, `git`, `bash`
 * - Bun runtime                   — for Bun.spawn and top-level await
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import { extractFinalAssistantText } from "./pi-output.ts";

// ─── Paths and event context ───────────────────────────────────────────────────
// `import.meta.dir` resolves to `.github-society-intelligence/lifecycle/`; stepping up one level
// gives us the `.github-society-intelligence/` directory which contains `state/` and `node_modules/`.
const societyIntelligenceDir = resolve(import.meta.dir, "..");
const stateDir = resolve(societyIntelligenceDir, "state");
const issuesDir = resolve(stateDir, "issues");
const sessionsDir = resolve(stateDir, "sessions");
const piSettingsPath = resolve(societyIntelligenceDir, ".pi", "settings.json");
const runnerTemp = process.env.RUNNER_TEMP ?? tmpdir();
const reactionStatePath = resolve(runnerTemp, "reaction-state.json");
const rawOutputPath = resolve(runnerTemp, `agent-${randomUUID()}.jsonl`);

// The `pi` CLI requires a repo-root-relative path for `--session-dir`, not an
// absolute one, so we keep this as a relative string constant.
const sessionsDirRelative = ".github-society-intelligence/state/sessions";

// GitHub enforces a ~65 535 character limit on issue comments; cap at 60 000
// characters to leave a comfortable safety margin and avoid API rejections.
const MAX_COMMENT_LENGTH = 60000;

// Leading characters that indicate a message is intended for a different AI agent.
// When the first character of an issue title or comment body is in this set, GSI
// exits silently so that the designated agent can react instead.
const RESERVED_PREFIXES = new Set(["`", "~", "@", "#", "$", "%", "^", ":", ";", "|", "=", "/", "\\", "&"]);

// Parse the full GitHub Actions event payload (contains issue/comment details).
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH!, "utf-8"));

// "issues" for new issues, "issue_comment" for replies on existing issues.
const eventName = process.env.GITHUB_EVENT_NAME!;

// "owner/repo" format — used when calling the GitHub REST API via `gh api`.
const repo = process.env.GITHUB_REPOSITORY!;

// Fall back to "main" if the repository's default branch is not set in the event.
const defaultBranch = event.repository?.default_branch ?? "main";

// The issue number is present on both the `issues` and `issue_comment` payloads.
const issueNumber: number = event.issue.number;

// Read the committed `.pi` defaults and pass them explicitly to the runtime.
// This prevents provider/model drift from host-level config (for example a
// runner image with a global `~/.pi/settings.json` set to github-copilot).
function readPiConfig(): { provider: string; model: string; thinking?: string } {
  const settings = JSON.parse(readFileSync(piSettingsPath, "utf-8"));
  const provider = settings?.defaultProvider;
  const model = settings?.defaultModel;
  const thinking = settings?.defaultThinkingLevel;
  if (typeof provider !== "string" || !provider || /\s/.test(provider) ||
      typeof model !== "string" || !model || /\s/.test(model) ||
      (thinking !== undefined && typeof thinking !== "string")) {
    throw new Error(`Invalid .pi settings at ${piSettingsPath}: expected provider/model IDs without whitespace and an optional thinking level.`);
  }
  return { provider, model, thinking };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Spawn an arbitrary subprocess, capture its stdout, and return both the
 * trimmed output and the process exit code.
 *
 * @param cmd  - Command and arguments array (e.g. ["git", "push", "origin", "main"]).
 * @param opts - Optional options; `stdin` can be piped from another process.
 * @returns    - `{ exitCode, stdout }` after the process has exited.
 */
async function run(cmd: string[], opts?: { stdin?: any }): Promise<{ exitCode: number; stdout: string }> {
  const proc = Bun.spawn(cmd, {
    stdout: "pipe",
    stderr: "inherit",   // surface errors directly in the Actions log
    stdin: opts?.stdin,
  });
  const stdout = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return { exitCode, stdout: stdout.trim() };
}

/**
 * Convenience wrapper: run `gh <args>` and return trimmed stdout.
 * Uses the `run` helper above so that `gh` errors appear in the Actions log.
 * Throws on non-zero exit codes to fail fast on API errors.
 */
async function gh(...args: string[]): Promise<string> {
  const { exitCode, stdout } = await run(["gh", ...args]);
  if (exitCode !== 0) {
    throw new Error(`gh ${args[0]} failed with exit code ${exitCode}`);
  }
  return stdout;
}

async function checkedRun(cmd: string[]): Promise<void> {
  const result = await run(cmd);
  if (result.exitCode !== 0) throw new Error(`${cmd.slice(0, 2).join(" ")} failed with exit code ${result.exitCode}`);
}

async function main() {
  // ─── Restore reaction state from Authorize step ─────────────────────
  // The Authorize step writes the 🚀 reaction metadata to
  // `$RUNNER_TEMP/reaction-state.json`. We read it so the `finally` block can
  // add the outcome reaction (👍 or 👎) when the agent finishes.
  // If the file is absent (e.g., authorization was skipped), we default to null.
  let reactionState: any = null;
  if (existsSync(reactionStatePath)) {
    try {
      reactionState = JSON.parse(readFileSync(reactionStatePath, "utf-8"));
    } catch {
      console.warn(`Could not parse ${reactionStatePath}, skipping reaction state`);
    }
  }

  // Track whether the agent completed successfully so the `finally` block can
  // add the correct outcome reaction (👍 on success, 👎 on error).
  let succeeded = false;

  try {
    const { provider: configuredProvider, model: configuredModel, thinking: configuredThinking } = readPiConfig();
    console.log(`Configured provider: ${configuredProvider}, model: ${configuredModel}${configuredThinking ? `, thinking: ${configuredThinking}` : ""}`);
    // ── Read issue title and body from the event payload ──────────────────────────
    // Use the webhook payload directly to avoid two `gh` API round-trips (~2–4 s).
    // GitHub truncates string fields at 65 536 characters in webhook payloads, so
    // we fall back to the API only when the body hits that limit.
    const title = event.issue.title;
    let body: string = event.issue.body ?? "";
    if (body.length >= 65536) {
      body = await gh("issue", "view", String(issueNumber), "--json", "body", "--jq", ".body");
    }

    // ── Resolve or create session mapping ───────────────────────────────────────
    // Each issue maps to exactly one `pi` session file via `state/issues/<n>.json`.
    // If a mapping exists AND the referenced session file is still present, we resume
    // the conversation by passing `--session <path>` to `pi`.  Otherwise we start fresh.
    mkdirSync(issuesDir, { recursive: true });
    mkdirSync(sessionsDir, { recursive: true });

    let sessionPath = "";
    const mappingFile = resolve(issuesDir, `${issueNumber}.json`);

    if (existsSync(mappingFile)) {
      try {
        const mapping = JSON.parse(readFileSync(mappingFile, "utf-8"));
        if (existsSync(mapping.sessionPath)) {
          // A prior session exists — resume it to preserve conversation context.
          sessionPath = mapping.sessionPath;
          console.log(`Found existing session: ${sessionPath}`);
        } else {
          // The mapping points to a session file that no longer exists (e.g., cleaned up).
          console.log("Mapped session file missing, starting fresh");
        }
      } catch {
        console.warn(`Could not parse ${mappingFile}, starting fresh`);
      }
    } else {
      console.log("No session mapping found, starting fresh");
    }

    // ── Configure git identity ───────────────────────────────────────────────────
    // Set the bot identity for all git commits made during this run.
    await checkedRun(["git", "config", "user.name", "github-society-intelligence[bot]"]);
    await checkedRun(["git", "config", "user.email", "github-society-intelligence[bot]@users.noreply.github.com"]);

    // ── Build prompt from event context ─────────────────────────────────────────
    // For `issue_comment` events, use the new comment body as the full prompt so
    // that follow-up instructions reach the agent verbatim.
    // For `issues` (opened) events, combine the title and body for full context.
    let prompt: string;
    if (eventName === "issue_comment") {
      prompt = event.comment.body ?? "";
    } else {
      prompt = `${title}\n\n${body}`;
    }

    // ── Skip reserved-prefix messages for other AI agents ───────────────────────
    // Certain leading characters signal that this message is intended for another
    // AI agent.  If the issue title (for new issues) or comment body (for comments)
    // starts with any of these characters, exit cleanly without responding so that
    // the designated agent can react instead.
    const textToCheck = eventName === "issue_comment" ? event.comment.body : title;
    if (textToCheck && RESERVED_PREFIXES.has(textToCheck[0])) {
      console.log(`Skipping: first character "${textToCheck[0]}" is a reserved prefix for another agent.`);
      succeeded = true;
      return;
    }

    // ── Validate provider API key ────────────────────────────────────────────────
    // This check is inside the try block so that the finally clause always runs
    // (adding the outcome reaction) and a helpful comment can be posted to the issue.
    const providerKeyMap: Record<string, string> = {
      anthropic: "ANTHROPIC_API_KEY",
      openai: "OPENAI_API_KEY",
      google: "GEMINI_API_KEY",
      xai: "XAI_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
      mistral: "MISTRAL_API_KEY",
      groq: "GROQ_API_KEY",
    };
    const requiredKeyName = providerKeyMap[configuredProvider];
    if (requiredKeyName && !process.env[requiredKeyName]) {
      await gh(
        "issue", "comment", String(issueNumber),
        "--body",
        `## ⚠️ Missing API Key: \`${requiredKeyName}\`\n\n` +
        `The configured provider is \`${configuredProvider}\`, but the \`${requiredKeyName}\` secret is not available to this workflow run.\n\n` +
        `### How to fix\n\n` +
        `**Option A — Repository secret** _(simplest)_\n` +
        `1. Go to **Settings → Secrets and variables → Actions → New repository secret**\n` +
        `2. Name: \`${requiredKeyName}\`, Value: your API key\n\n` +
        `**Option B — Organization secret** _(already have one?)_\n` +
        `Organization secrets are only available to workflows if the secret has been explicitly granted to this repository:\n` +
        `1. Go to your **Organization Settings → Secrets and variables → Actions**\n` +
        `2. Click the \`${requiredKeyName}\` secret → **Repository access**\n` +
        `3. Add **this repository** to the selected repositories list\n\n` +
        `Once the secret is accessible, re-trigger this workflow by posting a new comment on this issue.`
      );
      throw new Error(
        `${requiredKeyName} is not available to this workflow run. ` +
        `If you have set it as a repository secret, verify the secret name matches exactly. ` +
        `If you have set it as an organization secret, ensure this repository has been granted access ` +
        `(Organization Settings → Secrets and variables → Actions → ${requiredKeyName} → Repository access).`
      );
    }

    // ── Run the pi agent ─────────────────────────────────────────────────────────
    // Pipe agent output through `tee` so we get:
    //   • a live stream to stdout (visible in the Actions log in real time), and
    //   • a per-run persisted copy for post-processing below.
    const piBin = resolve(societyIntelligenceDir, "node_modules", ".bin", "pi");
    if (!sessionPath) sessionPath = `${sessionsDirRelative}/${randomUUID()}.jsonl`;
    const piArgs = [
      piBin,
      "--mode",
      "json",
      "--tools",
      "read,bash,edit,write,grep,find,ls",
      "--provider",
      configuredProvider,
      "--model",
      configuredModel,
      ...(configuredThinking ? ["--thinking", configuredThinking] : []),
      "--session-dir",
      sessionsDirRelative,
      "--session", sessionPath,
      "--append-system-prompt", resolve(societyIntelligenceDir, "AGENTS.md"),
      "-p",
      prompt,
    ];
    const pi = Bun.spawn(piArgs, {
      stdout: "pipe",
      stderr: "inherit",
      env: { ...process.env, PI_CODING_AGENT_DIR: resolve(societyIntelligenceDir, ".pi") },
    });
    const tee = Bun.spawn(["tee", rawOutputPath], { stdin: pi.stdout, stdout: "inherit" });
    const teeExitCode = await tee.exited;

    // Check if the pi agent exited successfully.
    const piExitCode = await pi.exited;
    if (piExitCode !== 0) {
      // Surface the provider/model in the error so that an invalid or
      // misspelled model ID doesn't fail silently — the most common cause of
      // unexpected non-zero exits from the pi agent is an unrecognised model.
      throw new Error(
        `pi agent exited with code ${piExitCode} (provider: ${configuredProvider}, model: ${configuredModel}). ` +
        `This may indicate an invalid or misspelled model ID in .pi/settings.json. ` +
        `Check the workflow logs above for details.`
      );
    }
    if (teeExitCode !== 0) throw new Error(`Could not capture pi output: tee exited ${teeExitCode}`);

    // ── Extract final assistant text ─────────────────────────────────────────────
    const agentText = extractFinalAssistantText(readFileSync(rawOutputPath, "utf-8"));
    if (!agentText) throw new Error("pi produced no assistant text for this turn.");

    // ── Persist issue → session mapping ─────────────────────────────────────────
    // Write (or overwrite) the mapping file so that the next run for this issue
    // can locate the correct session transcript and resume the conversation.
    if (existsSync(sessionPath)) {
      writeFileSync(
        mappingFile,
        JSON.stringify({
          issueNumber,
          sessionPath,
          updatedAt: new Date().toISOString(),
        }, null, 2) + "\n"
      );
      console.log(`Saved mapping: issue #${issueNumber} -> ${sessionPath}`);
    } else {
      throw new Error("pi did not write the requested session file.");
    }

    // ── Commit and push state changes ───────────────────────────────────────────
    // Stage all changes (session log, mapping JSON, any files the agent edited),
    // commit only if the index is dirty, then push with a retry-on-conflict loop.
    let persistenceError: Error | null = null;
    let pushSucceeded = false;
    try {
      await checkedRun(["git", "add", "-A"]);
      const { exitCode } = await run(["git", "diff", "--cached", "--quiet"]);
      if (exitCode === 1) {
        await checkedRun(["git", "commit", "-m", `society-intelligence: work on issue #${issueNumber}`]);
      } else if (exitCode !== 0) {
        throw new Error(`git diff failed with exit code ${exitCode}`);
      }

      const pushBackoffs = [1000, 2000, 3000, 5000, 7000, 8000, 10000, 12000, 12000, 15000];
      for (let i = 1; i <= 10; i++) {
        const push = await run(["git", "push", "origin", `HEAD:${defaultBranch}`]);
        if (push.exitCode === 0) { pushSucceeded = true; break; }
        if (i < 10) {
          console.log(`Push failed, rebasing and retrying (${i}/10)...`);
          await checkedRun(["git", "pull", "--rebase", "origin", defaultBranch]);
          await new Promise(r => setTimeout(r, pushBackoffs[i - 1]));
        }
      }
      if (!pushSucceeded) throw new Error("All 10 push attempts failed.");
    } catch (err) {
      persistenceError = err instanceof Error ? err : new Error(String(err));
      console.error("Could not persist agent changes:", persistenceError.message);
    }
    // ── Post reply as issue comment ──────────────────────────────────────────────
    // Always post the comment first so the user receives the agent's response even
    // if the push later fails.  The push failure throw (below) must come AFTER the
    // comment is posted — otherwise the throw would skip the comment entirely and
    // the user would get no reply.
    let commentBody = agentText.slice(0, MAX_COMMENT_LENGTH);
    if (!pushSucceeded) {
      commentBody += `\n\n---\n⚠️ **Warning:** The agent's session state could not be pushed to the repository. Conversation context may not be preserved for follow-up comments. See the [workflow run logs](https://github.com/${repo}/actions) for details.`;
    }
    await gh("issue", "comment", String(issueNumber), "--body", commentBody);

    // Throw push failure AFTER the comment has been posted so the user always
    // receives the agent's response.  The throw still causes the workflow step to
    // fail and adds a 👎 reaction via the `finally` block.
    if (persistenceError) throw persistenceError;

    // Mark the run as successful so the `finally` block adds 👍 instead of 👎.
    succeeded = true;

  } finally {
    try {
      if (existsSync(rawOutputPath)) unlinkSync(rawOutputPath);
    } catch (err) {
      console.warn("Could not remove raw agent output:", err);
    }
    // ── Guaranteed outcome reaction: 👍 on success, 👎 on error ─────────────────
    // This block always executes — even when the try block throws.  The 🚀 rocket
    // from the Authorize step is intentionally left in place; we only
    // ADD the outcome reaction here.
    if (reactionState) {
      try {
        const { reactionTarget, commentId: stateCommentId } = reactionState;
        const outcomeContent = succeeded ? "+1" : "-1";
        if (reactionTarget === "comment" && stateCommentId) {
          // Add outcome reaction to the triggering comment.
          await gh("api", `repos/${repo}/issues/comments/${stateCommentId}/reactions`, "-f", `content=${outcomeContent}`);
        } else {
          // Add outcome reaction to the issue itself.
          await gh("api", `repos/${repo}/issues/${issueNumber}/reactions`, "-f", `content=${outcomeContent}`);
        }
      } catch (e) {
        // Log but do not re-throw — a failed reaction should not mask the original error.
        console.error("Failed to add outcome reaction:", e);
      }
    }
  }
}

await main();
