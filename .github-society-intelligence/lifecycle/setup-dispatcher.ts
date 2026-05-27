import { appendFileSync, readFileSync } from "fs";
import { dispatch } from "./society/dispatcher.ts";

function readEvent(): any {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) return {};
  try {
    return JSON.parse(readFileSync(eventPath, "utf-8"));
  } catch {
    return {};
  }
}

const event = readEvent();
const eventName = process.env.GITHUB_EVENT_NAME ?? "";
const intent = process.env.INPUT_INTENT ?? event.inputs?.intent ?? "";
const settlementIdInput = process.env.INPUT_SETTLEMENT_ID ?? event.inputs?.settlement_id ?? "";
const refName = process.env.GITHUB_REF_NAME ?? "";
const headRef = process.env.GITHUB_HEAD_REF ?? "";
const issueIsPullRequest = Boolean(event.issue?.pull_request);
const actor = process.env.GITHUB_ACTOR ?? "";

const result = dispatch({
  eventName,
  intent,
  refName,
  headRef,
  issueIsPullRequest,
  actorIsBot: actor.endsWith("[bot]"),
  settlementIdInput,
});

console.log(`mode=${result.mode}`);
console.log(`event_class=${result.eventClass}`);
console.log(`settlement_id=${result.settlementId}`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `mode=${result.mode}\nevent_class=${result.eventClass}\nsettlement_id=${result.settlementId}\n`
  );
}
