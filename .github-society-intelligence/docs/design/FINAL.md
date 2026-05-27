# FINAL.md - Final Single-Workflow Society Design

## Summary

This is the final implementation design for evolving GitHub Society Intelligence from today's issue-response agent into the repository-native society described by `DESIGN.md`, under the hard constraint from `PLAN-SINGLE.md`: only the existing PLAN-derived workflow is expanded.

The workflow file remains `.github/workflows/github-society-intelligence-agent.yml`. No `agent.yml` rename, no `think.yml`, no `act.yml`, no `censor.yml`, no reusable workflow file, and no second PLAN-derived workflow may be introduced. The separate `gsi-public-fabric.yml` remains out of scope.

The repository becomes the seed society first. Federation behavior is represented inside `.github-society-intelligence/` before any external federation hop: repositories in `DESIGN.md` collapse to governed directories, channels collapse to inter-agency settlement records, bridges collapse to bridge agencies, and ledger behavior stays disabled until maturity gates permit it.

## Core Design

- Treat the current workflow as the permanent execution body of the society. Its existing install and issue-response behavior is preserved, then refactored into mode-gated jobs inside the same file.
- Add one root `setup` dispatcher job. It runs on every trigger and outputs `mode`, `event_class`, and `settlement_id`.
- Every other job declares `needs: setup` and gates on `needs.setup.outputs.mode`.
- Use five modes: `think`, `act`, `observe`, `delegate`, and `settle`.
- Use job names and check names, not workflow filenames, to preserve the cognitive distinction between deliberation and action.
- Put reusable implementation in `.github/actions/` composite actions and `.github-society-intelligence/lifecycle/` TypeScript/Bun modules. Composite actions are allowed because they are not workflows.

## Workflow Shape

`github-society-intelligence-agent.yml` owns all society behavior:

- `act-install`: current manual installer/upgrader.
- `act-conversational-bee-respond`: current issue/comment agent, changed over time to open settlement PRs instead of directly committing durable cognitive artifacts.
- `think-censor-*`: required PR checks such as credential, PII, representation class, append-only, cross-directory write, authority, dispatcher integrity, mode gating, and job naming.
- `think-cognition-*`: perception, recognition, frame selection, K-line activation, critique, censor aggregation, and consolidation wait.
- `delegate-hop-*`: inter-agency channel dispatch inside the repo, carrying settlement ID, contract SHA, payload hash, and depth.
- `observe-b-brain-*`: scheduled metadata-only B-brains.
- `settle-*`: settlement closure, memory promotion, credit assignment, ledger append, dispute windows, and reputation updates.

`settle` jobs are never `cancel-in-progress`. `think` jobs may cancel stale runs. `observe` never runs from PR events. `act` may write branches and open PRs, but only `settle` may promote durable society state to `main`.

## Repository Model

Implement the federation design inside the existing `.github-society-intelligence/` root before any external federation hop:

- `governance/`: constitution, authority registry, approval gates, rights registry, maturity flags, self-ideals.
- `agencies/`: `conversational-bee`, `critic-bee`, later B-brains, bridges, bootstrap forks, and archived agencies.
- `censors/`: durable definitions and fixtures for each required censor.
- `memory/`: events, episodic, semantic, procedural, failure, frames, analogies, concepts, K-lines, decisions, credit assignment, consolidation queue, and ledger.
- `services/`: local service registry and versioned contracts.
- `workspace/`: active settlements and current focus.
- `settlements/`: closed settlement records.
- `state/`: sessions, issue mappings, observability, ecology reports, windows, self-models, and self-ideals.

Existing `.pi/`, `AGENTS.md`, install defaults, issue/session state, local chat, and public fabric assets remain compatible.

## Required Interfaces

- Settlement IDs: `stl-YYYY-MM-DD-NNN`.
- Thought branches: `think/<settlement-id>/<agency>/<slug>`.
- Settlement PR label: `settlement: stl-...`.
- Workflow dispatch intent values: `install`, `observe`, `delegate`, `settle`, and later `import-memory`.
- Channel records include `channel_id`, pinned `contract_release`, `service_id`, input/output classes, censor requirements, budget, bridge requirement, and dispute window.
- Ledger entries are append-only. Corrections are reversing entries, never edits.
- Economic mode starts disabled. Only `free` and `reciprocal` are permitted until maturity gates explicitly enable more.

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

## Test Plan

- Add dispatcher fixture tests for every trigger and dispatch intent.
- Add workflow static tests proving there is only one PLAN-derived workflow, every job depends on `setup`, every job is mode-gated, and no reusable workflow is referenced.
- Add schema tests for governance, agency, settlement, channel, memory, credit-assignment, bridge, ledger, and observability artifacts.
- Add censor positive/negative fixture tests.
- Run `bun test lifecycle/`.
- Run `actionlint` for workflow validation when available.
- Add mocked GitHub integration tests for install, issue response, settlement PR creation, PR censoring, delegation, observe schedule, settlement closure, and ledger append.

## Assumptions

- The final document lives at `.github-society-intelligence/docs/design/FINAL.md`.
- The existing single agent workflow filename is retained.
- `gsi-public-fabric.yml` is not part of the PLAN-derived workflow cap.
- GitHub Branch Protection setup is documented and validated, but may require repository-admin configuration outside code.
