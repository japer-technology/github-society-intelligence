# COST-REDUCTION — Reducing the number of GitHub Actions launched by [`PLAN.md`](./PLAN.md)

### A discipline for keeping the staged rollout of [`ANALYSIS.md`](./ANALYSIS.md) inside a sustainable Actions-minutes envelope — without weakening any reflective check the plan installs.

> This document is derivative. Its only job is to take the artifact inventory of [`PLAN.md §B`](./PLAN.md) and the stage sequencing of [`PLAN.md §C`](./PLAN.md) and answer one narrow question: *how do we install all of it while launching the fewest possible GitHub Actions runs?* Every recommendation below is justified against a specific stage or deliverable in `PLAN.md`; nothing here weakens a censor, removes a required check, or reorders a stage. Where this document adds a constraint `PLAN.md` does not name, it is flagged as a *cost-only scaffold* and justified.

The document is organised in four layers, in order of decreasing abstraction:

1. **§A — The cost surface.** What "a GitHub Action launched" actually means under `PLAN.md`, and where the launches multiply.
2. **§B — Operating principles for cost reduction.** Rules the implementer follows so that minimising runs does not violate the constitution the runs are meant to protect.
3. **§C — The reduction patterns.** Concrete, named patterns (P1…P12), each citing the `PLAN.md` items it applies to.
4. **§D — Stage-by-stage application.** For each of `PLAN.md §C`'s ten stages, the patterns that apply and the expected delta in launched runs per PR.

A short closing section (§E) covers risk, anti-patterns to avoid, and items explicitly out of scope.

---

## §A. The cost surface

Today the repository ships two workflow files (`github-society-intelligence-agent.yml`, `gsi-public-fabric.yml`). A normal contributor PR launches **at most two** workflow runs.

`PLAN.md §B.3` lists ten workflow files in steady state; `PLAN.md §B.4` lists eighteen required status checks (`C-*`), three of which (`C-CA`, `C-CW`, `C-BCA`) are plan-only scaffolds. The naïve mapping — *one workflow file per check, one workflow run per PR event* — produces the following worst case per PR after `PLAN.md §C Stage 9` closes:

| Source | Launches per PR event | Justification |
| --- | --- | --- |
| Censor required checks (`PLAN.md §B.4`) | up to 18 | one workflow per check |
| Cognitive-loop workflows (W-PRC, W-ACT, W-CRT, W-CEN, W-STL, W-CON) on a settlement PR | up to 6 | `PLAN.md §B.3, §C Stage 4` |
| Channel transport (W-DLG) per hop | 1 per hop | `PLAN.md §C Stage 3, S3-D4` |
| Observability (W-OBS) and import (W-IMP) when triggered | 1 each | `PLAN.md §B.3` |
| Layout-lint + wrapper (W-AG) | 1–2 | `PLAN.md §C Stage 1, S1-D8` |

That is **≈ 25–30 runs per PR** before any retry, plus a per-event multiplier for `synchronize`, `comment`, `review`, and `workflow_run` cascades. On a high-traffic stage-4-or-later repository this is multiplicatively more expensive than today's runtime by **one full order of magnitude**, and that cost compounds at every cognitive-loop hop the society performs.

This document targets a steady-state worst case of **≤ 6 runs per PR** for the same artifact set, with no censor removed and no stage skipped.

The cost surface has four multiplicative axes; every pattern in §C attacks one or more of them:

1. **Workflow count.** How many separate `.github/workflows/*.yml` files are eligible to trigger.
2. **Trigger fan-out.** How many trigger events (`push`, `pull_request`, `issue_comment`, `workflow_run`, `workflow_dispatch`, `schedule`) wake those workflows.
3. **Event multiplier.** How many times a single logical change re-fires those triggers (PR `synchronize`, comment edits, label churn, cascade chains).
4. **Job multiplier.** How many runner VMs each workflow allocates (per-matrix-leg, per-OS, per-shard).

Reducing *minutes* is a separate concern (runner sizing, caching, build-step trimming). This document is exclusively about reducing *launches* — the count `PLAN.md` is most likely to make explode.

---

## §B. Operating principles for cost reduction

