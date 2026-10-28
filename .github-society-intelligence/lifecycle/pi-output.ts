type Message = {
  role?: string;
  content?: string | Array<{ type?: string; text?: string }>;
  stopReason?: string;
  errorMessage?: string;
};

function messages(jsonl: string, eventType: string): Message[] {
  const result: Message[] = [];
  for (const line of jsonl.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let event: { type?: string; message?: Message } | null;
    try {
      event = JSON.parse(line);
    } catch {
      // CLI diagnostics and incomplete final lines are not JSON events.
      continue;
    }
    if (event?.type === eventType && event.message) result.push(event.message);
  }
  return result;
}

function textContent(message: Message): string {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.content)) return "";
  return message.content
    .filter((block) => block?.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n\n");
}

export function extractFinalAssistantText(jsonl: string): string {
  for (const message of messages(jsonl, "message_end").reverse()) {
    if (message.role !== "assistant") continue;
    if (message.stopReason === "error" || message.stopReason === "aborted") {
      throw new Error(message.errorMessage || `pi response ${message.stopReason}`);
    }
    const text = textContent(message).trim();
    if (text) return text;
  }
  return "";
}

export function sessionMessages(jsonl: string): Array<{ role: string; text: string }> {
  return messages(jsonl, "message")
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({ role: message.role!, text: textContent(message) }));
}
