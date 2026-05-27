# FINAL.md - Final Single-Workflow Society Design

## Purpose

This document is the binding design contract for implementing `DESIGN.md` through the hard single-workflow constraint of `PLAN-SINGLE.md`.

GitHub Society Intelligence starts as an issue-response agent. This design evolves it into a repository-native society without introducing a second PLAN-derived workflow file. The existing file, `.github/workflows/github-society-intelligence-agent.yml`, remains the permanent execution body. The separate `.github/workflows/gsi-public-fabric.yml` remains a public Pages publisher and is out of scope.

The result is a seed society inside one repository. Federation concepts from `DESIGN.md` are represented locally first: repositories become governed directories, cross-repo channels become inter-agency settlement records, bridges become bridge agencies, and the ledger remains non-currency until maturity gates allow more.

## Non-Negotiable Invariants

- The only PLAN-derived workflow file is `.github/workflows/github-society-intelligence-agent.yml`.
- Do not add `agent.yml`, `think.yml`, `act.yml`, `censor.yml`, `observe.yml`, `delegate.yml`, `settle.yml`, reusable workflow files, or any other PLAN-derived workflow.
- Every non-`setup` job in the workflow declares `needs: setup` and gates on `needs.setup.outputs.mode`.
- The `setup` job is the only dispatcher. Individual jobs must not reimplement independent mode decisions.
- Required censors are represented as stable check names, not as separate workflow files.
- `observe` never runs from PR events.
- `settle` is never cancellable and is the only mode reserved for durable promotion to `main`.
- Economic behavior starts disabled. `currency` mode is forbidden until governance explicitly enables it after maturity review.

## Dispatcher Contract

`setup` classifies every trigger into three outputs:

| Output | Meaning |
| --- | --- |
| `mode` | One of `think`, `act`, `observe`, `delegate`, or `settle`. |
| `event_class` | A fine-grained reason such as `issue-opened`, `comment-issue`, `pr`, `cron-daily`, `dispatch-delegate`, or `dispatch-settle`. |
| `settlement_id` | The active `stl-YYYY-MM-DD-NNN` ID, read from dispatch input or a thought branch name when present. |

Mode routing:

| Trigger | Mode | Notes |
| --- | --- | --- |
| `issues.opened` | `act` | Conversational entrypoint. |
| `issue_comment.created` | `act` | Ignores PR comments and bot comments by event class. |
| `workflow_dispatch: install` or empty intent | `act` | Preserves installer/upgrader behavior. |
| `workflow_dispatch: import-memory` | `act` | Reserved import PR opening surface. |
| `pull_request` / `merge_group` | `think` | Runs censors and cognition scaffolds. |
| `schedule` / `workflow_dispatch: observe` | `observe` | Metadata-only B-brain surface. |
| `workflow_dispatch: delegate` | `delegate` | Governed inter-agency channel hop surface. |
| `push` to `main` / `workflow_dispatch: settle` | `settle` | Settlement-side effects and closure surface. |

The canonical dispatcher implementation for the workflow is `.github-society-intelligence/lifecycle/society/setup-society/action.yml`. The TypeScript implementation at `.github-society-intelligence/lifecycle/society/dispatcher.ts` mirrors it for local regression tests.

## Workflow Architecture

`github-society-intelligence-agent.yml` contains one job graph with five mode-prefixed pools:

| Pool | Job prefix | Responsibility |
| --- | --- | --- |
| `act` | `act-*` | Install/upgrade, respond to issues, and open future settlement/import PRs. |
| `think` | `think-*` | PR evaluation, required censors, and cognitive-loop scaffolds. |
| `observe` | `observe-*` | Scheduled or manual metadata observation by B-brains. |
| `delegate` | `delegate-*` | Inter-agency channel hop scaffolding with depth checks. |
| `settle` | `settle-*` | Settlement closure scaffolding, memory promotion, ledger checks, and credit assignment. |

Current concrete jobs:

- `act-install` preserves the template installer/upgrader.
- `act-conversational-bee-respond` preserves the current issue/comment agent.
- `think-censor-*` establishes the first required-check names.
- `think-cognition-*` establishes the cognitive-loop order.
- `observe-b-brain-*` establishes scheduled metadata-only B-brain slots.
- `delegate-hop-1` establishes the first governed delegation surface.
- `settle-close` establishes the non-cancellable settlement closure surface.

Later stages fill in behavior inside these surfaces instead of adding workflows.

## Repository Model

The society root is `.github-society-intelligence/`.