These principles bind the *implementer* (humans and the agent) when applying §C's patterns. They exist so that the cost discipline does not become a back door around the constitutional discipline `PLAN.md §A` establishes.

1. **No censor is weakened, deleted, or made advisory.** Every required check listed in `PLAN.md §B.4` must remain *required* on the artifacts it protects. Patterns in §C reduce the *number of workflow runs* the checks consume; they do not reduce the *set of conditions* checked. This is the cost-reduction analogue of `PLAN.md §A item 3`.
2. **No stage is reordered to save runs.** Sequencing in `PLAN.md §C` is load-bearing. If a pattern in §C would force a stage to begin before its predecessor's exit criteria are on `main`, that pattern is not applied at that stage. This binds `PLAN.md §A item 7` ("the Stage 0 runtime is never broken") to the cost work.
3. **Consolidation, never collapse.** Multiple checks may share one workflow file as separate *jobs* (each a distinct GitHub "check"), but two checks never share a single job. Distinguishability at the Branch Protection layer is preserved. This is the rule that lets §C P1 reduce workflow count without reducing check count.
4. **Path scoping is a censor's input, not its escape hatch.** A `paths:` filter that skips a censor is acceptable *only* when the censor's `PLAN.md §B.4` "Where it runs" column already scopes it (e.g. C-AO runs only on `memory/ledger/**` and other append-only subtrees). A `paths-ignore:` that broadens the skip beyond `PLAN.md`'s scoping is forbidden.
5. **Reversibility of every cost cut.** Every pattern in §C is reversible by a single subsequent PR — restoring the higher-launch behaviour without history rewrite, in the spirit of `PLAN.md §A item 10`. A cost cut that cannot be reversed is rejected.
6. **B-brains observe; they do not idle a runner.** B-brain workflows (Stage 5) must be scheduled, never event-driven by default. A b-brain that wakes on every PR launches a runner whose only job is to read metadata — this is wasteful by `PLAN.md §A item 9`'s own argument that B-brains never merge.
7. **Documentation lands with the cost change.** Each application of a §C pattern updates this document's §D table for the affected stage in the same PR, mirroring `PLAN.md §A item 6`. Drift between this document and the launch count is itself a failure mode the activation-steward B-brain will report.
8. **The economic envelope binds cost reduction too.** While `governance/maturity.yaml: economic_layer_enabled` is `false` (`PLAN.md §A item 8`), no pattern below may reach out to a paid third-party service to offload work. All consolidation stays inside GitHub Actions or the agent runtime.

---

## §C. The reduction patterns

Each pattern is identified (P-n), states what it does, names the cost axis it attacks from §A, lists the `PLAN.md` items it applies to, and gives the rollback. Patterns are independent; any subset is applicable.

### P1 — Consolidate the censor surface into one `censors.yml` workflow with one job per check.

- **What.** Replace the implied "one workflow per `C-*` check" with a single workflow file under `.github/workflows/censors.yml`. Each check is one **job**, named so it appears as a distinct status (e.g. `censor/credential`, `censor/pii`, …). Branch Protection still selects each job by name as a required check.
- **Cost axes.** (1) workflow count: from up to 18 files down to 1. (2) job multiplier: jobs share the workflow's checkout and setup steps; per-job overhead remains, but workflow-level overhead collapses.
- **Applies to.** All of `PLAN.md §B.4` (`C-CRED, C-PII, C-AUTH, C-RC, C-AO, C-CDW, C-EGR, C-INR, C-PAY, C-DEP, C-BRP, C-REP, C-MCI, C-SCL, C-SR, C-SIG, C-CA, C-CW, C-BCA`).
- **Why this is safe.** `PLAN.md §B.4`'s "Where it runs" column is a *scoping* statement, not a *file-count* statement; the censor's identity is its check name, not its workflow file. `PLAN.md §A item 4` requires "a CODEOWNERS entry, a representative schema or example, and (where applicable) a required-check skeleton" per directory — none of which require a dedicated workflow file per check.
- **Constraint.** Each job's `if:` or `paths:` must precisely reproduce the "Where it runs" scoping, so that a censor that should not fire on a PR is *skipped* (status: skipped, which Branch Protection treats as success only if the check is marked optional for that path via a Rule). For checks that must always fire (C-CRED, C-PII, C-SIG), the job has no scoping and always runs.
- **Rollback.** Split the workflow back into per-check files; Branch Protection rules need no change because they reference job names.

