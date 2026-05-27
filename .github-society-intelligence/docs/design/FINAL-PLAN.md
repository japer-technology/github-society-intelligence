# FINAL-PLAN - Single-Workflow Society Implementation Runbook

## Status

This plan implements the final design in `FINAL.md` using the existing workflow file:

```text
.github/workflows/github-society-intelligence-agent.yml
```

That filename is retained by decision. `agent.yml` is not introduced. The public Pages workflow, `.github/workflows/gsi-public-fabric.yml`, remains out of scope and is not counted as PLAN-derived society runtime.

## Hard Invariant

At every stage:

- exactly one PLAN-derived workflow file exists;
- every society behavior is a job inside `github-society-intelligence-agent.yml`;
- every non-`setup` job depends on `setup`;
- every non-`setup` job gates on `needs.setup.outputs.mode`;
- reusable workflow files are forbidden;
- composite actions under `.github/actions/` are allowed;
- `gsi-public-fabric.yml` is separate public-fabric infrastructure, not the society runtime.

This invariant is enforced by `censor/mode-gating`, `censor/job-naming`, and `censor/dispatcher-integrity`.

## Current Baseline

Implemented surfaces:

- `setup` dispatcher job.
- `.github-society-intelligence/lifecycle/society/setup-society/action.yml` as the workflow dispatcher implementation.
- `act-install`, preserving the installer/upgrader.
- `act-conversational-bee-respond`, preserving issue/comment response behavior.
- stage-one think-mode censors.
- cognitive-loop scaffold jobs.
- observe-mode B-brain scaffold jobs.
- delegate-mode depth and hop scaffold.
- settle-mode closure scaffold.
- `.github-society-intelligence/` society skeleton.
- `FINAL.md` as the design contract.
- `validate-workflow.ts` and dispatcher tests.

Not yet implemented:

- settlement PR creation by `conversational-bee`;
- full durable artifact schemas;
- full censor engines;
- cognitive loop semantics;
- B-brain report generation;
- bridge translation records;
- ledger append/dispute/reputation behavior.

## Workflow Anatomy

The workflow has one root:

```text
setup
```

`setup` emits:

```text
mode
event_class
settlement_id
```

Every downstream job belongs to one pool:

| Mode | Prefix | Purpose |
| --- | --- | --- |
| `act` | `act-*` | Install, respond, and later open PRs. |
| `think` | `think-*` | PR censors and cognition. |
| `observe` | `observe-*` | Scheduled/manual metadata-only B-brains. |
| `delegate` | `delegate-*` | Governed channel hops. |
| `settle` | `settle-*` | Durable closure and promotion. |

Do not add jobs outside these prefixes. Do not add a job that decides its own mode independently of `setup`.

## Dispatcher Routing

| Event | Intent | Mode | Event class |
| --- | --- | --- | --- |
| `workflow_dispatch` | empty or `install` | `act` | `manual-install` |
| `workflow_dispatch` | `observe` | `observe` | `dispatch-observe` |
| `workflow_dispatch` | `delegate` | `delegate` | `dispatch-delegate` |
| `workflow_dispatch` | `settle` | `settle` | `dispatch-settle` |
| `workflow_dispatch` | `import-memory` | `act` | `dispatch-import-memory` |
| `issues.opened` | n/a | `act` | `issue-opened` |
| `issue_comment.created` | n/a | `act` | `comment-issue`, `ignored-pr-comment`, or `ignored-bot-comment` |
| `pull_request` | n/a | `think` | `pr` |
| `merge_group` | n/a | `think` | `merge-group` |
| `schedule` | n/a | `observe` | `cron-daily` |
| `push` to `main` | n/a | `settle` | `push-main` |

Settlement IDs are read from explicit dispatch input first. If absent, they are extracted from branch names that contain `stl-YYYY-MM-DD-NNN`.

## Required Checks

Stage-one checks:

| Check | Job | Purpose |
| --- | --- | --- |
| `censor/dispatcher-integrity` | `think-censor-dispatcher-integrity` | Confirms the single dispatcher contract exists. |
| `censor/mode-gating` | `think-censor-mode-gating` | Proves every job is setup-gated. |
| `censor/job-naming` | `think-censor-job-naming` | Proves every job belongs to an approved mode pool. |
| `censor/credential` | `think-censor-credential` | Blocks obvious credentials in changed lines. |
| `censor/pii` | `think-censor-pii` | Warns on obvious PII while policy matures. |
| `censor/representation-class` | `think-censor-representation-class` | Requires durable memory YAML to declare representation class. |
| `censor/append-only` | `think-censor-append-only` | Protects ledger entries and settlement records from edits. |
| `censor/cross-directory-write` | `think-censor-cross-directory-write` | Flags cross-agency writes that lack settlement context. |
| `censor/authority` | `think-censor-authority` | Requires governance authority files. |
| `censor/consolidation-window` | `think-cognition-consolidate-wait` | Reserves consolidation enforcement. |
| `censor/b-brain-content-access` | `observe-censor-b-brain-content-access` | Ensures B-brains remain metadata-only. |
| `censor/delegation-depth` | `delegate-censor-delegation-depth` | Caps delegation at one hop for the current stage. |
| `censor/credit-assignment` | `settle-censor-credit-assignment` | Reserves credit-assignment enforcement. |

Future checks land only with their stage: cloud egress, input rights, bridge probation, payment, reputation floor, silent retry, memory import, and settlement closure.

