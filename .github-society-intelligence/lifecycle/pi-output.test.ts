import { describe, expect, test } from "bun:test";
import { extractFinalAssistantText, sessionMessages } from "./pi-output.ts";

const event = (message: object) => JSON.stringify({ type: "message_end", message });

describe("pi output", () => {
  test("skips diagnostics, nulls, tools, and blank assistant messages", () => {
    const output = [
      "diagnostic", "null",
      event({ role: "assistant", content: [{ type: "text", text: "final reply" }] }),
      event({ role: "toolResult", content: "tool output" }),
      event({ role: "assistant", content: [{ type: "text", text: "  " }] }),
    ].join("\n");
    expect(extractFinalAssistantText(output)).toBe("final reply");
  });

  test.each(["error", "aborted"])("does not report earlier text as success after %s", (stopReason) => {
    expect(() => extractFinalAssistantText([
      event({ role: "assistant", content: [{ type: "text", text: "working" }] }),
      event({ role: "assistant", stopReason, errorMessage: "provider failed", content: [] }),
    ].join("\n"))).toThrow("provider failed");
  });

  test("reads persisted messages and preserves full text for exports", () => {
    const text = "A long response\n\n" + "complete content ".repeat(20);
    const jsonl = [
      { type: "session", id: "test" },
      { type: "message", message: { role: "user", content: "hello" } },
      { type: "message", message: { role: "assistant", content: [{ type: "text", text }] } },
      { type: "message", message: { role: "toolResult", content: "not a conversation turn" } },
    ].map((entry) => JSON.stringify(entry)).join("\n");
    expect(sessionMessages(jsonl)).toEqual([{ role: "user", text: "hello" }, { role: "assistant", text }]);
  });
});