### P2 — Use a single `cognition.yml` workflow with sequential `needs:` jobs for the cognitive loop.

- **What.** Replace the implied chain `W-PRC → W-ACT → W-CRT → W-CEN → W-STL → W-CON` (six workflow files cross-triggered by `workflow_run`) with one workflow `cognition.yml` containing six jobs linked by `needs:`. The settlement payload is passed between jobs via job outputs and the `workspace/active-settlements/<id>/` directory, exactly as the cross-workflow design would.
- **Cost axes.** (2) trigger fan-out: one trigger instead of six chained `workflow_run` triggers. (3) event multiplier: `workflow_run` cascades are eliminated.
- **Applies to.** `PLAN.md §B.3` workflows W-PRC, W-ACT, W-CRT, W-CEN, W-STL, W-CON; `PLAN.md §C Stage 4` deliverables S4-D1, S4-D2, S4-D3.
- **Why this is safe.** The cognitive loop is sequential by `ANALYSIS.md §5`; cross-workflow `workflow_run` chaining was never required by `PLAN.md`, only the *staging* of perception before activation, critique before censor, etc. Job-level `needs:` enforces the same ordering with a single runner pool reuse opportunity.
- **Constraint.** Each job still emits the same artifact under `state/observability/` that the separate workflow would, so W-OBS (or its consolidated successor under P6) can read them without caring that they came from one workflow.
- **Rollback.** Split the jobs back into per-stage workflow files chained by `workflow_run`. The state directories are the contract between them and need no change.

### P3 — Use path scoping (`paths:` / `paths-ignore:`) tied to each censor's `PLAN.md §B.4` row.

- **What.** Configure each censor job in `censors.yml` (P1) with a `paths:` filter matching the directories the censor protects: C-AO on `memory/ledger/**` and append-only subtrees, C-CDW on PRs that span insulation boundaries, C-MCI on `imports/**`, C-BRP on `settlements/**` that name a bridge, etc.
- **Cost axes.** (4) per-event job multiplier: a censor on a path it does not protect contributes zero runs.
- **Applies to.** Scoped censors in `PLAN.md §B.4`: C-AO, C-CDW, C-MCI, C-BRP, C-INR, C-PAY (PRs touching `memory/ledger/**`), C-CW (memory-promoting PRs), C-BCA (PRs from `agencies/b-brains/**`), C-SCL (lead settlement PRs only), C-SR (retry settlement PRs only). C-CRED, C-PII, C-SIG remain unscoped per `PLAN.md §B.4` ("every PR").
- **Why this is safe.** This pattern *encodes* `PLAN.md §B.4`'s "Where it runs" column into workflow configuration. It does not broaden any skip beyond the plan.
- **Constraint.** Branch Protection rulesets must mark each scoped censor as required *only for paths that match*, using GitHub's repository ruleset path conditions, so a skipped job does not block merge. This is a one-time setup deliverable per stage that introduces a scoped censor.
- **Rollback.** Remove the `paths:` filter; the job runs on every PR (returning trivially-pass on irrelevant PRs).

### P4 — Concurrency groups with `cancel-in-progress: true` on PR-event workflows.

- **What.** Add `concurrency: { group: '${{ github.workflow }}-${{ github.ref }}', cancel-in-progress: true }` to `censors.yml`, `cognition.yml`, and any other PR-triggered workflow. A `synchronize` event on a PR cancels the in-flight run for that PR and starts a fresh one.
- **Cost axes.** (3) event multiplier: rapid push-fixup cycles no longer accumulate parallel runs.
- **Applies to.** All workflows triggered on `pull_request`, `pull_request_target`, or `push` to a PR branch. Does **not** apply to W-STL when it runs on `main` (Stage 7 ledger merges must not be cancelled mid-flight).
- **Constraint.** Settlement-closing runs that *write to `main`* must be exempted from `cancel-in-progress` to avoid leaving the ledger in a partially-written state, per `PLAN.md §C Stage 7, S7-D4`.
- **Rollback.** Remove the `concurrency:` block. Concurrent runs return; nothing else changes.

