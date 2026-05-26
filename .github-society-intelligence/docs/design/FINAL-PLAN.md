# FINAL-PLAN — Implementing the single-repository Society of Mind under one GitHub Actions workflow

### The single, actionable, end-to-end plan derived from [`DESIGN.md`](./DESIGN.md) (the *what*) and [`PLAN-SINGLE.md`](./PLAN-SINGLE.md) (the *how few files, taken to one*).

> **Hard invariant.** From Stage 1 onward, `.github/workflows/` contains exactly **one** PLAN-derived file: `agent.yml` (or the retained name `github-society-intelligence-agent.yml`, decided by the Stage 1 governance settlement — see §0.3). Every censor, every cognitive-loop step, every B-brain steward, every delegation hop, and every settlement closure is a **job** inside that one file, gated by a `setup` dispatcher job. The unrelated `gsi-public-fabric.yml` is out of scope (its consolidation is owned by the public-fabric maintainers, per PLAN-SINGLE §F.4) and is not counted against this cap.

This document is the bridge between design and implementation. It is organised as:

1. **§0 — Starting state, prerequisites, and the cutover settlement.**
2. **§1 — The single workflow's anatomy.** Triggers, the `setup` dispatcher, mode-gated job pools, concurrency, composite-action layer.
3. **§2 — Required checks catalogue.** Every check name Branch Protection must select, the job that emits it, and which stage introduces it.
4. **§3 — Composite action inventory.** Every reusable unit under `.github/actions/`, what it does, what it pins.
5. **§4 — Repository layout the workflow assumes.** Directory tree under `.github-society-intelligence/` that each stage extends.
6. **§5 — Stage-by-stage implementation.** One section per stage with deliverables, jobs added to `agent.yml`, files added under `.github-society-intelligence/`, the required-check delta, the governance settlements that must land first, and the exit criteria.
7. **§6 — Test, validation, and observability strategy.** Dispatcher fixtures, censor unit tests, ecology-report wiring.
8. **§7 — Risk register and anti-patterns.** What this plan refuses to do and why.
9. **§8 — Governance settlements to file before Stage 1 begins.** The minimum settlement set.
10. **§9 — Definition of done per stage and overall.**

Throughout, every directive cites the section of [`DESIGN.md`](./DESIGN.md) or [`PLAN-SINGLE.md`](./PLAN-SINGLE.md) it derives from. Where this document introduces an implementation choice that the source documents leave open, it is marked **[implementation choice]** and the alternatives are listed.

---

## §0. Starting state, prerequisites, cutover

### 0.1 Starting state (Stage 0 baseline)

The repository as it stands today contains:

- `.github/workflows/github-society-intelligence-agent.yml` — a two-job workflow (`run-install`, `run-agent`) that responds to issues, issue comments, and `workflow_dispatch`. **This is the only PLAN-derived workflow.**
- `.github/workflows/gsi-public-fabric.yml` — out of scope per PLAN-SINGLE §F.4. Not touched by this plan.
- `.github-society-intelligence/` — design and analysis documents only; no `agencies/`, `censors/`, `memory/`, `state/`, `governance/`, or `workspace/` populated.

PLAN-SINGLE §E Stage 0 explicitly accepts this baseline as the entry point of the rollout. The plan from this point forward never increases the PLAN-derived workflow file count above one.

### 0.2 Prerequisites that block Stage 1

These must be true before Stage 1's first PR is opened:

1. A governance directory exists at `.github-society-intelligence/governance/` and contains, at minimum:
   - `maturity.yaml` declaring the current level (Level 3) and `economic_layer_enabled: false` (DESIGN §17.5, PLAN-SINGLE §B item 11).
   - `authority-registry.yaml` listing the human anchor and any service accounts (DESIGN §12.2).
   - `dispatcher-fixtures/` — the fixture suite that `censor/dispatcher-integrity` (C-DI, §2 below) will exercise. Empty is acceptable at Stage 1; populated before any new mode clause lands (PLAN-SINGLE §F.5 q3).
2. The Stage 1 governance settlement (§0.3) has been opened, reviewed, and merged on its own PR — settlements are themselves settlements (DESIGN §2 principle 2).
3. Branch Protection on `main` is configured to admit checks **by name**, not by file (PLAN-SINGLE §F.2 row 3). The check names introduced in Stage 1 (§2) are added to the required set in the same PR that introduces the jobs that emit them.

### 0.3 The Stage 1 cutover governance settlement

A single governance PR under `.github-society-intelligence/governance/settlements/` must answer, before Stage 1's first implementation PR is opened, the five open questions PLAN-SINGLE §F.5 lists:

1. **Rename** `github-society-intelligence-agent.yml` → `agent.yml`, or retain the existing name?
2. **Cron schedule** for `observe` mode at Stage 5 (default: daily; weekday-only at first to limit launch surface).
3. **Fixture-suite scope** for `censor/dispatcher-integrity` (C-DI) — every `(trigger × event-class)` pair is the recommended starting scope (cheaper than `(trigger × event-class × mode)` triples, stronger than per-trigger alone).
4. **Mode-distribution telemetry threshold** at which the activation-steward triggers a governance review (default: any single mode > 80% of launches over a 7-day window).
5. **Public-fabric consolidation policy** — preserved as written in PLAN-SINGLE §F.5 q5; this plan does not pre-empt that decision.

