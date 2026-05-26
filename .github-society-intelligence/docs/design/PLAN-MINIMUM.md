# PLAN-MINIMUM — Installing [`PLAN.md`](./PLAN.md) under a hard cap of two GitHub Actions workflows

### A derivative plan that takes [`PLAN.md`](./PLAN.md) and [`COST-REDUCTION.md`](./COST-REDUCTION.md) to their fixed point: **two workflow files — `think.yml` and `act.yml`** — covering every censor, every cognitive-loop step, every B-brain, every delegation, every settlement, with a clearly-stated path back to **one** workflow file (the current single-agent shape) when governance prefers it.

> This document is doubly derivative. Its only job is to apply the workflow-count constraint *"never more than two `.github/workflows/*.yml` files"* to the artifact inventory of [`PLAN.md §B`](./PLAN.md) and the reduction patterns of [`COST-REDUCTION.md §C`](./COST-REDUCTION.md). Nothing here weakens a censor, removes a required check, or reorders a stage from [`PLAN.md §C`](./PLAN.md). Every recommendation cites the source it derives from. Where this document introduces a constraint neither parent names, it is flagged as a *minimum-only scaffold* and justified.

The document is organised in six layers, in order of decreasing abstraction:

1. **§A — Motivation and the two-workflow invariant.** Why we cap at two; what "two GitHub Actions" precisely forbids and permits.
2. **§B — Operating principles.** The rules the implementer follows so that minimising the workflow count does not violate `PLAN.md §A`, `COST-REDUCTION.md §B`, or the constitution they protect.
3. **§C — The think / act split.** What each of the two workflows owns, mapped item-by-item against `PLAN.md §B.3` (workflows W-AG…W-IMP) and `PLAN.md §B.4` (censors C-CRED…C-BCA).
4. **§D — Single-agent collapse.** How to fold `think` and `act` into one workflow file — the current `github-society-intelligence-agent.yml` shape — without losing any of the discipline §C installs.
5. **§E — Stage-by-stage application.** For each of `PLAN.md §C`'s ten stages, what changes inside `think.yml` and `act.yml` and what the launch-count outcome is.
6. **§F — Risk, anti-patterns, out of scope, open questions.**

A short closing section (§G) restates the invariant.

---

## §A. Motivation and the two-workflow invariant

`PLAN.md §B.3` names ten workflow files at steady state. `COST-REDUCTION.md §C` reduces that to four operational files (`censors.yml`, `cognition.yml`, `observe.yml`, `delegate.yml`) plus the wrapper (`github-society-intelligence-agent.yml`) and the unrelated `gsi-public-fabric.yml`. The repository today ships exactly two workflow files (`github-society-intelligence-agent.yml`, `gsi-public-fabric.yml`), which is also the **maximum** this plan permits at every stage of `PLAN.md §C`.

The two-workflow invariant is:

> **At no point in the rollout of `PLAN.md` does `.github/workflows/` contain more than two files. The two files are named `think.yml` and `act.yml`, or — under the single-agent collapse of §D — one file named `agent.yml` that contains both modes.**

`gsi-public-fabric.yml` is unrelated to `PLAN.md`; this document treats it as an out-of-scope tenant of the same directory and counts it separately. (See §F.4.) If the public-fabric workflow must be retained, the cap on PLAN-derived workflows tightens from two to one and §D's single-agent collapse becomes mandatory rather than aspirational.

### A.1 What the invariant forbids

- Adding `censors.yml`, `cognition.yml`, `observe.yml`, `delegate.yml`, `import-memory.yml`, `perceive.yml`, `activate.yml`, `critique.yml`, `censor.yml`, `settle.yml`, `consolidate.yml`, or any other file under `.github/workflows/` beyond the two named files.
- Replacing one of the two files with a *reusable workflow* (`workflow_call`) called from a third file. Reusable workflows count toward the cap.
- Splitting `think` or `act` across multiple files for organisational neatness. The cap is on *files*, not on *jobs*.

### A.2 What the invariant permits