### P5 — Replace the Stage 2 advisory-dry-run pattern with an in-workflow `enforcement_mode` flag.

- **What.** `PLAN.md §C Stage 2, S2-D5` rehearses each new required check in advisory mode for one PR, then flips it to enforced in the next PR — which doubles workflow runs across the rehearsal window. Replace with a single workflow that reads `governance/censors/<check>.yaml: enforcement_mode: advisory | enforced` and changes its exit code semantics accordingly. The rehearsal is a one-line settlement that toggles the mode; no separate workflow run is added.
- **Cost axes.** (1) workflow count during rehearsal; (3) event multiplier (no duplicated rehearsal runs).
- **Applies to.** Every censor enabled by Stages 2, 3, 4, 5, 6, 7 — in practice, the entire `C-*` set.
- **Why this is safe.** `PLAN.md §A item 3` requires the rehearsal, not a duplicate workflow. A configuration-driven enforcement flag is fully equivalent and remains auditable (the toggle is itself a PR).
- **Rollback.** Pin `enforcement_mode: enforced` for all checks and remove the field. Rehearsals revert to the dual-PR pattern.

### P6 — Single scheduled `observe.yml` for B-brains; never `pull_request` triggers.

- **What.** Run W-OBS (`PLAN.md §B.3`) only on `schedule:` (e.g. hourly during pilot, daily in steady state) and on explicit `workflow_dispatch`. All seven B-brain stewards (`PLAN.md §C Stage 5, S5-D2`) share this workflow as jobs. None of them attach to `pull_request`.
- **Cost axes.** (2) trigger fan-out (B-brains do not wake on every PR); (1) workflow count (one file for all stewards).
- **Applies to.** W-OBS, all `agencies/b-brains/*-steward/` handlers from `PLAN.md §C Stage 5`.
- **Why this is safe.** `PLAN.md §A item 9` ("B-brains observe, never merge") is *strengthened* by this pattern: a B-brain that cannot wake on a PR also cannot be tricked into participating in one.
- **Constraint.** The activation-steward (per `PLAN.md §C Stage 8, S8-D1`) must still be able to *open* a differentiation settlement; it does so by writing to `workspace/active-settlements/` on its scheduled run, which a subsequent PR-triggered run picks up. No event-driven B-brain wake is required.
- **Rollback.** Add `pull_request:` to W-OBS triggers; the cost reverts.

### P7 — In-repo `delegate.yml` as a single workflow with one job per hop, not one workflow run per hop.

- **What.** `PLAN.md §C Stage 3, S3-D4` defines W-DLG as a `workflow_dispatch`/`workflow_run` wrapper carrying payload hash + contract SHA, "identical in shape to a future `repository_dispatch`". For in-repo channels (the only kind until Stage 10), implement delegation as a *single workflow run* with one job per hop linked by `needs:`, capped by C-DEP at `delegation_depth: 1` (Stage 3) and at the plan's documented max thereafter. The wrapper *shape* (payload hash + contract SHA in job inputs) is preserved so that promotion to true `repository_dispatch` in Stage 10 is still move-not-rewrite.
- **Cost axes.** (3) event multiplier per hop.
- **Applies to.** W-DLG, all `agencies/<x>/channels/<y>.yaml` channel files.
- **Why this is safe.** `PLAN.md §C Stage 3, S3-D5` already caps `delegation_depth: 1` at Stage 3; the move to multi-hop is a later, explicit governance decision. Until then, the cross-workflow trigger is pure overhead.
- **Rollback.** Replace the multi-job workflow with `workflow_run` chaining. Channel files do not change.

### P8 — Filter out draft PRs, bot pushes, and label-only edits at trigger level.

