# PLAN-SINGLE — Installing [`PLAN.md`](./PLAN.md) under a hard cap of **one** GitHub Actions workflow

### A derivative plan that takes [`PLAN.md`](./PLAN.md), [`COST-REDUCTION.md`](./COST-REDUCTION.md), and [`PLAN-MINIMUM.md`](./PLAN-MINIMUM.md) to their fixed point: **one workflow file — `agent.yml`** — covering every censor, every cognitive-loop step, every B-brain, every delegation, every settlement, with no second `.github/workflows/*.yml` file ever introduced for any stage of the rollout.

> This document is triply derivative. Its only job is to apply the workflow-count constraint *"never more than one `.github/workflows/*.yml` file"* to the artifact inventory of [`PLAN.md §B`](./PLAN.md), the reduction patterns of [`COST-REDUCTION.md §C`](./COST-REDUCTION.md), and the think/act split of [`PLAN-MINIMUM.md §C`](./PLAN-MINIMUM.md). Nothing here weakens a censor, removes a required check, or reorders a stage from [`PLAN.md §C`](./PLAN.md). Every recommendation cites the source it derives from. Where this document introduces a constraint none of its parents name, it is flagged as a *single-only scaffold* and justified.

The document is organised in seven layers, in order of decreasing abstraction:

1. **§A — Motivation and the one-workflow invariant.** Why we cap at one; what "one GitHub Actions workflow" precisely forbids and permits.
2. **§B — Operating principles.** The rules the implementer follows so that minimising the workflow count to one does not violate `PLAN.md §A`, `COST-REDUCTION.md §B`, `PLAN-MINIMUM.md §B`, or the constitution they protect.
3. **§C — Anatomy of `agent.yml`.** The single file's structure: a `setup` dispatcher job, the mode it computes, and the job pools (`think.*`, `act.*`, `observe.*`, `delegate.*`, `settle.*`) gated by that mode.
4. **§D — Mapping to `PLAN.md §B.3` workflows and `§B.4` censors.** Item-by-item correspondence between every workflow and every required check `PLAN.md` names, and the job (or composite-action step) inside `agent.yml` that owns it.
5. **§E — Stage-by-stage application.** For each of `PLAN.md §C`'s ten stages, what new jobs land in `agent.yml` and the launch-count outcome per representative PR.
6. **§F — Risk, anti-patterns, out of scope, open questions.**
7. **§G — Closing.**

---

## §A. Motivation and the one-workflow invariant

`PLAN.md §B.3` names ten workflow files at steady state. `COST-REDUCTION.md §C` reduces that to four operational files plus the wrapper. `PLAN-MINIMUM.md §C` reduces it further to two (`think.yml` and `act.yml`) and reserves §D of that document for a *single-agent collapse* into one file. This plan is the explicit elaboration of `PLAN-MINIMUM.md §D` as a first-class staged rollout: the collapse is not a fallback chosen after the split has been tried; it is the **starting** and **steady-state** shape.

The repository today already ships a single PLAN-derived workflow file (`github-society-intelligence-agent.yml`). The unrelated `gsi-public-fabric.yml` is counted separately (see §F.4) but is treated as the binding reason this plan exists at all: while it remains, the PLAN-derived cap is one, and no alternative is permitted.

The one-workflow invariant is:

> **At no point in the rollout of `PLAN.md` does `.github/workflows/` contain more than one PLAN-derived file. That file is named `agent.yml` (or retains the existing `github-society-intelligence-agent.yml` name across stages — the name choice is itself a one-time governance settlement at Stage 1, per `PLAN.md §A item 5` "move, never rewrite"). Every censor, every cognitive-loop step, every B-brain steward, every delegation hop, every settlement closure, and every observability emission is a *job* inside that one file, gated by `if:` on a mode computed by a `setup` dispatcher job.**

### A.1 What the invariant forbids

- Adding `think.yml`, `act.yml`, `censors.yml`, `cognition.yml`, `observe.yml`, `delegate.yml`, `import-memory.yml`, `perceive.yml`, `activate.yml`, `critique.yml`, `censor.yml`, `settle.yml`, `consolidate.yml`, or any other PLAN-derived file under `.github/workflows/` beyond `agent.yml`.
- Replacing `agent.yml` (or its parts) with a *reusable workflow* (`workflow_call`) defined in a second file. Reusable workflow files count toward the cap.
- Splitting any stage's jobs across multiple files for organisational neatness. The cap is on *files*, not on *jobs*.
- Introducing the `think.yml`/`act.yml` split of `PLAN-MINIMUM.md §C` as a transitional step en route to some later one-file shape. This plan is the *direct* path to one file; transitions through two files are not authorised by this document.

### A.2 What the invariant permits