- Arbitrarily many **jobs** inside `think.yml` and `act.yml`. Each `C-*` censor is a job. Each cognitive-loop step is a job. Each B-brain steward is a job. Jobs use `needs:` for ordering and `if:` for path/event scoping.
- Composite actions under `.github/actions/`. Composite actions are *not* workflows; they do not count toward the cap and are the primary reuse primitive (`COST-REDUCTION.md §C P10`).
- Multiple triggers per workflow (`pull_request`, `push`, `schedule`, `workflow_dispatch`, `workflow_run`, `issues`, `issue_comment`, `merge_group`). The cap is on files, not events.
- The agent runtime invoking itself recursively *inside a single workflow run* via in-process orchestration (`PLAN.md §C Stage 4, S4-D1/D2/D3`). No new workflow file is needed for this.

### A.3 Why two and not, say, six

The four-workflow target of `COST-REDUCTION.md` is a *cost* answer. The two-workflow target of this document is a *cognitive* answer: it makes the society's externally-visible posture isomorphic to the simplest split `ANALYSIS.md §5` admits — *deliberation* before *commitment*, *think* before *act*. Every censor and every reflective check sits on the `think` side; every state-changing emission sits on the `act` side. The invariant is therefore not merely a cost cap but a *naming discipline* that makes the cognitive loop legible from `.github/workflows/` alone.

The single-workflow collapse of §D is the further fixed point: one agent, both modes, mode chosen by the trigger. That is the seed state the repository was born in and the state it returns to if §C's split is ever found to be over-engineered.

---

## §B. Operating principles

These principles bind the *implementer* when applying the §C split. They sit on top of `PLAN.md §A` and `COST-REDUCTION.md §B` without superseding either.

1. **`think` never writes outside `state/observability/` and `state/ecology-reports/` and `workspace/active-settlements/<id>/think-*`.** `think` is a read-mostly mode: it *evaluates*, it *reports*, it *gates*. Any commit to `main`, any settlement closure, any memory promotion, any ledger entry, any outbound channel call is `act`'s exclusive domain. This is the cost-reduction analogue of `PLAN.md §A item 9` ("B-brains observe, never merge"), generalised: anything that observes lives in `think`; anything that emits lives in `act`.
2. **No censor is weakened, deleted, or made advisory.** Every required check in `PLAN.md §B.4` remains required, identified by its check name, selected in Branch Protection by name. The check names are stable and survive the workflow re-shaping. This binds `COST-REDUCTION.md §B item 1`.
3. **Consolidation, never collapse.** Two censors never share a single job inside `think.yml`. Each `C-*` job emits a distinct status. This binds `COST-REDUCTION.md §B item 3`.
4. **`act` jobs depend on `think` jobs only via Branch Protection, never via `workflow_run`.** A PR merges when its required `think` jobs pass. `act` does not poll `think`; `act` is invoked by the trigger event the PR carries (or by `workflow_dispatch` from a settlement label) and consults the same `state/` and `workspace/` artifacts `think` produced. Cross-workflow `workflow_run` chains are forbidden by §A.2 ("the cap is on files, not events") only if they would otherwise force a third file; an intra-repo `workflow_run` from `think` to `act` is permitted but discouraged — prefer Branch Protection as the synchronisation primitive.
5. **No stage is reordered to save files.** `PLAN.md §C` sequencing is load-bearing. If a stage would require a third workflow file to satisfy its exit criteria, the stage's deliverables are restructured as additional *jobs* inside `think.yml` or `act.yml`, never as a new file. This is `COST-REDUCTION.md §B item 2` strengthened.
6. **Path scoping is a job's input, not its escape hatch.** A `paths:` filter that skips a job is acceptable only when `PLAN.md §B.4`'s "Where it runs" column already scopes it. This binds `COST-REDUCTION.md §B item 4`.
7. **Documentation lands with the workflow change.** Every PR that adds or modifies a job in `think.yml` or `act.yml` updates §C's mapping table in this document, mirroring `PLAN.md §A item 6` and `COST-REDUCTION.md §B item 7`.
8. **B-brains are scheduled, not event-driven.** B-brain stewards live as scheduled jobs in `think.yml`, never in `act.yml`. This binds `COST-REDUCTION.md §C P6` and strengthens `PLAN.md §A item 9` (a B-brain that lives in `think` cannot, by §B item 1, ever write to `main`).
9. **The single-agent collapse of §D is always one PR away.** Every choice in §C must be reversible into §D by a single subsequent PR that concatenates the two files behind a mode dispatcher, *without changing any job definition*. A choice in §C that cannot be folded into §D is rejected.
10. **Reversibility of every shape choice.** Every job placement in §C is reversible by a single subsequent PR — either moving the job between `think` and `act`, or splitting one file back into multiple in a future plan that supersedes this one. This mirrors `COST-REDUCTION.md §B item 5`.