- **What.** Add `if: github.event.pull_request.draft == false` and an `if:` excluding `github.actor == 'github-actions[bot]'` (for self-triggered settlement commits) to the cognition and censor workflows. Use `pull_request: types: [opened, synchronize, ready_for_review, reopened]` to drop `labeled`, `unlabeled`, `edited`.
- **Cost axes.** (3) event multiplier.
- **Applies to.** `cognition.yml` (P2), `censors.yml` (P1), W-AG wrapper (`PLAN.md §C Stage 1, S1-D8`).
- **Constraint.** Stage labels (`stage: 1`, `stage: 2`, …) added at PR open per `PLAN.md §A item 2` must be applied via the `opened` event so they participate in the initial trigger; later label edits should not re-fire workflows.
- **Rollback.** Remove the `if:` filters and re-enable label-type triggers.

### P9 — Merge-queue (`merge_group`) for heavy checks; PR runs limited to fast checks.

- **What.** Move the slowest required checks (e.g. C-CW which waits a consolidation window; C-PAY which inspects ledger snapshots; C-DEP for multi-hop settlements) to fire on `merge_group` only. PR-time runs cover the fast surface (C-CRED, C-PII, C-SIG, C-RC, C-CDW, C-AO on small diffs).
- **Cost axes.** (2) trigger fan-out (slow checks do not run on every PR push, only when the PR enters the merge queue).
- **Applies to.** Heavyweight censors at Stages 4, 7. Does **not** apply to C-AUTH, C-CRED, C-PII, C-SIG (must run pre-merge to surface errors early).
- **Constraint.** Adopting `merge_group` is itself a Branch Protection change; it is a one-time enablement settlement, not a per-stage repeat.
- **Rollback.** Re-add the heavy checks to `pull_request` triggers; remove from `merge_group`.

### P10 — Reusable workflow (`workflow_call`) for shared checkout-and-setup; composite actions for shared steps.

- **What.** Factor the common preamble of every censor job (`actions/checkout`, language setup, schema-tool install) into a composite action under `.github/actions/setup-society/`. Factor the common workflow envelope (concurrency, permissions, `paths`, `if:` filters) into a single reusable workflow `.github/workflows/_call-censor.yml` invoked by `censors.yml` jobs via `workflow_call`. Each call still counts as a job, but cache reuse and step deduplication shrink per-job overhead enough that one consolidated workflow stays under the per-workflow time cap.
- **Cost axes.** Reduces per-job *minutes*, not launches; included here because it makes P1's consolidation *feasible* at scale (without it, `censors.yml` risks hitting the 6-hour workflow limit at high stages).
- **Applies to.** All `C-*` jobs from `PLAN.md §B.4`.
- **Constraint.** `workflow_call` itself counts as a workflow run; for very small censors, an inline composite action is cheaper. Choose per-check.
- **Rollback.** Inline the composite back into each job.

### P11 — Settle once per PR; do not open a new PR for every cognitive sub-step.

- **What.** A settlement that touches multiple memory subtrees (recognition-index update + K-line addition + credit-assignment record + ledger entry) is committed as a *single PR* with multiple commits, not as a chain of dependent PRs. The cognitive loop (P2) handles the staging inside one workflow run; the settlement closes by merging that one PR.
- **Cost axes.** (3) event multiplier across PRs that would otherwise each trigger the full censor surface.
- **Applies to.** All settlement PRs from `PLAN.md §C Stage 3` onward; especially Stage 4 settlements that touch `memory/frames/`, `memory/klines/`, `memory/analogies/`, `memory/credit-assignment/` together.
- **Why this is safe.** `PLAN.md §A item 2` says "each PR carries the smallest viable change" and "a PR never spans more than one stage" — *stage* is the unit, not *file*. A settlement is the smallest viable cognitive change; splitting it artificially is not what the principle asks for.
- **Rollback.** Open per-subtree PRs. Cost reverts; correctness is unchanged.

### P12 — Skip-CI sentinel for documentation-only PRs.

- **What.** Honour `[skip ci]` in commit messages, and add a path filter that skips `cognition.yml` (P2) and most of `censors.yml` (P1) for PRs whose changes are confined to `**/*.md`, `docs/**`, and other documentation-only paths. C-CRED, C-PII, C-SIG still run.
- **Cost axes.** (4) per-event job multiplier.
- **Applies to.** Documentation-touching PRs at any stage, including the doc-update PRs `PLAN.md §A item 6` requires alongside every code PR.
- **Constraint.** A doc PR that *also* touches code is not documentation-only and runs the full surface. The detection is conservative: any non-doc path included → full surface.
- **Rollback.** Remove the skip filter; documentation PRs run the full cognitive loop.