## Directory Contract

The society root is:

```text
.github-society-intelligence/
```

The stage-one skeleton establishes:

| Path | Contract |
| --- | --- |
| `governance/` | Constitution, authority, rights, maturity, approval gates, commands, self-ideals. |
| `agencies/` | Conversational bee, critic bee, B-brains, bridges, bootstrap variants, archive. |
| `censors/` | Censor registry and future policy fixtures. |
| `memory/` | Durable memory classes and ledger subdirectories. |
| `services/` | Service registry and contracts. |
| `imports/` | Provenance for future memory imports. |
| `workspace/` | Active settlements and current focus. |
| `settlements/` | Closed settlement records. |
| `state/` | Existing session state plus observability, reports, windows, self-models, self-ideals. |

No implementation should create a second root for cognitive state.

## Stage Plan

### Stage 1 - Single-Workflow Skeleton

Deliverables:

- `setup` job.
- dispatcher composite action.
- stage-one society skeleton.
- scaffold censors.
- workflow validation tests.
- final design docs.

Exit criteria:

- workflow YAML parses;
- `validate-workflow.ts` passes;
- exactly one PLAN-derived workflow exists;
- original install/respond behavior remains reachable.

### Stage 2 - Censor Hardening

Deliverables:

- stronger implementations for credential, PII, representation class, append-only, cross-directory write, and authority;
- fixture sets for pass/fail behavior;
- Branch Protection documentation for required check names.

Exit criteria:

- each censor has positive and negative tests;
- advisory checks either become fail-closed or explicitly document why they remain advisory.

### Stage 3 - Critic Bee And First Channel

Deliverables:

- `critic-bee` handler;
- channel contract from `conversational-bee` to `critic-bee`;
- first inter-agency settlement record;
- cloud-egress, input-rights, delegation-depth, and credit-assignment checks.

Exit criteria:

- one settlement names both agencies and records credit assignment;
- delegation depth above one fails.

### Stage 4 - Cognitive Loop

Deliverables:

- perception;
- recognition;
- frame selection;
- K-line activation;
- critique;
- consolidation window;
- memory promotion.

Exit criteria:

- durable memory promotion requires consolidation;
- settlement records include unknowns, blind spots, provenance, and credit targets.

### Stage 5 - B-Brains

Deliverables:

- scheduled metadata-only B-brain reports;
- observability emission;
- ecology report draft.

Exit criteria:

- B-brains cannot run from PR events;
- `read_content: true` in B-brain constitutions fails.

### Stage 6 - Bridges

Deliverables:

- bridge agency skeleton;
- translation record schema;
- bridge probation censor;
- round-trip fixture tests.

Exit criteria:

- bridged settlements record declared lossiness and drift.

### Stage 7 - Ledger

Deliverables:

- free/reciprocal ledger entries;
- append-only ledger enforcement;
- dispute window records;
- reputation update scaffold.

Exit criteria:

- ledger corrections are reversing entries;
- `currency` remains disabled unless governance changes maturity flags.

### Stage 8 - Differentiation

Deliverables:

- bootstrap agency fork procedure;
- promotion/retirement settlement record;
- ecology signal for pressured agencies.

Exit criteria:

- retirement is never deletion;
- promotion requires settlement closure.

### Stage 9 - Level 5 Declaration

Deliverables:

- maturity checklist;
- dry-run promotion settlement;
- documentation showing any agency can move to a separate repository without rewriting its constitution or memory shape.

Exit criteria:

- Level 5 is declared only after the maturity contract passes.

## Documentation Standard

Every implementation PR must update docs in the same change when it changes:

- workflow job graph;
- dispatcher routing;
- required check names;
- society directory layout;
- durable artifact schema;
- stage status.

Comments in workflow and action files should explain:

- why the job exists;
- which mode owns it;
- whether it may write;
- whether it is a scaffold or active enforcement;
- what future stage will fill it in.

Avoid comments that merely restate a command. Preserve comments that explain safety, authority, ordering, or compatibility.

## Verification Commands

Preferred local checks:

```sh
bun test lifecycle/
bun run validate:workflow
```

Fallback checks when Bun is unavailable:

```sh
node .github-society-intelligence/lifecycle/validate-workflow.ts
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/github-society-intelligence-agent.yml")'
```

Recommended when installed:

```sh
actionlint .github/workflows/github-society-intelligence-agent.yml
```

## Risk Register

| Risk | Control |
| --- | --- |
| Dispatcher drift | Keep workflow action and TypeScript dispatcher tests aligned. |
| Accidental second workflow | `validate-workflow.ts` rejects unexpected PLAN-derived workflow files. |
| Job outside a mode pool | `censor/job-naming` fails. |
| Job bypasses setup | `censor/mode-gating` fails. |
| B-brain content access | `censor/b-brain-content-access` fails on `read_content: true`. |
| Ledger mutation | Append-only checks restrict settlement and ledger records. |
| Premature currency behavior | `governance/maturity.yaml` keeps `economic_layer_enabled: false`. |

## Definition Of Done

The implementation is healthy when:

- the existing agent workflow remains the only PLAN-derived runtime;
- setup is the only dispatcher;
- all jobs are mode-prefixed and setup-gated;
- current install/respond behavior remains compatible;
- docs describe the actual implementation, not a future rename;
- tests validate dispatcher and workflow invariants;
- future stages can add behavior without adding workflow files.