- Arbitrarily many **jobs** inside `agent.yml`. Each `C-*` censor is a job. Each cognitive-loop step is a job. Each B-brain steward is a job. Each delegation hop is a job. Jobs use `needs:` for ordering and `if:` for path/event/mode scoping.
- Composite actions under `.github/actions/`. Composite actions are *not* workflows; they do not count toward the cap and are the primary reuse primitive (`COST-REDUCTION.md §C P10`).
- Arbitrarily many triggers on the single workflow (`pull_request`, `push`, `schedule`, `workflow_dispatch`, `workflow_run`, `issues`, `issue_comment`, `merge_group`). The cap is on files, not events. The `setup` job's mode computation (§C.1) is what makes one file legible across this many triggers.
- The agent runtime invoking itself recursively *inside a single workflow run* via in-process orchestration (`PLAN.md §C Stage 4, S4-D1/D2/D3`). No new workflow file is needed for this.
- Multiple concurrent runs of `agent.yml` for different modes; concurrency is managed by mode-derived `concurrency.group` per §C.4, not by file separation.

### A.3 Why one and not two

`PLAN-MINIMUM.md §A.3` justifies the two-file split as a *cognitive* answer — making the deliberation/commitment distinction self-evident from the file system. The one-file shape of this plan makes a stronger claim: the distinction is **not** self-evident from the file system; it is self-evident from the **job names** inside one file (`think.censor.credential`, `act.settle.close`, `observe.b-brain.activation-steward`, …). The naming discipline migrates from filename to jobname, and the file system reflects what it actually is: one agent.

The argument that the single-file shape is the seed state the repository was born in (`PLAN-MINIMUM.md §A.3` and §D.2) becomes the argument that the seed state is *also* the steady state. The society grows by acquiring jobs, schemas, agencies, and memory — not workflow files.

### A.4 What changes relative to `PLAN-MINIMUM.md §D`

`PLAN-MINIMUM.md §D` describes the single-agent collapse as a *concatenation* of the two §C workflows behind a mode dispatcher, available as a one-PR move at any stage. This plan **never produces the two-workflow shape in the first place**, so the collapse is not a folding-back operation but the original construction. Concretely:

- `PLAN-MINIMUM.md §C`'s `think`/`act` separation becomes a `mode` label on jobs in §C below, not a file boundary.
- `PLAN-MINIMUM.md §D.1`'s `setup` job is promoted from "additional job at collapse time" to "first job at every stage from Stage 1 onward".
- `PLAN-MINIMUM.md §D.3`'s governance settlement choosing between §C and §D is no longer required; this plan answers the question by construction.
- `PLAN-MINIMUM.md §B item 9` ("the single-agent collapse of §D is always one PR away") binds *forward*: any future PR adding a second workflow file must demonstrate why this plan's fixed point is no longer adequate, before that PR may be opened.

---

## §B. Operating principles

These principles bind the *implementer* when applying the §C structure. They sit on top of `PLAN.md §A`, `COST-REDUCTION.md §B`, and `PLAN-MINIMUM.md §B` without superseding any of them.

1. **`agent.yml` is one file, many minds.** The cognitive plurality `ANALYSIS.md §3` demands is realised inside `agent.yml` by job names that begin with the *mode* the job runs in (`think.*`, `act.*`, `observe.*`, `delegate.*`, `settle.*`) and the *agency* the job acts on behalf of (`think.critic-bee.review`, `act.conversational-bee.respond`, …). The file system does not partition the agents; the job graph does. This is the analogue of `PLAN-MINIMUM.md §B item 1` ("`think` never writes…"), promoted to a job-naming discipline: anything whose job name begins with `think.`, `observe.`, or any B-brain prefix is read-mostly; anything that begins with `act.` or `settle.` may write.
2. **No censor is weakened, deleted, or made advisory.** Every required check in `PLAN.md §B.4` remains required, identified by its check name (`censor/credential`, `censor/pii`, …), selected in Branch Protection by name. The check names are stable and survive the consolidation into one file. The job that produces each named check lives in `agent.yml` under `think.censor.<id>` (or `act.censor.<id>` for the small set of censors that must run during state-changing emissions; see §C.3). This binds `COST-REDUCTION.md §B item 1` and `PLAN-MINIMUM.md §B item 2`.
3. **Consolidation, never collapse.** Two censors never share a single job inside `agent.yml`. Each `C-*` job emits a distinct status. This binds `COST-REDUCTION.md §B item 3` and `PLAN-MINIMUM.md §B item 3`.
4. **The `setup` job is the only thing that runs on every trigger.** `setup` computes `mode` and `event-class` outputs (see §C.1) and is the sole `needs:` predecessor of every other job. A job that would run before `setup` is forbidden; a job that runs without an `if:` gate on `setup`'s outputs is forbidden. This is the *single-file* analogue of `PLAN-MINIMUM.md §B item 4`'s "Branch Protection mediates think→act"; here the dispatch is in-process, but the contract — *no job acts before the trigger has been classified* — is identical.
5. **No stage is reordered to save jobs.** `PLAN.md §C` sequencing is load-bearing. If a stage would require a second workflow file to satisfy its exit criteria, the stage's deliverables are restructured as additional jobs inside `agent.yml`, never as a new file. This is `COST-REDUCTION.md §B item 2` and `PLAN-MINIMUM.md §B item 5` strengthened to the one-file cap.
6. **Path scoping is a job's input, not its escape hatch.** A `paths:` filter that skips a job is acceptable only when `PLAN.md §B.4`'s "Where it runs" column already scopes it. This binds `COST-REDUCTION.md §B item 4` and `PLAN-MINIMUM.md §B item 6`.
7. **B-brains observe; they never wake on a PR event.** Every B-brain steward (`PLAN.md §C Stage 5, S5-D2`) is a job in `agent.yml` whose `if:` requires `needs.setup.outputs.mode == 'observe'`. The `observe` mode is computed only from `schedule:` and `workflow_dispatch:` triggers, never from `pull_request*`. This is `COST-REDUCTION.md §C P6` and `PLAN-MINIMUM.md §B item 1` applied to the dispatcher: B-brains are unreachable from PR-driven triggers by construction. The `agent.yml` file in this plan must keep a documented `cron` schedule alongside its PR triggers, and the activation-steward's report (per `COST-REDUCTION.md §D`) tracks the actual launch count contribution of each mode.
8. **`settle` is exempted from cancel-in-progress.** Per `COST-REDUCTION.md §C P4`'s constraint, settlement-closing runs that write to `main` (ledger entries from Stage 7 onward in particular) must not be cancellable. The mode-derived `concurrency.cancel-in-progress` expression in §C.4 evaluates `false` whenever `mode == 'settle'`, regardless of trigger.
9. **The single-workflow shape is the only shape.** Unlike `PLAN-MINIMUM.md §B item 9` which preserves a path back to one file, this plan preserves *no path forward to two files* without an explicit governance settlement that supersedes this document. The reversibility property `PLAN.md §A item 10` requires is satisfied within one file: any cost cut or job addition is reversible by a single subsequent PR that edits `agent.yml`.
10. **Documentation lands with every job addition.** Each PR that adds a job to `agent.yml` updates the §C job inventory and the §D mapping table in this document in the same change. The drift `PLAN.md §A item 6` warns against takes a new specific form here: the *§C inventory* and the *jobs in the file* must agree, because no file system structure exists to reflect divergence.
11. **The economic envelope binds the job graph.** While `governance/maturity.yaml: economic_layer_enabled` is `false` (`PLAN.md §A item 8`), no job in `agent.yml` may call out to a paid third-party service to offload work, and the `setup` job must refuse to compute any mode that would dispatch such a call. This is `COST-REDUCTION.md §B item 8` applied at the dispatcher rather than at the file boundary.