---

## §D. Stage-by-stage application

For each `PLAN.md §C` stage, this table records: the patterns from §C that apply on entry to the stage, the naïve launch count per PR if no pattern is applied, and the target launch count under the patterns. "Per PR" here means one `opened` + one `synchronize` against a representative settlement PR for that stage.

| Stage | Naïve runs/PR | Patterns applied | Target runs/PR | Notes |
| --- | --- | --- | --- | --- |
| 0 (baseline) | 2 | — | 2 | Status quo; W-AG and gsi-public-fabric only. |
| 1 (skeleton) | 3 | P4, P8, P12 | 2–3 | Layout-lint is added as a job inside W-AG, not a new workflow. |
| 2 (censors) | 9 | P1, P3, P4, P5, P8, P10, P12 | 2–4 | All seven new censors land as jobs in `censors.yml`; P5 removes the dual-PR rehearsal. |
| 3 (second agency) | 13 | P1, P3, P4, P5, P7, P8, P10, P12 | 3–5 | W-DLG is one workflow with one job per hop; C-EGR/C-INR/C-DEP/C-CA are jobs in `censors.yml`. |
| 4 (cognitive loop) | 19 | P1, P2, P3, P4, P5, P7, P8, P9, P10, P11, P12 | 3–5 | P2 collapses the six cognitive-loop workflows into one; P9 moves C-CW to `merge_group`. |
| 5 (B-brains) | 20 | adds P6 | 3–5 (PR) + 1 (scheduled) | B-brains do not contribute to PR runs; one daily scheduled run covers all stewards. |
| 6 (bridges) | 22 | adds nothing new | 3–6 | C-BRP and the layout-lint sub-check are jobs in `censors.yml`. |
| 7 (ledger) | 25 | adds nothing new | 4–6 | Ledger merges to `main` are exempted from P4's cancel-in-progress (see P4 constraint). |
| 8 (differentiation) | 25 | adds nothing new | 4–6 | Trial-window variants share `cognition.yml`; differentiation does not create new workflows. |
| 9 (Level 5) | 25 | adds nothing new | 4–6 | The dry-run promotion PR (S9-D3) is itself a single-PR settlement that closes without merge. |

The "Target runs/PR" column is the property this document undertakes to hold. The activation-steward B-brain's first scheduled report after each stage's exit criteria are met must include the *actual* runs/PR over the prior window; sustained drift above the target column entries triggers a cost-reduction settlement (a new PR applying additional §C patterns or extending existing ones).

---

## §E. Risk, anti-patterns, and out of scope

### E.1 Anti-patterns to refuse

These patterns *would* reduce runs but violate `PLAN.md` or `ANALYSIS.md`. They must not be adopted.

| Anti-pattern | Why refused |
| --- | --- |
| Marking a `C-*` check optional in Branch Protection to skip it on irrelevant paths | Use P3 (path scoping at trigger level) instead. An optional check can be bypassed by a label or admin override; a path-scoped required check cannot. |
| Combining multiple censors into one job that returns a single status | Violates §B item 3 ("consolidation, never collapse"); destroys per-check auditability and `PLAN.md §B.4`'s identifier discipline. |
| Disabling required checks during the Stage 2 rehearsal window | Use P5 (configuration-driven enforcement mode) instead. Disabling required-status defeats `PLAN.md §A item 3`. |
| Running cognitive-loop workflows only on `merge_group` to save PR-time runs | Settlements need critic and censor feedback *during* the PR, not at merge time, per `PLAN.md §C Stage 3, S3-D7`. P9 applies to *heavy* censors only, never to W-CRT or W-CEN. |
| Letting B-brains write to `main` directly to avoid PR-time runs | Violates `PLAN.md §A item 9` outright. |
| Self-hosted runners to reduce billed minutes per launch | Out of scope (reduces minutes, not launches) and introduces a non-`free` economic mode dependency — refused under §B item 8 until `PLAN.md §C Stage 9` re-opens the maturity envelope. |
| Cancelling W-STL ledger-writing runs via P4 | See P4 constraint; ledger half-writes corrupt `memory/ledger/**` append-only invariants and would be caught by C-AO at the next PR — but the corruption is irreversible in the run itself. |

