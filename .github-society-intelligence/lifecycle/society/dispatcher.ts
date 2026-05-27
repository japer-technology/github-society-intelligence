export type SocietyMode = "think" | "act" | "observe" | "delegate" | "settle";

export interface DispatchInput {
  eventName: string;
  intent?: string;
  refName?: string;
  headRef?: string;
  issueIsPullRequest?: boolean;
  actorIsBot?: boolean;
  settlementIdInput?: string;
}

export interface DispatchResult {
  mode: SocietyMode;
  eventClass: string;
  settlementId: string;
}

const SETTLEMENT_RE = /stl-\d{4}-\d{2}-\d{2}-\d{3}/;

function extractSettlementId(input: DispatchInput): string {
  if (input.settlementIdInput?.trim()) return input.settlementIdInput.trim();
  const refs = [input.headRef, input.refName].filter(Boolean) as string[];
  for (const ref of refs) {
    const match = ref.match(SETTLEMENT_RE);
    if (match) return match[0];
  }
  return "";
}

export function dispatch(input: DispatchInput): DispatchResult {
  const intent = (input.intent ?? "").trim();
  const settlementId = extractSettlementId(input);

  if (input.eventName === "workflow_dispatch") {
    if (intent === "" || intent === "install") {
      return { mode: "act", eventClass: "manual-install", settlementId };
    }
    if (intent === "observe") {
      return { mode: "observe", eventClass: "dispatch-observe", settlementId };
    }
    if (intent === "delegate") {
      return { mode: "delegate", eventClass: "dispatch-delegate", settlementId };
    }
    if (intent === "settle") {
      return { mode: "settle", eventClass: "dispatch-settle", settlementId };
    }
    if (intent === "import-memory") {
      return { mode: "act", eventClass: "dispatch-import-memory", settlementId };
    }
    return { mode: "act", eventClass: "dispatch-unknown", settlementId };
  }

  if (input.eventName === "issues") {
    return { mode: "act", eventClass: "issue-opened", settlementId };
  }

  if (input.eventName === "issue_comment") {
    if (input.issueIsPullRequest) {
      return { mode: "act", eventClass: "ignored-pr-comment", settlementId };
    }
    if (input.actorIsBot) {
      return { mode: "act", eventClass: "ignored-bot-comment", settlementId };
    }
    return { mode: "act", eventClass: "comment-issue", settlementId };
  }

  if (input.eventName === "pull_request" || input.eventName === "pull_request_target") {
    return { mode: "think", eventClass: "pr", settlementId };
  }

  if (input.eventName === "merge_group") {
    return { mode: "think", eventClass: "merge-group", settlementId };
  }

  if (input.eventName === "schedule") {
    return { mode: "observe", eventClass: "cron-daily", settlementId };
  }

  if (input.eventName === "push") {
    if (input.refName === "main") {
      return { mode: "settle", eventClass: "push-main", settlementId };
    }
    return { mode: "act", eventClass: "push-branch", settlementId };
  }

  return { mode: "act", eventClass: "unknown", settlementId };
}