---

## §C. The think / act split

`think.yml` and `act.yml` partition every workflow item from `PLAN.md §B.3` and every censor from `PLAN.md §B.4`. The partition is exhaustive (every item is placed) and disjoint (no item lives in both).

### C.1 `think.yml` — the deliberative workflow

**Triggers.** `pull_request: [opened, synchronize, ready_for_review, reopened]`, `merge_group:`, `schedule:` (for B-brains), `workflow_dispatch:`. Never `push:` to `main` (that is `act`'s domain).

**Concurrency.** `concurrency: { group: think-${{ github.ref }}, cancel-in-progress: true }` per `COST-REDUCTION.md §C P4`. Cancellation is safe because `think` never writes to `main`.

**Jobs.** In execution order, with `needs:` chains where ordering matters:

| Group | Jobs (one per row, one status per job) | Source |
| --- | --- | --- |
| **Censors (always)** | `censor/credential` (C-CRED), `censor/pii` (C-PII), `censor/commit-signature` (C-SIG) | `PLAN.md §B.4`, `COST-REDUCTION.md §C P1` |
| **Censors (scoped)** | `censor/representation-class` (C-RC), `censor/append-only` (C-AO), `censor/cross-directory-write` (C-CDW), `censor/authority` (C-AUTH), `censor/cloud-egress` (C-EGR), `censor/input-rights` (C-INR), `censor/payment` (C-PAY), `censor/delegation-depth` (C-DEP), `censor/bridge-probation` (C-BRP), `censor/reputation-floor` (C-REP), `censor/memory-class-import` (C-MCI), `censor/settlement-closure` (C-SCL), `censor/silent-retry` (C-SR), `censor/credit-assignment` (C-CA), `censor/consolidation-window` (C-CW), `censor/b-brain-content-access` (C-BCA) | `PLAN.md §B.4`, `COST-REDUCTION.md §C P3` |
| **Cognitive deliberation** | `perceive` (W-PRC), `activate` (W-ACT), `critique` (W-CRT), `censor-aggregate` (W-CEN) — each `needs:` the previous; the chain feeds *proposed* settlement contents into `workspace/active-settlements/<id>/think-proposal.yaml` but does not merge anything | `PLAN.md §B.3, §C Stage 4`, `COST-REDUCTION.md §C P2` |
| **Consolidation gate** | `consolidate-wait` (W-CON) — implements the in-run wait of `COST-REDUCTION.md §C P13`, up to ~7 h; for longer windows, records a `wait-checkpoint.yaml` and exits with `consolidation_status: pending`, which the corresponding `act` job will resume on the scheduled tail-completion run | `PLAN.md §C Stage 4, S4-D3`, `COST-REDUCTION.md §C P13` |
| **Observation (PR-time)** | `observability-emit` — writes the per-PR signals from `ANALYSIS.md §19` to `state/observability/` (no commit to `main`; uploaded as a run artifact for `act` to consume) | `PLAN.md §B.3` W-OBS partial, `COST-REDUCTION.md §C P6` |
| **B-brains (scheduled only)** | `b-brain/activation-steward`, `b-brain/memory-steward`, `b-brain/channel-steward`, `b-brain/bridge-steward`, `b-brain/economic-steward`, `b-brain/governance-drift-steward`, `b-brain/self-model-steward`, `b-brain/ecology-report` — gated by `if: github.event_name == 'schedule'`; their outputs land in `workspace/active-settlements/` as drafts that `act` later closes | `PLAN.md §C Stage 5`, `COST-REDUCTION.md §C P6` |

**Non-goals.** `think.yml` never commits to `main`, never writes a ledger entry, never opens an outbound `repository_dispatch`, never closes a settlement. If any of those is desired, the PR must trigger `act.yml`.

### C.2 `act.yml` — the productive workflow

**Triggers.** `push:` to `main` (settlement closure side-effects), `issues: [opened, edited]` and `issue_comment: [created]` (the wrapper from `PLAN.md §C Stage 1, S1-D8` — the conversational entrypoint), `workflow_dispatch:` (manual settlement closure, ecology-report publish, delegation), `schedule:` (tail-completion of consolidation windows that exceeded 7 h per `COST-REDUCTION.md §C P13` constraint). Never `pull_request:` (deliberation is `think`'s domain).

**Concurrency.** `concurrency: { group: act-${{ github.workflow }}-${{ github.ref || github.event.issue.number }}, cancel-in-progress: false }`. Cancellation is **disabled** because `act` writes; cancelling mid-write corrupts append-only invariants. This binds `COST-REDUCTION.md §C P4` constraint.

**Jobs.** In execution order:

| Group | Jobs | Source |
| --- | --- | --- |
| **Wrapper / responder** | `respond` — the current `lifecycle/agent.ts` entrypoint, invoked on `issues` / `issue_comment` events; produces a settlement PR labelled `settlement: stl-…` and pushes it to a `think/<id>/<agency>/` branch (which then triggers `think.yml` on its `pull_request: opened` event — the only inter-workflow handoff this plan permits) | `PLAN.md §C Stage 1, S1-D8` (W-AG) |
| **Settlement closure** | `settle` (W-STL) — runs on `workflow_dispatch` carrying a `pr_number` whose `think.yml` checks have all passed; performs the merge, writes the `settlements/<id>.yaml`, updates `memory/credit-assignment/<id>.yaml`, and (from Stage 7) writes the ledger entry. C-SCL (`censor/settlement-closure`) is consulted as a *gating job* inside `act.yml` here, mirroring its role in `think.yml`; this is the one exception to §B item 3 and exists because the closure step is itself the only place where the closure check has meaningful inputs | `PLAN.md §C Stage 3, S3-D7; Stage 7, S7-D7` |
| **Delegation** | `delegate` (W-DLG) — single-workflow, one-job-per-hop transport per `COST-REDUCTION.md §C P7`, capped at the active `delegation_depth` per C-DEP. Triggered on `workflow_dispatch` from a settlement label `delegate: chan-…` | `PLAN.md §C Stage 3, S3-D4` |
| **Memory import** | `import-memory` (W-IMP) — triggered on `workflow_dispatch` from a settlement label `import: src-…`; writes to `imports/` and (after consolidation) promotes to `memory/`. C-MCI runs in `think.yml`; the *import* itself is `act` | `PLAN.md §B.3, §C Stage 4` |
| **Consolidation tail-completion** | `consolidate-resume` — scheduled job that scans `workspace/active-settlements/*/wait-checkpoint.yaml` for windows that have closed since the last run, and triggers the corresponding `act/settle` step | `COST-REDUCTION.md §C P13` constraint |
| **Observation (commit side)** | `observability-commit` — commits the day's accumulated `state/observability/*` artifacts collected from `think` runs into the repository, and (on the quarterly schedule) writes `state/ecology-reports/<yyyy>-Q<n>.md` for `governance/` CODEOWNER review | `PLAN.md §C Stage 5, S5-D4, S5-D5` |

**Non-goals.** `act.yml` never runs censors as *required* checks (those are `think`'s job and live on the PR). The one exception, C-SCL inside the `settle` job, is internal gating, not a Branch Protection requirement.

### C.3 The handoff between `think` and `act`

There is exactly one handoff direction the plan permits:

```
issue / comment ──► act.respond ──► PR ──► think.<all jobs> ──► (human review) ──► act.settle ──► main
```

`act.respond` is the only place the agent runtime *originates* state. `think.*` is the only place state is *evaluated*. `act.settle` is the only place state is *committed*. The PR is the medium that carries proposed state between them. This is the same protocol `PLAN.md §A item 1` calls *"every stage is delivered as one or more PRs"* — restricted to two workflow files.

### C.4 What is *not* a workflow

Several items in `PLAN.md §B.3` are not, in this plan, separate workflows: they are *modes* of `act.respond` or *jobs* inside `think.yml`. The mapping:

| `PLAN.md §B.3` item | Realised as |
| --- | --- |
| W-AG (`github-society-intelligence-agent.yml`) | `act.yml` itself; the file is *renamed* `act.yml` at the §C cutover PR — this is a `git mv`, preserving history, per `PLAN.md §A item 5` ("move, never rewrite") |
| W-PRC, W-ACT, W-CRT, W-CEN, W-STL, W-CON | Jobs inside `think.yml` (C.1), with `W-STL`'s actual *closure* moved to `act.yml`'s `settle` job (C.2) |
| W-OBS | Split: PR-time observability is a job in `think.yml`; commit-time observability is a job in `act.yml` |
| W-DLG | A job inside `act.yml` |
| W-IMP | A job inside `act.yml` |

There are no other workflow files. The cap holds.

---

## §D. Single-agent collapse — folding `think` and `act` into one workflow

The two-workflow shape of §C is the *default*. The single-workflow shape preserved here is the *fallback*, and it is the shape the repository ships today.

### D.1 The collapse

Concatenate `think.yml` and `act.yml` into one file, `agent.yml` (or retain the existing `github-society-intelligence-agent.yml`), with a dispatcher at the top of the jobs list:

- A `setup` job runs on every trigger, computes `mode: think | act` from the event (`pull_request` / `merge_group` / `schedule` (B-brains) → `think`; `issues` / `issue_comment` / `push` / `workflow_dispatch` / `schedule` (tail-completion) → `act`), and exposes it as a job output.
- All `think.*` jobs gate on `if: needs.setup.outputs.mode == 'think'`.
- All `act.*` jobs gate on `if: needs.setup.outputs.mode == 'act'`.
- Concurrency uses a derived group: `concurrency: { group: agent-${{ needs.setup.outputs.mode }}-..., cancel-in-progress: ${{ needs.setup.outputs.mode == 'think' }} }`. The expression-driven `cancel-in-progress` honours §C.1's "cancel on think" and §C.2's "never cancel on act" simultaneously.

### D.2 Why this is safe

- Every job definition is unchanged from §C. Job names — which are the Branch Protection identifiers for the censors — do not change. Required checks remain required.
- The `setup` dispatcher is an additional job, not an additional file. The workflow file count drops from two to one.
- The `respond → think → settle` handoff (§C.3) becomes intra-workflow but is still mediated by the PR and Branch Protection; no new mechanism is needed.
- `PLAN.md §A item 7` ("the Stage 0 runtime is never broken") is honoured by construction: the collapsed shape *is* Stage 0's shape with more jobs.

### D.3 When to choose D over C

Choose §D (single workflow) when:

- The public-fabric workflow `gsi-public-fabric.yml` must be retained (§A above), making the PLAN-derived cap one rather than two.
- Branch Protection administration of two workflows' required-check overlap proves error-prone (a class of mistakes §C.3's single-handoff direction is meant to prevent, but does not eliminate).
- The activation-steward B-brain's scheduled report shows that `think` and `act` rarely run on disjoint events in practice (i.e. the split is paying no cognitive dividend).

Choose §C (two workflows) when:

- Operators want the *file system* of `.github/workflows/` to make the think/act distinction self-evident without reading workflow contents.
- The Stage 5 B-brain schedule diverges enough from the wrapper's event-driven schedule that running them in the same file's scheduler creates surprising cancellation behaviour.

The choice between §C and §D is itself a governance settlement, opened once at Stage 1 and revisited at Stage 5 and Stage 9. Either choice is reversible by one PR per §B item 9.

---

## §E. Stage-by-stage application

For each `PLAN.md §C` stage, this table records: what changes inside `think.yml` and `act.yml`, the expected launch count per representative PR, and the section of `COST-REDUCTION.md §D` whose target this plan inherits or tightens.

| Stage | What lands in `think.yml` | What lands in `act.yml` | Runs / PR (target) | Notes |
| --- | --- | --- | --- | --- |
| 0 (baseline) | — (does not yet exist) | the unchanged `github-society-intelligence-agent.yml` | 2 | `gsi-public-fabric.yml` counted separately. |
| 1 (skeleton) | Layout-lint as an advisory job | The Stage-0 wrapper, *renamed* `act.yml` via `git mv`; new jobs for the conversational-bee `respond` invocation | 2 | The rename is the only structural change. |
| 2 (censors) | C-SIG, C-CRED, C-PII (unscoped), C-RC, C-AO, C-CDW, C-AUTH (scoped) — each a job; `enforcement_mode` flag per `COST-REDUCTION.md §C P5` | unchanged | 2 | `think.yml` is born here as one new file. The cap goes 1 → 2 exactly once. |
| 3 (second agency) | + C-EGR, C-INR, C-DEP, C-CA jobs | + `delegate` job invoked on `workflow_dispatch` from a `delegate:` label | 2 | Second agency (`critic-bee`) is a directory, not a workflow. |
| 4 (cognitive loop) | + `perceive`, `activate`, `critique`, `censor-aggregate` jobs chained by `needs:`; + `consolidate-wait` job implementing `COST-REDUCTION.md §C P13`; + C-CW job | + `consolidate-resume` scheduled job for windows > 7 h | 2 | The six PLAN W-* workflows of Stage 4 are all jobs in `think.yml`. |
| 5 (B-brains) | + seven `b-brain/*-steward` jobs gated on `if: github.event_name == 'schedule'`; + C-BCA job; + `observability-emit` job | + `observability-commit` job committing the day's signals; + scheduled `ecology-report` publish step | 2 (PR) + 1 (scheduled `think`) + 1 (scheduled `act`) | B-brains never wake on PRs (`COST-REDUCTION.md §C P6`). |
| 6 (bridges) | + C-BRP job and the layout-lint sub-check on `representation_class: translation_record` | unchanged | 2 | Bridges are directories under `agencies/bridges/`, not workflows. |
| 7 (ledger) | + C-PAY, C-REP, C-SR jobs; refine C-AO scoping to include `memory/ledger/**` | + ledger-write step inside `settle`; + 30-day dispute-window orchestration as a scheduled `act` job that opens reversing-entry PRs | 2 | `act.yml` consults C-SCL internally for ledger closure correctness; see §C.2 note. |
| 8 (differentiation) | unchanged (variants reuse all existing jobs) | + bootstrap-variant `respond` invocation parameterised by variant id | 2 | Differentiation is an `agencies/` directory mechanism, not a workflow mechanism. |
| 9 (Level 5) | unchanged | + dry-run promotion job that opens but does not merge | 2 | `governance/maturity.yaml` declaration is a `settlements/` artifact. |

The "Runs / PR" column is the property this plan undertakes to hold. It is strictly less than or equal to `COST-REDUCTION.md §D`'s target column at every stage, because `COST-REDUCTION.md` keeps four operational files and this plan keeps two. The activation-steward B-brain's scheduled report (per `COST-REDUCTION.md §D`) extends to cover the two-workflow target.

---

## §F. Risk, anti-patterns, out of scope, open questions

### F.1 Anti-patterns to refuse

These would honour the file cap but violate `PLAN.md` or `COST-REDUCTION.md`. They must not be adopted.

| Anti-pattern | Why refused |
| --- | --- |
| Putting censor logic inside the `respond` job to "avoid" `think.yml` | Violates §B item 1 (`think` evaluates, `act` emits) and §B item 2 (censors are PR-time required checks; `respond` produces PRs, it does not run on them). |
| Merging C-CRED and C-PII into one `censor/secret-and-pii` job to shrink the job list | Violates §B item 3 ("consolidation, never collapse") and `COST-REDUCTION.md §B item 3`. The cap is on files, not jobs. |
| Letting `act.yml` run on `pull_request` so the agent can "self-review" | Conflates `think` and `act` in the wrong direction — `act` would then commit during deliberation. Use §D's single-workflow collapse if the boundary is unwanted. |
| Using a third workflow file `dispatch.yml` to route between `think.yml` and `act.yml` | Trivially violates the cap. Use the `respond → PR → think → settle` handoff of §C.3 instead. |
| Calling a *reusable* workflow from `think.yml` to "factor out" censor preambles | Reusable workflows are workflow files; they count. Use composite actions under `.github/actions/` per §A.2 and `COST-REDUCTION.md §C P10`. |
| Renaming `github-society-intelligence-agent.yml` to something other than `act.yml` (or, under §D, `agent.yml`) | The naming discipline of §A.3 is what makes the two-file layout legible; arbitrary names defeat the whole reason for the split. |
| Hosting B-brain stewards in `act.yml` "because they emit ecology reports" | B-brain stewards *propose* ecology reports as draft PRs; the publish step in `act.yml` (`ecology-report`) is the only `act`-side step. The stewards themselves stay in `think.yml` per §B item 8. |
| Allowing `think.yml` to commit observability snapshots directly to `main` | Violates §B item 1. `think` uploads artifacts; `act`'s `observability-commit` writes them. |
| Letting `gsi-public-fabric.yml` accrete PLAN-derived jobs so it can be subsumed | Out of scope per §F.4. If subsumption is desired, it is a separate plan that supersedes this one. |

### F.2 Top risks the two-workflow shape does not fully mitigate

| Risk | Residual mitigation |
| --- | --- |
| `think.yml` exceeds the 8-hour per-run cap once Stages 5–7 are all live | Composite-action factoring (`COST-REDUCTION.md §C P10`) and `COST-REDUCTION.md §C P13`'s `wait-checkpoint.yaml` split. If both fail, the next plan revisits §A's cap. |
| Branch Protection complexity: dozens of required-status checks all originating from `think.yml` | Use repository rulesets with path-scoped requirements per `COST-REDUCTION.md §C P3`; document the active rule set as a `governance/` settlement updated alongside each stage. |
| `act.yml` ledger-write job is cancelled by an operator click | §C.2 disables `cancel-in-progress` and adds C-AO's append-only protection; the residual risk is operator action, mitigated only by documenting the danger in `governance/commands/`. |
| The `respond → think → settle` handoff fails halfway (`think` passes, but no human dispatches `settle`) | A scheduled `act` job sweeps PRs whose `think` checks have been green for > N days and re-emits a notification (not a merge) per `governance/` policy. |
| Single-agent collapse (§D) hides cognitive structure from operators | The `setup` job's mode output is logged at the top of every run; the activation-steward's reports must include mode-breakdown counts so operators can read shape from data rather than from the file system. |

### F.3 Reversibility summary

Every choice in §C is reversible by one subsequent PR (move a job between files, or — once — perform the §D collapse). The §D collapse is itself reversible by splitting the single file back into `think.yml` and `act.yml`, with every job definition preserved. The aggregate property this plan preserves is: **no two-workflow shape choice requires more than one subsequent PR to undo, and the §C ↔ §D toggle is itself one PR.** This mirrors `PLAN.md §A item 10` and `COST-REDUCTION.md §B item 5`.

### F.4 Explicitly out of scope

This plan does **not** cover:

- `gsi-public-fabric.yml`. Its launch profile and lifecycle are not derivative of `PLAN.md`. If the public-fabric workflow must also be retired, that is a separate plan.
- Federation primitives (`PLAN.md §C Stage 10`). If federation begins, the cap re-opens by a separate plan that supersedes this one — likely admitting a third workflow `federate.yml`.
- The choice of which composite actions live under `.github/actions/` and how their inputs are shaped. That is a `governance/` settlement opened at Stage 2 alongside `censors.yml`'s birth, per `COST-REDUCTION.md §C P10`.
- Runner sizing, billed-minute optimisation, marketplace dependencies. `COST-REDUCTION.md §E.4` items remain out of scope here too.
- Replacing CODEOWNERS with reputation thresholds — `PLAN.md §D.3` rules this out at any tier.

### F.5 Open questions for the first governance settlement

These questions are not answered by `PLAN.md`, `COST-REDUCTION.md`, or this document, and must be resolved by an explicit governance settlement before §C's split lands:

1. Is the default shape §C (two workflows) or §D (one workflow)? Both are constitution-compatible; the choice binds tooling and operator habit.
2. Under §C, what is the precise rename plan for `github-society-intelligence-agent.yml` → `act.yml`? (`git mv` is required; tooling that hard-codes the old filename must be updated in the same PR per `PLAN.md §A item 6`.)
3. Under §D, which trigger events are unambiguously `think` and which are unambiguously `act`? The dispatcher's mapping is itself a small `governance/commands/` settlement that must be reviewed before §D lands.
4. What is the deadline policy for `respond → think → settle` handoffs that stall after `think` passes? (See §F.2 row 4.)
5. Does `gsi-public-fabric.yml` retire, subsume, or stay separate? (Determines whether the effective PLAN-derived cap is two or one.)

Each of these is a one-PR settlement in `governance/`, opened before the corresponding §C or §D structural change.

---

## §G. Closing

`PLAN.md` is the *what*. `COST-REDUCTION.md` is the *how many runs*. This plan is the *how many files*: **two, named for the cognitive distinction they encode, and one if governance prefers the single-agent shape the repository was born with.**

`ANALYSIS.md`'s society is built from the same constraint that built its smallest possible seed: one process, two postures — deliberate, then commit. The two-workflow invariant is that posture made syntactically visible in `.github/workflows/`. The single-workflow collapse is the same posture made syntactically invisible — present in every job's `if:` clause rather than in the file system. Either is correct; neither weakens a single censor `PLAN.md §B.4` requires.

---

*Source material: [`PLAN.md`](./PLAN.md), [`COST-REDUCTION.md`](./COST-REDUCTION.md), [`ANALYSIS.md`](./ANALYSIS.md). All workflow-count claims are upper bounds; the activation-steward's scheduled report is the authoritative source for actuals.*