### E.2 Top cost risks the patterns do not fully mitigate

| Risk | Residual mitigation |
| --- | --- |
| `synchronize` storms during rapid fixup-pushes | P4 (cancel-in-progress) handles common cases; for sustained storms, the activation-steward opens a `pause: agency/<x>` settlement that gates the wrapper. |
| Comment-triggered runs on long issue threads | The W-AG wrapper (`PLAN.md §C Stage 1, S1-D8`) must deduplicate by latest-comment-only and ignore self-authored comments (P8). |
| Cascade chains via `workflow_run` from third-party Actions | P2 and P7 eliminate intentional cascades; for unintended ones, prefer composite actions over reusable workflows where the call is small. |
| Scheduled B-brain runs accumulating during low-activity periods | Schedule daily, not hourly, after Stage 5 exit criteria are stable; allow `workflow_dispatch` for on-demand ecology reports. |
| Required-check additions during a stage that retroactively re-run on older PRs | New jobs in `censors.yml` (P1) only fire on PRs opened after the job lands; do not back-fill required status on long-open PRs. |

### E.3 Reversibility summary

Every pattern in §C carries an explicit rollback. The aggregate property this document preserves is: **no cost reduction taken under §C requires more than one subsequent PR to undo.** This mirrors `PLAN.md §A item 10` ("reversibility is a deliverable, not an afterthought").

### E.4 Explicitly out of scope

This document does **not** cover:

- runner sizing, caching strategy, build-step trimming, or any other *minutes-reduction* concern that does not change the *number of runs launched*;
- third-party Actions-marketplace cost (none of P1–P12 introduces a new marketplace dependency; see §B item 8);
- federation costs (`PLAN.md §C Stage 10` is out of scope, so its cross-repository `repository_dispatch` storm is too);
- monetary budgeting against the GitHub Actions billing API — that is a `governance/` settlement once `PLAN.md §C Stage 7` lands the ledger;
- reduction of `gsi-public-fabric.yml` runs — that workflow's launch profile is not derivative of `PLAN.md`.

### E.5 Open questions for the first cost-reduction settlement

These questions are not answered by `PLAN.md` and must be resolved by an explicit governance settlement before any §C pattern lands:

1. What is the per-PR launch budget the activation-steward must report against? (§D suggests ≤ 6; governance picks the exact number.)
2. What is the cadence for the scheduled B-brain run under P6 — hourly during pilot, daily in steady state, or a different schedule per steward?
3. Which checks from `PLAN.md §B.4` are eligible for `merge_group`-only execution under P9? (§C P9 nominates C-CW, C-PAY, C-DEP; governance confirms or amends.)
4. What is the documentation-only path glob for P12, and does it include `.github-society-intelligence/docs/**`?

Each of these is a one-PR settlement in `governance/`, opened before the §C pattern that depends on it.

---

## §F. Closing

The single-repository Society of Mind is sustainable as Actions-billed compute only if the number of *workflow runs* launched per PR stays small while the number of *checks* enforced per PR grows large. `PLAN.md §B.4`'s eighteen censors and `PLAN.md §B.3`'s ten workflows are not a *file* count; they are a *behaviour* count, and twelve straightforward patterns collapse the file count without weakening any behaviour.

This document is *when, in what shape, with what fallback* — the cost-reduction counterpart to `PLAN.md`'s *when, in what order, gated by what evidence*. It is meant to be argued with, and amended through the same settlement discipline `PLAN.md §A item 1` schedules.

---

*Source material: [`PLAN.md`](./PLAN.md), [`ANALYSIS.md`](./ANALYSIS.md). All run-count estimates are upper bounds on a representative settlement PR; the activation-steward's scheduled report is the authoritative source for actuals.*