For this document's purposes, the **default answer** to each is assumed where one exists; the plan does not break if governance picks alternatives. The rename is treated as **optional** throughout this document; the workflow file is referred to as `agent.yml` for readability but every reference applies equally to the retained name.

---

## §1. The single workflow's anatomy

This section is the operational reading of PLAN-SINGLE §C. It specifies what `agent.yml` must look like at the end of Stage 1 (skeleton form) and how each subsequent stage extends it.

### 1.1 Triggers

`agent.yml` declares every trigger that DESIGN.md's mechanism requires, in one `on:` block. The full list, populated stage-by-stage:

| Trigger | Introduced at | Drives mode (per §1.2) |
| --- | --- | --- |
| `issues: [opened]` | Stage 0 (already present) | `act` |
| `issue_comment: [created]` | Stage 0 (already present) | `act` |
| `workflow_dispatch` | Stage 0 (already present) | `act` (install), `observe` (B-brain manual run), `delegate` (delegation hop), `settle` (settlement closure) — distinguished by the dispatch input `mode-hint:` |
| `pull_request: [opened, synchronize, reopened, ready_for_review]` | Stage 1 | `think` |
| `merge_group` | Stage 1 | `think` |
| `push: branches: [main]` | Stage 4 (settlement merges land) | `settle` |
| `schedule: cron` | Stage 5 | `observe` |
| `workflow_run` | Not used in this plan (PLAN-SINGLE §F.2 row 4 — discouraged; prefer Branch Protection + a fresh PR) |

Job-level `paths:` filters apply only as documented in DESIGN §22 and PLAN.md §B.4 (PLAN-SINGLE §B item 6). Workflow-level `paths:` filters are forbidden because they cannot be combined with the mode dispatch.

### 1.2 The `setup` dispatcher job

`setup` is the only job that runs on every trigger. It:

- Composes `.github/actions/setup-society/` (§3).
- Declares **three outputs**:
  - `mode` ∈ {`think`, `act`, `observe`, `delegate`, `settle`} (PLAN-SINGLE §C.1).
  - `event-class` — a finer-grained tag (`pr-open`, `pr-sync`, `pr-merge-queue`, `comment-issue`, `cron-hourly`, `cron-daily`, `dispatch-delegate`, `dispatch-settle`, `tail-completion`, …).
  - `settlement-id` — the active settlement identifier (read from PR branch name, dispatch payload, or `workspace/active-settlements/`), or empty.
- Is permitted to refuse a trigger (no-op exit) only for the early-disqualification cases of PLAN-SINGLE §C.4 / COST-REDUCTION §C P8: draft PRs, bot pushes, label-only edits other than the stage-label `opened` event.
- Refuses to emit `mode == 'observe'` for any `pull_request*` event (PLAN-SINGLE §B item 7).
- Refuses to emit a mode that would dispatch a paid third-party call while `governance/maturity.yaml: economic_layer_enabled: false` (PLAN-SINGLE §B item 11).

Every other job in `agent.yml` declares `needs: setup` and an `if:` gating on `needs.setup.outputs.mode == '<mode>'`. A job that runs without such a gate is rejected by `censor/mode-gating` (C-MG, §2).

### 1.3 Mode-gated job pools

PLAN-SINGLE §C.2 specifies five pools. They land in `agent.yml` as job-name prefixes:

| Pool | Naming prefix | Read/write surface | Cancel-in-progress |
| --- | --- | --- | --- |
| `think.*` | `think.censor.*`, `think.cognition.*`, `think.layout-lint`, … | Read all of `.github-society-intelligence/`; write only to `state/observability/`, `state/ecology-reports/`, `workspace/active-settlements/<id>/think-*` | `true` (cheap to cancel) |
| `act.*` | `act.conversational-bee.*`, `act.import.*`, `act.censor.*` | Open PRs, write to `workspace/active-settlements/`, commit to feature branches; **never** writes to `main` | `false` |
| `observe.*` | `observe.b-brain.*-steward`, `observe.censor.*`, `observe.emit`, `observe.ecology-report` | Reads metadata only; writes restricted to `state/observability/`, `state/ecology-reports/`, B-brain-opened settlement PRs | `false` |
| `delegate.*` | `delegate.hop-<n>`, `delegate.censor.*` | One job per hop, capped by `C-DEP` at the stage's documented `delegation_depth` (1 at Stage 3) | `false` |
| `settle.*` | `settle.close`, `settle.censor.*`, `settle.dispute-window-*`, `settle.consolidate-finalise` | May write to `main` for ledger entries and settlement merges | **`false` — load-bearing exemption (PLAN-SINGLE §B item 8)** |

Pool membership is enforced by `censor/job-naming` (C-JN, §2): every job name must begin with a pool prefix.

### 1.4 Concurrency

The `concurrency:` block is mode-derived (PLAN-SINGLE §C.4):