---

## §C. Anatomy of `agent.yml`

`agent.yml` is one file containing one workflow. The workflow declares all PR, push, schedule, dispatch, and merge-queue triggers that `PLAN.md §B.3`'s ten workflows would, individually, declare. Its job graph is rooted at a single `setup` job and fans out into mode-gated job pools.

### C.1 The `setup` dispatcher job

`setup` runs on every trigger and produces three outputs:

- **`mode`** ∈ {`think`, `act`, `observe`, `delegate`, `settle`}. Computed from the event:
  - `pull_request*` (non-draft, non-bot per `COST-REDUCTION.md §C P8`), `merge_group` → `think`.
  - `issues`, `issue_comment` (matching the wrapper's response criteria from `PLAN.md §C Stage 1, S1-D8`), `push` to a non-`main` branch → `act`.
  - `schedule`, `workflow_dispatch` from a B-brain or ecology label → `observe`.
  - `workflow_dispatch` with a `delegate:` label payload (see `PLAN.md §C Stage 3, S3-D4` and `COST-REDUCTION.md §C P7`) → `delegate`.
  - `push` to `main` of a settlement-merging commit, `workflow_dispatch` with a `settle:` label, scheduled tail-completion (per `COST-REDUCTION.md §C P13` constraint) → `settle`.
- **`event-class`** — a finer-grained tag (`pr-open`, `pr-sync`, `pr-merge-queue`, `comment-issue`, `cron-hourly`, `cron-daily`, `dispatch-delegate`, `dispatch-settle`, `tail-completion`, …) used by individual jobs' `if:` gates to scope themselves further.
- **`settlement-id`** — the active settlement identifier if one is in scope (read from the PR branch name, the dispatch payload, or `workspace/active-settlements/`), or empty.

`setup`'s implementation is a single composite action (`COST-REDUCTION.md §C P10`) under `.github-society-intelligence/lifecycle/society/setup-society/`. Every other job in `agent.yml` declares `needs: setup` and an `if:` gating on `needs.setup.outputs.mode == '<mode>'` (and optionally `event-class` and `settlement-id`).

### C.2 The job pools

Jobs in `agent.yml` are organised by their mode prefix. The prefix is part of the job name (and therefore part of the Branch Protection check name where applicable). The pools are:

- **`think.*`** — read-mostly evaluation jobs. Includes every `C-*` censor that runs on PR events (the majority of `PLAN.md §B.4`), the cognitive-loop deliberation steps (`perceive`, `activate`, `critique`, `censor-aggregate`, `consolidate-wait` from `PLAN.md §C Stage 4`), and the layout-lint advisory check from Stage 1. May read all of `.github-society-intelligence/`. May write only to `state/observability/`, `state/ecology-reports/`, `workspace/active-settlements/<id>/think-*`.
- **`act.*`** — state-changing jobs that respond to events without closing a settlement. Includes the conversational-bee `respond` invocation (`PLAN.md §C Stage 1, S1-D8`), agency handler runs that produce a PR rather than merge one, and the small censor subset that must run during these state-changing emissions (e.g. `act.censor.cloud-egress` for outbound calls from a handler). May open PRs, write to `workspace/active-settlements/`, and commit to a feature branch; **never** writes to `main`.
- **`observe.*`** — scheduled-only jobs. Includes the seven B-brain stewards (`PLAN.md §C Stage 5, S5-D2`), the observability emission job, and the ecology-report publishing job. Reads metadata only; the `observe.censor.b-brain-content-access` job (`C-BCA`) is itself in this pool and is the meta-check that guards the pool. Writes are restricted to `state/observability/`, `state/ecology-reports/`, and B-brain-opened settlement PRs (which then re-enter the graph through `think.*` on the next trigger).
- **`delegate.*`** — single-job-per-hop inter-agency delegation, capped by `C-DEP` at the stage's documented `delegation_depth` (1 at Stage 3, per `PLAN.md §C Stage 3, S3-D5`; raised by explicit governance settlement only). Carries the payload hash + contract SHA shape `PLAN.md §C Stage 3, S3-D4` requires, preserving the path to a future `repository_dispatch` promotion at Stage 10 without changing this file.
- **`settle.*`** — settlement-closing jobs that may write to `main`. Includes ledger writes (Stage 7), settlement merges (Stage 4 onward), and the dispute-window orchestration (Stage 7). Exempted from cancel-in-progress per §B item 8. The censors that must run on settlement closure (`C-AUTH`, `C-CA`, `C-SCL`, `C-PAY` on ledger entries, `C-BRP` on bridged settlements) live here, not in `think.*`, because they execute against the post-merge state.

### C.3 Which censors run in which pool

`PLAN.md §B.4`'s "Where it runs" column maps to pools as follows. The mapping is the canonical reading of that column under the one-file invariant.

| Censor | Pool | Justification |
| --- | --- | --- |
| `censor/credential` (C-CRED) | `think.*` | Every PR. |
| `censor/pii` (C-PII) | `think.*` | Every PR. |
| `censor/commit-signature` (C-SIG) | `think.*` | Every PR. |
| `censor/representation-class` (C-RC) | `think.*` | PRs adding memory artifacts. |
| `censor/append-only` (C-AO) | `think.*` (PR scope) + `settle.*` (post-merge ledger scope, Stage 7) | Append-only invariants are checked before merge and re-verified at settlement closure. |
| `censor/cross-directory-write` (C-CDW) | `think.*` | PRs crossing insulation boundaries. |
| `censor/cloud-egress` (C-EGR) | `think.*` (PR scope) + `act.*` (runtime scope) | PRs that *configure* egress run the think variant; handlers that *perform* egress run the act variant. |
| `censor/input-rights` (C-INR) | `act.*` | Provider agency intake handlers. |
| `censor/payment` (C-PAY) | `settle.*` | Ledger entries are settlement-closing. |
| `censor/delegation-depth` (C-DEP) | `delegate.*` | Each hop counts; the censor runs in the hop's own pool. |
| `censor/bridge-probation` (C-BRP) | `settle.*` | Settlement PRs naming a bridge. |
| `censor/reputation-floor` (C-REP) | `delegate.*` | Outbound channel calls. |
| `censor/memory-class-import` (C-MCI) | `act.*` (PR-opening import handler) + `think.*` (post-open PR review) | Imports both open and review a PR; both surfaces are guarded. |
| `censor/settlement-closure` (C-SCL) | `settle.*` | Lead settlement PRs in multi-PR settlements. |
| `censor/silent-retry` (C-SR) | `settle.*` | Retry settlements. |
| `censor/authority` (C-AUTH) | `settle.*` | Every settlement PR. |
| `censor/credit-assignment` (C-CA) | `settle.*` | Every settlement PR. |
| `censor/consolidation-window` (C-CW) | `think.*` (wait-step) + `settle.*` (final check) | The wait runs in `think.*`; closure verification runs in `settle.*`. |
| `censor/b-brain-content-access` (C-BCA) | `observe.*` | PRs from `agencies/b-brains/**`. |

This table is the single authoritative mapping; §D below is its inversion (per `PLAN.md §B.3` workflow → owning jobs).

### C.4 Concurrency, triggers, and run economy

The single workflow's `concurrency:` block is mode-derived:

- `group:` includes `${{ needs.setup.outputs.mode }}` and, for PR modes, `${{ github.ref }}`; for delegate mode, the channel and hop number; for settle mode, the settlement id.
- `cancel-in-progress:` is `true` only when `mode == 'think'` (per `COST-REDUCTION.md §C P4`). It is `false` for `act`, `delegate`, `settle`, and `observe`. `settle` is the load-bearing exemption (§B item 8).

The triggers section enumerates every event listed in `PLAN.md §B.3`'s ten workflows. The `setup` job's job-level `if:` filters out the early-disqualification cases (`COST-REDUCTION.md §C P8`: draft PRs, bot pushes, label-only edits other than the stage-label `opened` event). Per-job `paths:` and `if:` filters apply `COST-REDUCTION.md §C P3` exactly as in the multi-file shape; the file boundary is replaced by the job boundary but the scoping rules are identical.

The expected launch envelope (§E below) is **one workflow run per PR event** for the PR-driven modes and **one workflow run per scheduled tick** for `observe`. Mode-gated `if:` evaluation skips entire job pools for free; a `pull_request` trigger that resolves to `think` does not consume `act`/`delegate`/`settle`/`observe` jobs even though they are defined in the same file.

### C.5 The composite-action layer

Per `COST-REDUCTION.md §C P10`, shared steps live under `.github/actions/`:

- `setup-society/` — the `setup` dispatcher composite.
- `censor-<name>/` — one composite per censor, called by the censor's job in `think.*`, `act.*`, `delegate.*`, or `settle.*` as the §C.3 mapping dictates.
- `cognitive-step-<name>/` — one composite per cognitive-loop step (`perceive`, `activate`, `critique`, `censor-aggregate`, `consolidate-wait`, `consolidate-resume`).
- `b-brain-<name>-steward/` — one composite per B-brain steward.
- `delegate-hop/` — one composite consumed by every `delegate.*` job; the hop number is a parameter, not a separate composite.
- `settle-<phase>/` — composites for settlement closure phases (`schema-check`, `credit-assignment-emit`, `ledger-append`, `dispute-window-open`, `reputation-update`).

Composite actions are not workflows and do not contribute to the file count. They are the primary unit of reuse and the mechanism by which jobs share the long preamble that `agent.yml` would otherwise repeat per job. The `setup` composite's correctness is itself guarded by `think.censor.dispatcher-integrity` — a single-only scaffold check that fails any PR editing `setup-society/` without an accompanying update to a fixture under `governance/dispatcher-fixtures/`. This scaffold is necessary because in the multi-file shapes of `PLAN-MINIMUM.md` and `COST-REDUCTION.md` the trigger-to-workflow mapping is enforced by the file system; in the one-file shape it is enforced by `setup`, which must be tested.

---

## §D. Mapping to `PLAN.md §B.3` workflows and `§B.4` censors

This is the inversion of §C.3, and the per-workflow companion to it. Each row of `PLAN.md §B.3` and each row of `PLAN.md §B.4` is named, and the job (or composite-action chain) in `agent.yml` that owns it is identified.

### D.1 `PLAN.md §B.3` workflows → `agent.yml` jobs

| ID | `PLAN.md` workflow | `agent.yml` owner | Notes |
| --- | --- | --- | --- |
| W-AG  | `github-society-intelligence-agent.yml` | `agent.yml` itself; the file is *renamed* `agent.yml` at the Stage 1 cutover PR — this is a `git mv`, preserving history, per `PLAN.md §A item 5` ("move, never rewrite"). Alternatively, governance may elect to keep the existing filename across all stages; the choice is documented in `governance/` and not re-litigated. |
| W-PRC | `perceive.yml`        | `think.cognition.perceive` job, composed of `cognitive-step-perceive/` | `PLAN.md §C Stage 4, S4-D1`. |
| W-ACT | `activate.yml`        | `think.cognition.activate` job (`needs: think.cognition.perceive`) | `PLAN.md §C Stage 4, S4-D2`. |
| W-CRT | `critique.yml`        | `think.cognition.critique` job (`needs: think.cognition.activate`) | `PLAN.md §C Stage 4`. |
| W-CEN | `censor.yml`          | `think.cognition.censor-aggregate` job, which `needs:` all individual `think.censor.*` jobs | The aggregating censor surface is realised as a job that fans in. |
| W-STL | `settle.yml`          | `settle.close` job, with `needs:` covering `settle.censor.*` and the credit-assignment composite | `PLAN.md §C Stage 4, §C Stage 7`. |
| W-CON | `consolidate.yml`     | `think.cognition.consolidate-wait` (long-run wait, `COST-REDUCTION.md §C P13`) + `settle.consolidate-finalise` (closure verification) | The two-pool split mirrors §C.3's split of `C-CW`. |
| W-OBS | `observe.yml`         | `observe.emit` job + the seven `observe.b-brain.*-steward` jobs | All scheduled-only. |
| W-DLG | `delegate.yml`        | `delegate.hop-<n>` jobs, one per hop, capped by `C-DEP` | Single in-repo workflow run per hop chain, per `COST-REDUCTION.md §C P7`. |
| W-IMP | `import-memory.yml`   | `act.import.open-pr` (opens the import PR) + `think.import.review` (runs C-MCI on it) | The two-pool split mirrors §C.3's split of `C-MCI`. |

### D.2 `PLAN.md §B.4` censors → `agent.yml` jobs

| ID | Check name | Owning job(s) in `agent.yml` |
| --- | --- | --- |
| C-CRED | `censor/credential`            | `think.censor.credential` |
| C-PII  | `censor/pii`                   | `think.censor.pii` |
| C-AUTH | `censor/authority`             | `settle.censor.authority` |
| C-RC   | `censor/representation-class`  | `think.censor.representation-class` |
| C-AO   | `censor/append-only`           | `think.censor.append-only` + `settle.censor.append-only-ledger` |
| C-CDW  | `censor/cross-directory-write` | `think.censor.cross-directory-write` |
| C-EGR  | `censor/cloud-egress`          | `think.censor.cloud-egress` + `act.censor.cloud-egress-runtime` |
| C-INR  | `censor/input-rights`          | `act.censor.input-rights` |
| C-PAY  | `censor/payment`               | `settle.censor.payment` |
| C-DEP  | `censor/delegation-depth`      | `delegate.censor.delegation-depth` (runs once per hop) |
| C-BRP  | `censor/bridge-probation`      | `settle.censor.bridge-probation` |
| C-REP  | `censor/reputation-floor`      | `delegate.censor.reputation-floor` |
| C-MCI  | `censor/memory-class-import`   | `think.censor.memory-class-import` (review-time) + `act.censor.memory-class-import-open` (open-time guard) |
| C-SCL  | `censor/settlement-closure`    | `settle.censor.settlement-closure` |
| C-SR   | `censor/silent-retry`          | `settle.censor.silent-retry` |
| C-SIG  | `censor/commit-signature`      | `think.censor.commit-signature` |
| C-CA   | `censor/credit-assignment`     | `settle.censor.credit-assignment` |
| C-CW   | `censor/consolidation-window`  | `think.cognition.consolidate-wait` + `settle.consolidate-finalise` (the check name is emitted by the closure job) |
| C-BCA  | `censor/b-brain-content-access` | `observe.censor.b-brain-content-access` |

Three single-only scaffold checks beyond `PLAN.md §B.4` are required by this plan and are listed here so that the §B item 10 documentation discipline is honoured:

| ID | Check name | Owning job(s) | Justification |
| --- | --- | --- | --- |
| C-DI  | `censor/dispatcher-integrity` | `think.censor.dispatcher-integrity` | Guards `setup` (§C.5); single-only scaffold because in the multi-file shapes the trigger→workflow mapping is enforced by the file system. |
| C-MG  | `censor/mode-gating` | `think.censor.mode-gating` | Fails any PR adding a job that lacks an `if:` gate on `needs.setup.outputs.mode`, per §B item 4. Single-only because in the multi-file shapes mode gating is implicit in the file. |
| C-JN  | `censor/job-naming` | `think.censor.job-naming` | Fails any PR adding a job whose name does not begin with a §C.2 pool prefix, per §B item 1. Single-only because in the multi-file shapes the pool is implicit in the filename. |

These three are the minimum integrity layer the one-file shape requires; without them, the discipline §B installs is invisible to mechanical enforcement. They are required checks on every PR; they are not gated by stage and are introduced at Stage 1 alongside the rename.

---

## §E. Stage-by-stage application

For each `PLAN.md §C` stage, this table records: what new jobs land in `agent.yml`, the expected launch count per representative PR, and the section of `PLAN-MINIMUM.md §E` whose target this plan inherits or tightens.

| Stage | Jobs added to `agent.yml` | Runs / PR (target) | Notes |
| --- | --- | --- | --- |
| 0 (baseline) | — (the file already exists as `github-society-intelligence-agent.yml` with one job) | 2 | `gsi-public-fabric.yml` counted separately (§F.4). |
| 1 (skeleton) | `setup` dispatcher; the conversational-bee `act.conversational-bee.respond` job (refactor of today's single job); layout-lint `think.layout-lint`; `think.censor.dispatcher-integrity`, `think.censor.mode-gating`, `think.censor.job-naming` (the three single-only scaffolds from §D); a `git mv` to `agent.yml` if governance elects the rename | 2 | The cap stays 1 PLAN-derived file. Three new single-only scaffolds land. |
| 2 (censors) | `think.censor.{commit-signature,credential,pii,representation-class,append-only,cross-directory-write,authority}`, `enforcement_mode` flag per `COST-REDUCTION.md §C P5` | 1 (think) | All seven Stage 2 censors are added as `think.*` jobs in the same file; no new file. |
| 3 (second agency) | `delegate.hop-1` job, `delegate.censor.delegation-depth` (capped at 1 per `PLAN.md §C Stage 3, S3-D5`); `think.censor.cloud-egress`, `act.censor.input-rights`, `settle.censor.credit-assignment`; the second agency `critic-bee` is a directory under `agencies/`, not a workflow | 1 (think) on review PRs, 1 (delegate) on dispatch | Second agency does not require a new file. |
| 4 (cognitive loop) | `think.cognition.{perceive,activate,critique,censor-aggregate,consolidate-wait}` chained by `needs:`; `settle.consolidate-finalise`; `think.censor.consolidation-window` emits the C-CW check name from the consolidate-wait job | 1 (think) | The six W-* workflows of `PLAN.md §B.3` Stage 4 are six new jobs in `agent.yml`. P13's in-run wait keeps the consolidation window inside a single run for windows ≤ 7 h. |
| 5 (B-brains) | Seven `observe.b-brain.<name>-steward` jobs (`activation`, `memory`, `channel`, `bridge`, `economic`, `governance-drift`, `self-model`); `observe.censor.b-brain-content-access` (C-BCA); `observe.emit` for the observability signals; `observe.ecology-report` published on a scheduled tick | 1 (think) on PRs + 1 (observe) per scheduled tick | B-brains never wake on a PR event (§B item 7). `cron` schedule lands in `agent.yml`'s triggers block in the same PR. |
| 6 (bridges) | `settle.censor.bridge-probation` (C-BRP); layout-lint sub-check on `representation_class: translation_record` outside `agencies/bridges/**` (a sub-job under `think.censor.representation-class` or its own `think.censor.translation-record-locality` job — the choice is local) | 1 (think) | Bridges are directories, not workflows. |
| 7 (ledger) | `settle.censor.payment` (C-PAY), `delegate.censor.reputation-floor` (C-REP), `settle.censor.silent-retry` (C-SR); `settle.censor.append-only-ledger` (the ledger-scoped refinement of C-AO from `PLAN.md §C Stage 7, S7-D4`); a `settle.dispute-window-open` job and a scheduled `settle.dispute-window-resolve` job orchestrating the 30-day window per `PLAN.md §C Stage 7, S7-D6`; `settle` mode is exempted from cancel-in-progress per §B item 8 | 1 (think) on PRs + 1 (settle) on ledger-writing merges | Ledger writes land in `settle.*` in the same file. |
| 8 (differentiation) | The Stage-8 bootstrap variants reuse every existing job; the variant id is a parameter passed through `setup`'s output. No new jobs are introduced (except optionally a `act.bootstrap.<variant>-respond` parameterisation, which is a job rename rather than an addition) | 1 (think) + 1 (act) per variant | Differentiation is an `agencies/` directory mechanism. |
| 9 (Level 5) | `settle.dry-run-promotion` job that opens but does not merge the demonstration PR for `PLAN.md §C Stage 9, S9-D3`; `governance/maturity.yaml` declaration is a `settlements/` artifact, not a workflow change | 1 (think) | The dry-run promotion is a single-PR settlement that closes without merge. |

The "Runs / PR" column is the property this plan undertakes to hold. It is strictly less than or equal to `PLAN-MINIMUM.md §E`'s target column at every stage, because `PLAN-MINIMUM.md` keeps two operational files and this plan keeps one. The activation-steward B-brain's scheduled report (per `COST-REDUCTION.md §D` and `PLAN-MINIMUM.md §E`) extends to cover the one-workflow target, tracking the *mode distribution* of launches as a first-class signal (a sustained skew toward one mode is the §B item 1 invariant becoming a useful diagnostic, not a complaint).

---

## §F. Risk, anti-patterns, out of scope, open questions

### F.1 Anti-patterns to refuse

These would honour the file cap but violate `PLAN.md`, `COST-REDUCTION.md`, or `PLAN-MINIMUM.md`. They must not be adopted.

| Anti-pattern | Why refused |
| --- | --- |
| Adding a `think.yml` or `act.yml` "for clarity" while keeping `agent.yml` | Violates §A.1; the cap is on PLAN-derived files, and any second file requires a governance settlement that supersedes this plan (§B item 9). |
| Replacing the `setup` job with per-job event sniffing | Violates §B item 4; without a single dispatcher, the mode-gating discipline is unauditable and `C-DI` cannot guard it. |
| Defining a censor as a step inside another censor's job to "save a job" | Violates §B item 3 ("consolidation, never collapse") and `COST-REDUCTION.md §B item 3`; per-check auditability is lost. |
| Calling a reusable workflow from `agent.yml` to factor out a sub-graph | Reusable workflow files count toward the cap (§A.1); use composite actions under `.github/actions/` instead (§C.5). |
| Letting B-brains wake on `pull_request` to avoid the schedule | Violates §B item 7 and `COST-REDUCTION.md §C P6`; `setup` must not emit `mode == 'observe'` on PR triggers. |
| Removing `cancel-in-progress` exemption from `settle` mode to make the concurrency block uniform | Violates §B item 8 and `COST-REDUCTION.md §C P4` constraint; ledger half-writes are irreversible. |
| Renaming `setup`'s mode outputs to obscure the §C.2 vocabulary | Defeats §B item 1's naming discipline and the §D mapping tables; the mode names are part of this document's contract. |
| Treating `gsi-public-fabric.yml` as a PLAN-derived file to argue for two | The public-fabric workflow is out of scope (§F.4); merging it into `agent.yml` is *also* out of scope unless its owners agree, which is not a PLAN-derived settlement. |
| Adding a third single-only scaffold check beyond C-DI, C-MG, C-JN without amending this document | The three scaffolds of §D are the *minimum* integrity layer this plan asserts; extending them is a settlement, not a discretionary PR. |
| Skipping the `setup` job on a "trivial" trigger to save its handful of seconds | The §B item 4 invariant is unconditional; a job that runs without `setup` cannot be mode-gated and therefore cannot be reasoned about. |

### F.2 Top risks this plan does not fully mitigate

| Risk | Residual mitigation |
| --- | --- |
| The `setup` job becomes a fragile chokepoint as modes proliferate | C-DI's fixture suite is the primary defence; governance must commission a fixture for every new event type before the corresponding `mode` clause lands. |
| Per-job overhead inside one file approaches the 8-hour per-run cap at high stages | `COST-REDUCTION.md §C P10`'s composite-action factoring is mandatory here (§C.5); P13's wait-checkpoint mechanism preserves the ability to split very long settlements across runs without splitting the file. |
| Branch Protection management of N required checks emitted by N jobs in one file is harder to administer than the same N checks across N files | Required checks are addressed by name, not file; administration is identical. The administrative *legibility* burden is the trade-off the one-file shape makes consciously, and the §D mapping tables exist to mitigate it. |
| A `workflow_run`-style cascade from `act` to `settle` requires the cascade to live in the same file | This plan permits intra-file `needs:`-chained cascades; `workflow_run` from `agent.yml` to itself is permitted but discouraged (prefer Branch Protection + a fresh PR), per the §B item 9 reading of `PLAN-MINIMUM.md §B item 4`. |
| Concurrency-group collisions across modes on the same `ref` | The mode-derived group of §C.4 prevents collision between modes; collisions *within* a mode are handled by `cancel-in-progress` (think) or queueing (act, delegate, settle, observe). |
| A regression in `setup` cascades to every job in the file | C-DI's fixture suite plus `C-MG`'s static gate ensure every job is mode-gated and the dispatcher is verifiable; the rollback for a bad `setup` change is a single PR reverting the composite action under `.github-society-intelligence/lifecycle/society/setup-society/`. |
| Public-fabric workflow's owners refuse consolidation, forcing the PLAN-derived cap to stay at one indefinitely | This is the *expected* steady state; no mitigation is required. The cap is a feature. |

### F.3 Reversibility summary

Every job addition in §E carries an implicit rollback: a single subsequent PR removing the job. Every composite-action addition in §C.5 carries the same property. The aggregate property this document preserves is: **no change taken under this plan requires more than one subsequent PR to undo, and no change ever introduces a second `.github/workflows/*.yml` file.** This binds `PLAN.md §A item 10`, `COST-REDUCTION.md §E.3`, and `PLAN-MINIMUM.md §B item 9` simultaneously, with the further property that the file-count axis is *not* a reversibility surface — it is held at one by construction.

### F.4 Explicitly out of scope

This document does **not** cover:

- the launch profile or cost behaviour of `gsi-public-fabric.yml`; consolidating it into `agent.yml` is a separate settlement, owned by the public-fabric maintainers, not by this plan;
- runner sizing, caching strategy, build-step trimming, or any other *minutes-reduction* concern that does not change the *number of workflow files*;
- federation primitives (`repository_dispatch`, cross-org credentials, the federation governance repo) — `PLAN.md §C Stage 10` is out of scope, so the cross-repository launch behaviour it would introduce is too;
- migrating any historical conversation memory in `state/` into the new `memory/episodic/` layout — handled per `PLAN.md §D.3`;
- the rename of `github-society-intelligence-agent.yml` → `agent.yml` is *optional* under §E Stage 1 and is itself a one-PR governance settlement; this document does not mandate the rename, only that whichever name is chosen, it is the *only* PLAN-derived file.

### F.5 Open questions for the first governance settlement

These questions are not answered by `PLAN.md`, `COST-REDUCTION.md`, or `PLAN-MINIMUM.md` and must be resolved by an explicit governance settlement before §E Stage 1 begins:

1. Does governance elect to rename `github-society-intelligence-agent.yml` to `agent.yml` at Stage 1, or retain the existing filename across all stages? (Either choice is permitted; the rename is a `git mv` per §D.1 W-AG.)
2. What is the exact `cron:` schedule for `observe` mode at Stage 5? (`COST-REDUCTION.md §E.5 question 2` is inherited; daily in steady state is the strong default.)
3. What is the fixture-suite scope for `censor/dispatcher-integrity` (C-DI)? Every trigger? Every (trigger × event-class) pair? Every (trigger × event-class × mode) triple? (The first is too weak; the third is closer to right but more expensive.)
4. At which stage does the activation-steward's scheduled report begin to emit mode-distribution telemetry, and what is the threshold above which a sustained mode skew triggers a governance review? (Stage 5 is the earliest possible; the threshold is a governance call.)
5. If the public-fabric workflow's maintainers ever agree to consolidation, does that consolidation enter `agent.yml` as a new mode (`mode == 'fabric'`) or as a parallel job pool with no mode gating? (The first preserves §B item 4; the second is simpler. This plan recommends the first.)

Each of these is a one-PR settlement in `governance/`, opened before the §E stage that depends on it.

---

## §G. Closing

The single-repository Society of Mind, taken to the fixed point of its workflow-count discipline, is **one file**. `PLAN.md §B.3`'s ten workflows, `PLAN.md §B.4`'s eighteen censors, `COST-REDUCTION.md §C`'s thirteen patterns, and `PLAN-MINIMUM.md §C`'s two-pool split are all reproducible inside a single `agent.yml` whose `setup` job dispatches to mode-gated job pools. Every required check remains required, every stage remains in order, every rollback remains one PR away, and the file system reflects exactly what is true: one agent, many minds.

`PLAN.md` is the *what*. `COST-REDUCTION.md` is the *how cheaply*. `PLAN-MINIMUM.md` is the *how few files*. This document is the limit of that sequence: *how few files, taken to one*, with the same discipline `ANALYSIS.md §3` and `§5` require of the cognitive loop applied to the workflow file the loop runs in.

---

*Source material: [`PLAN.md`](./PLAN.md), [`COST-REDUCTION.md`](./COST-REDUCTION.md), [`PLAN-MINIMUM.md`](./PLAN-MINIMUM.md), [`ANALYSIS.md`](./ANALYSIS.md). All run-count estimates are upper bounds on a representative settlement PR; the activation-steward's scheduled report is the authoritative source for actuals.*