| Directory | Role |
| --- | --- |
| `governance/` | Constitution, authority registry, rights registry, maturity gates, approval gates, and self-ideals. |
| `agencies/` | `conversational-bee`, `critic-bee`, B-brains, bridge agencies, bootstrap variants, and archived agencies. |
| `censors/` | Durable censor registry and future policy fixtures. |
| `memory/` | Events, episodic, semantic, procedural, failure, frames, analogies, concepts, K-lines, decisions, credit assignment, consolidation queue, and ledger. |
| `services/` | Local service registry and versioned contracts. |
| `imports/` | Provenance records for memory imports before consolidation. |
| `workspace/` | Active settlements and focus records. |
| `settlements/` | Closed settlement records. |
| `state/` | Existing issue/session state plus observability, ecology reports, windows, self-models, and self-ideals. |

Existing `.pi/`, `AGENTS.md`, install defaults, issue/session state, local chat, and public-fabric assets remain compatible.

## Required Interfaces

- Settlement IDs: `stl-YYYY-MM-DD-NNN`.
- Thought branches: `think/<settlement-id>/<agency>/<slug>`.
- Settlement PR label: `settlement: stl-...`.
- Workflow dispatch intents: `install`, `observe`, `delegate`, `settle`, and `import-memory`.
- Delegation metadata: `settlement_id`, `channel_id`, `contract_sha`, `payload_hash`, and `delegation_depth`.
- Channel records: `channel_id`, pinned `contract_release`, `service_id`, input/output classes, censor requirements, budget, bridge requirement, and dispute window.
- Ledger entries: append-only. Corrections are reversing entries, never edits.
- Economy: `free` and `reciprocal` are allowed; `currency` is disabled until maturity gates change.

## Required Checks

Stage 1 establishes the single-workflow scaffold checks:

- `censor/dispatcher-integrity`
- `censor/mode-gating`
- `censor/job-naming`

Stage 2 and later expand the required check catalogue:

- `censor/credential`
- `censor/pii`
- `censor/representation-class`
- `censor/append-only`
- `censor/cross-directory-write`
- `censor/authority`
- `censor/consolidation-window`
- `censor/b-brain-content-access`
- `censor/delegation-depth`
- `censor/credit-assignment`

Additional future checks from `PLAN-SINGLE.md` land only when their stages are implemented: cloud egress, input rights, bridge probation, payment, reputation floor, silent retry, memory import, and settlement closure.

## Stage Order

1. Add `setup`, mode-gating, job-naming, dispatcher-integrity checks, and the initial society directory skeleton.
2. Convert the current responder into `conversational-bee` and make durable responses settlement-oriented.
3. Add core censors as required checks.
4. Add `critic-bee` and the first inter-agency settlement.
5. Add perception, recognition, frames, K-lines, analogies, consolidation windows, and full-loop credit assignment.
6. Add scheduled B-brains and ecology reports.
7. Add bridge agencies and bridge probation.
8. Add ledger in non-currency mode only.
9. Exercise differentiation by fork.
10. Declare Level 5 only after the maturity contract is satisfied.

## Documentation Contract

Documentation and implementation must move together:

- Any job graph change updates this file and `FINAL-PLAN.md`.
- Any dispatcher route change updates `.github-society-intelligence/lifecycle/society/setup-society/action.yml`, `.github-society-intelligence/lifecycle/society/dispatcher.ts`, and dispatcher tests.
- Any new required check updates `censors/registry.yaml`, Branch Protection documentation, and workflow validation tests.
- Any new durable artifact type adds a schema or fixture before the artifact is used by a settlement.

## Verification

Required local checks:

```sh
bun test lifecycle/
bun run validate:workflow
```

Fallback checks when Bun is unavailable:

```sh
node .github-society-intelligence/lifecycle/validate-workflow.ts
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/github-society-intelligence-agent.yml")'
```

Recommended CI/static checks:

```sh
actionlint .github/workflows/github-society-intelligence-agent.yml
```

Acceptance criteria:

- Exactly one PLAN-derived workflow remains.
- The workflow parses.
- `validate-workflow.ts` passes.
- Every non-`setup` job is setup-gated.
- The dispatcher maps PR branches containing `stl-YYYY-MM-DD-NNN` to `think` mode and extracts the settlement ID.
- `gsi-public-fabric.yml` remains untouched and out of scope.

## Current Implementation Status

Implemented now:

- `FINAL.md`.
- The stage-one society directory skeleton.
- `setup` dispatcher via `.github-society-intelligence/lifecycle/society/setup-society/action.yml`.
- Mode-gated expansion of the existing workflow.
- Workflow static validation script.
- Dispatcher regression tests.

Reserved for later stages:

- Settlement PR creation by `conversational-bee`.
- Full schema validation for durable artifacts.
- Real censor policy engines beyond first-pass scaffolds.
- Cognitive loop implementation.
- B-brain ecology report generation.
- Bridge, ledger, dispute, and reputation behavior.