- `group:` = `agent-${{ needs.setup.outputs.mode }}-${{ github.ref || github.event.dispatch.payload.id }}` with refinements for `delegate` (channel + hop number) and `settle` (settlement-id).
- `cancel-in-progress:` = `true` if `mode == 'think'`, else `false`. **`settle` must never be cancellable** (PLAN-SINGLE §B item 8) because ledger half-writes are irreversible (DESIGN §17.5).

Because `concurrency` is evaluated at workflow-trigger time and `mode` is only known after `setup` runs, the mode-derived expression lives in a **per-job** `concurrency:` block (workflow-level `concurrency:` cannot reference job outputs). This is the single largest implementation subtlety in §1 and is **[implementation choice]** between:

- **Per-job concurrency groups** (chosen): every job in `act.*`, `delegate.*`, `settle.*`, `observe.*` declares its own `concurrency: group: ..., cancel-in-progress: false`; `think.*` jobs declare `cancel-in-progress: true`.
- **A workflow-level group keyed on `github.event_name`** plus a per-job override. Less precise; rejected.

### 1.5 Composite-action layer

Per PLAN-SINGLE §C.5 / COST-REDUCTION §C P10, all shared steps live under `.github/actions/`. Composite actions are **not** workflows and do not count toward the file cap. See §3 below for the complete inventory.

### 1.6 What `agent.yml` looks like at the end of Stage 1 (skeleton)

A single file with:

- The full `on:` block above (minus Stage 4+ triggers).
- A workflow-level `permissions:` block of minimum-necessary scopes (`contents: read`, `issues: write`, `pull-requests: write`, `id-token: none`).
- The `setup` job.
- The five Stage 1 jobs (§5.1).
- Three single-only scaffold censors: `think.censor.dispatcher-integrity`, `think.censor.mode-gating`, `think.censor.job-naming`.
- A `layout-lint` advisory job (`think.layout-lint`).

Every subsequent stage adds jobs to this one file; no stage removes the `setup` job, the three scaffold censors, the cancel-in-progress exemption, or the pool-prefix discipline.

---

## §2. Required checks catalogue

These are the check names Branch Protection on `main` must select. The mapping is the inversion of PLAN-SINGLE §C.3 / §D.2, and is the **canonical source** for which job emits which check at which stage.

| Check name | Owning job(s) in `agent.yml` | Stage introduced | Source |
| --- | --- | --- | --- |
| `censor/dispatcher-integrity` | `think.censor.dispatcher-integrity` | 1 | PLAN-SINGLE §D.2 (single-only scaffold C-DI) |
| `censor/mode-gating` | `think.censor.mode-gating` | 1 | PLAN-SINGLE §D.2 (C-MG) |
| `censor/job-naming` | `think.censor.job-naming` | 1 | PLAN-SINGLE §D.2 (C-JN) |
| `censor/commit-signature` | `think.censor.commit-signature` | 2 | DESIGN §13 / PLAN.md §B.4 |
| `censor/credential` | `think.censor.credential` | 2 | DESIGN §13 |
| `censor/pii` | `think.censor.pii` | 2 | DESIGN §13 |
| `censor/representation-class` | `think.censor.representation-class` | 2 | DESIGN §3 / §6 |
| `censor/append-only` | `think.censor.append-only` + `settle.censor.append-only-ledger` | 2 (think) / 7 (ledger) | DESIGN §2 principle 12, §17 |
| `censor/cross-directory-write` | `think.censor.cross-directory-write` | 2 | DESIGN §11 / insulation-map |
| `censor/authority` | `settle.censor.authority` | 2 (scaffold) / 7 (full) | DESIGN §12 |
| `censor/cloud-egress` | `think.censor.cloud-egress` + `act.censor.cloud-egress-runtime` | 3 | DESIGN §13 |
| `censor/input-rights` | `act.censor.input-rights` | 3 | DESIGN §13 |
| `censor/credit-assignment` | `settle.censor.credit-assignment` | 3 (scaffold) / 7 (full) | DESIGN §16 |
| `censor/delegation-depth` | `delegate.censor.delegation-depth` | 3 | DESIGN §13 |
| `censor/consolidation-window` | `think.cognition.consolidate-wait` + `settle.consolidate-finalise` | 4 | DESIGN §5 / §15 |
| `censor/memory-class-import` | `think.censor.memory-class-import` + `act.censor.memory-class-import-open` | 4 (act side) / 5 (think side) | DESIGN §15.2 |
| `censor/b-brain-content-access` | `observe.censor.b-brain-content-access` | 5 | DESIGN §2 principle 7, §18 |
| `censor/bridge-probation` | `settle.censor.bridge-probation` | 6 | DESIGN §9 |
| `censor/payment` | `settle.censor.payment` | 7 | DESIGN §17 |
| `censor/reputation-floor` | `delegate.censor.reputation-floor` | 7 | DESIGN §17.3 |
| `censor/silent-retry` | `settle.censor.silent-retry` | 7 | DESIGN §17 |
| `censor/settlement-closure` | `settle.censor.settlement-closure` | 7 | DESIGN §10.2 |

**Rule of introduction.** A check is added to Branch Protection **in the same PR** that introduces the job emitting it. A check is never removed without a governance settlement and never made advisory (PLAN-SINGLE §B item 2).

**Aggregating censor surface.** The job `think.cognition.censor-aggregate` (Stage 4) `needs:` every `think.censor.*` job and produces no check of its own; its purpose is graph closure for the cognitive loop, not a Branch Protection signal.

---

## §3. Composite action inventory

All paths are under `.github/actions/`. Each composite is one directory containing `action.yml` plus implementation files. Composite actions do not count toward the workflow file cap (PLAN-SINGLE §A.2 / §C.5).

| Composite | Introduced at | Purpose |
| --- | --- | --- |
| `setup-society/` | 1 | The `setup` dispatcher composite. Computes `mode`, `event-class`, `settlement-id`. Exercises `governance/dispatcher-fixtures/` for self-test. |
| `agent-runtime/` | 1 | Wraps the existing agent runtime invocation (refactor of the current `run-agent` job's steps). Consumed by `act.conversational-bee.respond`. |
| `agent-installer/` | 1 | Wraps the existing installer (refactor of the current `run-install` job). Consumed by `act.installer.run`. |
| `layout-lint/` | 1 | Validates the on-disk layout against §4. Advisory at Stage 1; required from Stage 2. |
| `censor-<name>/` | per §2 stage | One composite per censor (19 total at steady state, plus the 3 single-only scaffolds). Each is called only by its owning job(s). |
| `cognitive-step-<name>/` | 4 | One per cognitive-loop step: `perceive`, `activate`, `critique`, `censor-aggregate`, `consolidate-wait`, `consolidate-resume`. |
| `b-brain-<name>-steward/` | 5 | One per B-brain: `activation`, `memory`, `channel`, `bridge`, `economic`, `governance-drift`, `self-model` (DESIGN §18). |
| `delegate-hop/` | 3 | One composite consumed by every `delegate.hop-<n>` job. Hop number is a parameter; the composite is not duplicated per hop. |
| `settle-<phase>/` | 4 (close, schema-check), 7 (credit-assignment-emit, ledger-append, dispute-window-open, reputation-update) | One per settlement-closure phase. |
| `observability-emit/` | 5 | Wrapper for `state/observability/` writes; used by `observe.emit` and by any cognitive-loop step that emits a trace. |

Every composite that wraps a censor declares `inputs:` for the paths it inspects and `outputs:` for a structured verdict (`pass` / `fail` / `n/a`) plus a human-readable explanation. The job that owns the composite emits the verdict to the check API.

The composite directory itself is guarded by `think.censor.dispatcher-integrity` (C-DI) for `setup-society/` and by `think.censor.cross-directory-write` (C-CDW, Stage 2 onward) for the rest.

---

## §4. Repository layout the workflow assumes

This is the layout under `.github-society-intelligence/` that `agent.yml` reads from and writes to. It mirrors DESIGN §22 (the `<name>-society` repo's layout), collapsed into the single-repository case for this plan. Directories are added stage-by-stage; the table below shows the final shape, with the **stage that creates each entry** in brackets.

```text
.github-society-intelligence/
├── constitution.yaml                [1]
├── representation.yaml              [2]
├── insulation-map.yaml              [2]
├── governance/                      [1]
│   ├── maturity.yaml                [1]
│   ├── authority-registry.yaml      [1]
│   ├── rights-registry.yaml         [3]
│   ├── self-ideals.yaml             [5]
│   ├── dispatcher-fixtures/         [1]
│   ├── settlements/                 [1]
│   └── ecology-reports/             [5]
├── agencies/                        [1]
│   ├── conversational-bee/          [1, refactor of current agent]
│   ├── critic-bee/                  [3]
│   └── b-brains/                    [5]
│       ├── activation-steward/
│       ├── memory-steward/
│       ├── channel-steward/
│       ├── bridge-steward/
│       ├── economic-steward/
│       ├── governance-drift-steward/
│       └── self-model-steward/
├── critics/                         [3]
├── censors/                         [2]
│   └── <one directory per censor implementation>
├── suppressors/                     [3]
├── memory/                          [2]
│   ├── events/                      [2]
│   ├── episodic/                    [4]
│   ├── semantic/                    [4]
│   ├── procedural/                  [4]
│   ├── failure/                     [4]
│   ├── frames/                      [4]
│   ├── analogies/                   [4]
│   ├── concepts/                    [4]
│   ├── klines/                      [4]
│   └── decisions/                   [4]
├── channels/                        [3]
├── services/                        [3]
├── imports/                         [4]
├── bridges/                         [6]
├── workspace/                       [1]
│   └── active-settlements/<id>/
└── state/                           [1]
    ├── self-models/                 [5]
    ├── self-ideals/                 [5]
    ├── observability/               [5]
    └── ecology-reports/             [5]
```

Each `censors/<name>/` directory contains the censor's implementation (the composite under `.github/actions/censor-<name>/` invokes it). This split keeps the censor *policy* with the rest of the agency code (and under `cross-directory-write` discipline) while the *invocation glue* lives where every other CI glue lives.

---

## §5. Stage-by-stage implementation

Each stage is one or more PRs. Every PR adds jobs to **`agent.yml` only**, plus content under `.github-society-intelligence/` and composites under `.github/actions/`. No PR adds a second workflow file.

The "runs / PR" target column is the property each stage undertakes to hold (per PLAN-SINGLE §E).

### 5.1 Stage 1 — Skeleton (the cutover)

**Governance settlements that must land first:** §0.3 (the cutover settlement).

**Jobs added to `agent.yml`:**

1. `setup` (the dispatcher; consumes `setup-society/`).
2. `act.installer.run` — refactor of today's `run-install` job; gated on `mode == 'act' && event-class == 'dispatch-install'`.
3. `act.conversational-bee.respond` — refactor of today's `run-agent` job; gated on `mode == 'act' && (event-class == 'issue-opened' || event-class == 'comment-issue')`.
4. `think.layout-lint` — invokes `layout-lint/`. Advisory; will become required at Stage 2.
5. `think.censor.dispatcher-integrity` — invokes `censor-dispatcher-integrity/`. Required.
6. `think.censor.mode-gating` — invokes `censor-mode-gating/`. Required. Statically checks that every job in `agent.yml` declares an `if:` on `needs.setup.outputs.mode`.
7. `think.censor.job-naming` — invokes `censor-job-naming/`. Required. Statically checks every job name's pool prefix.

**Composites added:** `setup-society/`, `agent-runtime/`, `agent-installer/`, `layout-lint/`, `censor-dispatcher-integrity/`, `censor-mode-gating/`, `censor-job-naming/`.

**Repository layout added:** `governance/{maturity.yaml,authority-registry.yaml,dispatcher-fixtures/,settlements/}`, `agencies/conversational-bee/` (the existing prompt and config moved here), `workspace/`, `state/`, `constitution.yaml`.

**Triggers added:** `pull_request: [opened, synchronize, reopened, ready_for_review]`, `merge_group`.

**Required checks delta:** +3 (C-DI, C-MG, C-JN).

**Runs / PR target:** 2 (think + act, where applicable). Most PRs that touch only docs are `think`-only and run once.

**Exit criteria:**
- The existing conversational behaviour (issue → reply) is preserved end-to-end, demonstrated by a smoke-test issue opened and answered after Stage 1 merges.
- `think.censor.dispatcher-integrity` passes against the seed fixture set (one fixture per trigger).
- `think.censor.mode-gating` and `think.censor.job-naming` are statically green on `agent.yml`.
- Branch Protection lists the three new check names.
- The Stage 1 cutover settlement PR is merged and referenced from `governance/settlements/`.

### 5.2 Stage 2 — Core censors

**Governance settlements that must land first:** representation registry shape (`representation.yaml`); insulation map shape (`insulation-map.yaml`); `enforcement_mode` flag semantics per PLAN-SINGLE §E Stage 2.

**Jobs added to `agent.yml`:**
- `think.censor.commit-signature`
- `think.censor.credential`
- `think.censor.pii`
- `think.censor.representation-class`
- `think.censor.append-only`
- `think.censor.cross-directory-write`
- `settle.censor.authority` (scaffold: passes if no settlement is in scope; gains teeth at Stage 7)

**Composites added:** one `censor-<name>/` per censor.

**Repository layout added:** `representation.yaml`, `insulation-map.yaml`, `censors/<name>/` for each, `memory/`, `memory/events/`.

**Required checks delta:** +7 (C-SIG, C-CRED, C-PII, C-RC, C-AO, C-CDW, C-AUTH). `think.layout-lint` is promoted from advisory to required.

**Runs / PR target:** 1 (think).

**Exit criteria:**
- Every censor has at least one positive and one negative fixture under `censors/<name>/fixtures/` (DESIGN §3 "Concept formation with examples and non-examples").
- All seven check names are in the Branch Protection required list.
- A red-team PR that intentionally trips each censor demonstrates fail-closed behaviour.

### 5.3 Stage 3 — Second agency + delegation skeleton

**Governance settlements that must land first:** rights registry (`rights-registry.yaml`); `delegation_depth: 1` policy.

**Jobs added to `agent.yml`:**
- `delegate.hop-1`
- `delegate.censor.delegation-depth`
- `think.censor.cloud-egress`
- `act.censor.cloud-egress-runtime`
- `act.censor.input-rights`
- `settle.censor.credit-assignment` (scaffold form)

**Composites added:** `censor-cloud-egress/`, `censor-input-rights/`, `censor-delegation-depth/`, `censor-credit-assignment/`, `delegate-hop/`.

**Repository layout added:** `agencies/critic-bee/`, `critics/`, `suppressors/`, `channels/`, `services/`, `governance/rights-registry.yaml`.

**Required checks delta:** +5 (C-EGR think+act share one check name C-EGR per PLAN.md §B.4; C-INR, C-DEP, C-CA — scaffolds count for the catalogue but a scaffold-only check is permitted to be advisory until Stage 7 if and only if the governance settlement records this exception with an explicit sunset at Stage 7).

**Runs / PR target:** 1 (think) on review PRs, 1 (delegate) on dispatch.

**Exit criteria:**
- A `critic-bee` agency exists as a directory with its own `constitution.yaml`.
- A round-trip `delegate.hop-1` dispatch executes end-to-end with depth 1, fails closed at depth 2, and emits a credit-assignment scaffold record.
- `act.censor.input-rights` rejects an intake handler that lacks declared input-rights for the channel.

### 5.4 Stage 4 — The cognitive loop and import-memory

**Governance settlements that must land first:** consolidation window default duration (≤ 7 h to stay inside a single workflow run, per PLAN-SINGLE §E Stage 4 / COST-REDUCTION §C P13); import-memory provenance policy (DESIGN §15.2).

**Jobs added to `agent.yml`:**
- `think.cognition.perceive`
- `think.cognition.activate` (`needs: think.cognition.perceive`)
- `think.cognition.critique` (`needs: think.cognition.activate`)
- `think.cognition.censor-aggregate` (`needs:` all `think.censor.*`)
- `think.cognition.consolidate-wait` (long-run wait checkpoint, emits the C-CW check name)
- `settle.consolidate-finalise` (closure verification)
- `act.import.open-pr` + `think.import.review`
- `act.censor.memory-class-import-open`
- `think.censor.memory-class-import`

**Composites added:** `cognitive-step-{perceive,activate,critique,censor-aggregate,consolidate-wait,consolidate-resume}/`, `settle-close/`, `settle-schema-check/`, `censor-memory-class-import/`, `censor-consolidation-window/`.

**Triggers added:** `push: branches: [main]` (drives `settle` mode for settlement-merging commits).

**Repository layout added:** `memory/{episodic,semantic,procedural,failure,frames,analogies,concepts,klines,decisions}/`, `imports/`.

**Required checks delta:** +2 (C-CW, C-MCI).

**Runs / PR target:** 1 (think). The `consolidate-wait` step uses an in-run wait (per COST-REDUCTION §C P13) for windows ≤ 7 h; longer windows are out of scope until governance opts in.

**Exit criteria:**
- A representative settlement PR exercises the full `perceive → activate → critique → censor-aggregate → consolidate-wait` chain.
- The merge of that PR triggers `settle.consolidate-finalise` on the `push` to `main`.
- An `import-memory` flow opens a PR and the C-MCI check passes review.

### 5.5 Stage 5 — B-brains and ecology

**Governance settlements that must land first:** cron schedule (§0.3 q2); B-brain plurality (DESIGN §3 "Plural B-brains" — at least two stewards per B-brain category recommended, but the seven-singleton baseline is acceptable for Stage 5).

**Jobs added to `agent.yml`:**
- Seven `observe.b-brain.<name>-steward` jobs (DESIGN §18): `activation`, `memory`, `channel`, `bridge`, `economic` (active but no-op until Level 6 opt-in per DESIGN §17.5), `governance-drift`, `self-model`.
- `observe.censor.b-brain-content-access`
- `observe.emit` (observability signals)
- `observe.ecology-report` (publishes `state/ecology-reports/<date>.yaml`)

**Composites added:** one `b-brain-<name>-steward/` per steward, `observability-emit/`, `censor-b-brain-content-access/`.

**Triggers added:** `schedule: cron: "<governance-decided>"`.

**Repository layout added:** `agencies/b-brains/<seven directories>/`, `state/{self-models,self-ideals,observability,ecology-reports}/`, `governance/{self-ideals.yaml,ecology-reports/}`.

**Required checks delta:** +1 (C-BCA).

**Runs / PR target:** 1 (think) per PR + 1 (observe) per scheduled tick.

**Exit criteria:**
- B-brains never wake on a PR event (verified by C-DI fixtures for every `pull_request*` event class).
- The activation-steward's first scheduled report emits a mode-distribution histogram to `state/observability/`.
- The ecology-report job publishes a daily summary to `state/ecology-reports/`.

### 5.6 Stage 6 — Bridges

**Governance settlements that must land first:** bridge probation policy and round-trip test format (DESIGN §9).

**Jobs added to `agent.yml`:**
- `settle.censor.bridge-probation`
- Either a sub-check inside `think.censor.representation-class` or a sibling job `think.censor.translation-record-locality` enforcing that `representation_class: translation_record` only appears under `bridges/**` (PLAN-SINGLE §E Stage 6 — **[implementation choice]**; default: sibling job for clearer attribution).

**Composites added:** `censor-bridge-probation/`, `censor-translation-record-locality/`.

**Repository layout added:** `bridges/` (the directory; specific bridges are added when needed).

**Required checks delta:** +1 (C-BRP); +1 (the translation-record locality check, if implemented as a sibling — counts as a sub-check of C-RC if not, no new check name).

**Runs / PR target:** 1 (think).

**Exit criteria:**
- A demonstration bridge agency is added under `bridges/<example>/` with at least one round-trip test passing.

### 5.7 Stage 7 — Ledger and disputes (Level 6 opt-in, dry-run only)

**Governance settlements that must land first:** ledger schema (DESIGN §17.2); dispute-window duration (30 days per DESIGN §17.4); reputation-floor thresholds.

**Critical:** `governance/maturity.yaml: economic_layer_enabled` remains `false`. This stage builds the **mechanism** but does not switch on ledger writes against real economic activity (DESIGN §17.5 hard rule).

**Jobs added to `agent.yml`:**
- `settle.censor.payment`
- `delegate.censor.reputation-floor`
- `settle.censor.silent-retry`
- `settle.censor.settlement-closure`
- `settle.censor.append-only-ledger` (ledger-scoped refinement of C-AO)
- `settle.dispute-window-open` (one job; opens the 30-day window)
- `settle.dispute-window-resolve` (scheduled job; resolves windows whose duration has elapsed)
- Promote `settle.censor.authority` and `settle.censor.credit-assignment` from Stage 2/3 scaffold form to full form.

**Composites added:** `censor-payment/`, `censor-reputation-floor/`, `censor-silent-retry/`, `censor-settlement-closure/`, `censor-append-only-ledger/`, `settle-credit-assignment-emit/`, `settle-ledger-append/`, `settle-dispute-window-open/`, `settle-reputation-update/`.

**Repository layout added:** `memory/decisions/ledger-entries/` (already created in Stage 4; populated here only under economic opt-in).

**Triggers added:** none (the dispute-window-resolve job is gated on the existing `schedule:` from Stage 5).

**Required checks delta:** +4 (C-PAY, C-REP, C-SR, C-SCL).

**Runs / PR target:** 1 (think) on PRs + 1 (settle) on ledger-writing merges.

**Exit criteria:**
- A dry-run ledger entry settles closure through `settle.*` without producing a real economic effect.
- The dispute-window-open / dispute-window-resolve pair executes against a synthetic settlement.
- `governance/maturity.yaml` records that the economic layer is built-but-disabled.

### 5.8 Stage 8 — Differentiation by fork (in-repo variants)

**Governance settlements that must land first:** variant naming convention; bootstrap protection policy (DESIGN §20.1).

**Jobs added to `agent.yml`:** none structurally new. The variant id is a parameter computed by `setup` (added to `setup`'s outputs as `variant`) and threaded through the existing `act.conversational-bee.respond` and `think.cognition.*` jobs. The single rename `act.conversational-bee.respond` → `act.bootstrap.<variant>-respond` is **[implementation choice]**; the default keeps the existing name and reads `variant` inside the job.

**Composites added:** none.

**Repository layout added:** `agencies/<variant>-bee/` per variant.

**Required checks delta:** 0.

**Runs / PR target:** 1 (think) + 1 (act) per variant.

**Exit criteria:** at least one fork variant runs end-to-end alongside the baseline.

### 5.9 Stage 9 — Level 5 declaration (dry-run promotion)

**Governance settlements that must land first:** Level 5 promotion criteria audit (DESIGN §24).

**Jobs added to `agent.yml`:** `settle.dry-run-promotion` (opens but does not merge the demonstration PR for `governance/maturity.yaml` update per PLAN-SINGLE §E Stage 9 / PLAN.md §C Stage 9, S9-D3).

**Composites added:** `settle-dry-run-promotion/`.

**Required checks delta:** 0.

**Runs / PR target:** 1 (think).

**Exit criteria:** the dry-run PR is opened, reviewed, and closed without merge; the governance settlement decides whether to open a real promotion PR.

### 5.10 Stage 10 — Federation (out of scope here)

PLAN-SINGLE §F.4 lists federation primitives (`repository_dispatch`, cross-org credentials, the federation governance repo) as explicitly out of scope. The single-workflow shape is preserved when federation later lands: cross-repo dispatches enter `agent.yml` through the existing `workflow_dispatch` trigger (with `mode-hint: delegate`) and exit through composites under `delegate-hop/`. No new `.github/workflows/*.yml` file is required.

---

## §6. Test, validation, and observability strategy

### 6.1 Dispatcher fixtures

`governance/dispatcher-fixtures/` contains one fixture per `(trigger × event-class)` pair (the recommended scope from §0.3 q3). Each fixture is a JSON record holding the event payload and the expected `(mode, event-class, settlement-id)` triple. `censor/dispatcher-integrity` (C-DI) runs the `setup-society/` composite against every fixture and asserts equality. Adding a new event type requires adding a fixture in the same PR that adds the dispatcher clause.

### 6.2 Censor fixtures

Each `censors/<name>/fixtures/` directory holds at least one positive and one negative case (DESIGN §3 "Concept formation"). The censor's composite has a self-test mode that runs the fixtures and is invoked by a job-local step before the censor's external check is emitted.

### 6.3 Layout-lint

`layout-lint/` validates the on-disk layout against §4: every entry the current stage requires must exist; entries from later stages may exist (forward-compatible); entries that violate naming or insulation rules are flagged. Required from Stage 2 onward.

### 6.4 Observability and the ecology report

`observe.emit` (Stage 5+) writes structured events to `state/observability/<date>.jsonl`. The activation-steward (Stage 5+) reads this stream and produces the daily `state/ecology-reports/<date>.yaml` summary including:
- Total runs, broken down by mode.
- Distribution of `event-class` per mode.
- Per-censor pass / fail counts.
- Mode-distribution skew vs the governance threshold (§0.3 q4).
- Active settlements and their phases.

The ecology report is the authoritative source for "runs per PR" actuals; the target column in §5 is upper-bound.

### 6.5 Smoke tests

After each stage merges, the smoke test is: (1) open a representative PR that exercises the new jobs, (2) confirm the expected check names appear with the expected verdicts, (3) confirm the run count matches §5's target column, (4) confirm the ecology report records the run correctly (Stage 5+).

---

## §7. Risks, anti-patterns, definition refusals

PLAN-SINGLE §F.1 enumerates anti-patterns; this section names the implementation-time risks particular to this plan and the residual mitigations.

| Risk | Mitigation |
| --- | --- |
| `setup` becomes a fragile chokepoint as modes proliferate. | C-DI fixture suite mandatory before any new mode clause; one fixture per `(trigger × event-class)` pair. |
| Per-job overhead approaches the per-run wall clock cap. | Composite-action factoring is mandatory; `consolidate-wait` checkpoints any window > 7 h across runs without splitting the file. |
| Branch Protection list grows long. | The §2 catalogue is the canonical list; administration is by name, identical to the multi-file shape. |
| `concurrency:` complexity at the per-job level introduces typos. | A static check (added at Stage 1 inside `censor/mode-gating`'s composite, or a sibling check if necessary) asserts that every non-`think` job has `cancel-in-progress: false`. |
| A regression in `setup` cascades to every job in the file. | Rollback is a one-PR revert of the `setup-society/` composite; C-DI's fixtures catch most regressions before merge. |
| The `gsi-public-fabric.yml` file's owners independently add a second PLAN-derived workflow. | Out of scope; the cap is on PLAN-derived files. A `CODEOWNERS` rule on `.github/workflows/` plus a documented note in `governance/` records the expectation. |

**Refusals** (operational analogues of PLAN-SINGLE §F.1):

- This plan refuses to introduce `think.yml` / `act.yml` as a transition step, even with `agent.yml` retained.
- This plan refuses to factor jobs into reusable workflows (`workflow_call`), which would add files.
- This plan refuses to collapse two censors into one job, however cheap the combined check appears.
- This plan refuses to let B-brains wake on `pull_request` events under any circumstance.
- This plan refuses to remove the cancel-in-progress exemption from `settle` mode.
- This plan refuses to add a third single-only scaffold check beyond C-DI, C-MG, C-JN without an amendment to this document and PLAN-SINGLE §D.

---

## §8. Governance settlements to file before Stage 1

The following settlements must exist under `.github-society-intelligence/governance/settlements/` before Stage 1's first implementation PR is opened. Each is itself one PR (DESIGN §2 principle 2).

1. **Cutover settlement** — answers the five PLAN-SINGLE §F.5 questions (§0.3 above).
2. **Check-naming settlement** — adopts §2 as the authoritative required-check list and binds Branch Protection administration to it.
3. **Composite-action settlement** — adopts §3 as the authoritative composite inventory and the rule that no reusable workflow is introduced.
4. **Layout settlement** — adopts §4 as the authoritative on-disk layout, with the per-stage column as the per-stage exit gate.

Stages 2 through 9 each carry their own preceding governance settlement(s) as listed in §5; those are filed when the stage opens, not now.

---

## §9. Definition of done

### 9.1 Per stage

A stage is **done** when:

- Every job listed in §5.<stage> is present in `agent.yml`.
- Every composite listed for the stage exists under `.github/actions/`.
- Every required-check addition is in Branch Protection.
- The stage's exit criteria are demonstrated by at least one merged PR exercising the new jobs.
- The ecology report (from Stage 5 onward) shows the stage's "runs / PR" target as the actual within ±20%.
- The Stage 1 invariant — exactly one PLAN-derived workflow file — still holds.

### 9.2 Overall

The full plan is **done** when:

- Stages 1 through 7 are done.
- Stage 8 (differentiation) is done if and when the society requires variants.
- Stage 9 (Level 5 declaration) is done when governance opts in.
- Federation (Stage 10, DESIGN §28 Stages 2 onward) is deferred until a separate plan supersedes this document; this plan binds *forward* — no future PR may add a second PLAN-derived workflow file without a governance settlement that explicitly supersedes PLAN-SINGLE §B item 9.

The repository at the end of Stage 7 is a faithful Level-3-to-4-capable single-repository society, built-but-not-enabled for Level 6, with one workflow file, a documented job graph, a documented censor catalogue, a documented composite-action inventory, and an ecology report measuring its own behaviour against this document's targets.

---

*Source material: [`DESIGN.md`](./DESIGN.md), [`PLAN-SINGLE.md`](./PLAN-SINGLE.md), and through them [`PLAN.md`](./PLAN.md), [`COST-REDUCTION.md`](./COST-REDUCTION.md), [`PLAN-MINIMUM.md`](./PLAN-MINIMUM.md), [`ANALYSIS.md`](./ANALYSIS.md). All runs-per-PR figures are upper bounds on a representative settlement PR; the activation-steward's scheduled ecology report (Stage 5 onward) is the authoritative source for actuals.*
