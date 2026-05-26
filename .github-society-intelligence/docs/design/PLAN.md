# PLAN — Implementing ANALYSIS.md inside `.github-society-intelligence/`

### A staged, work-itemised plan to turn today's single-workflow runtime into the single-repository Society of Mind described by [`ANALYSIS.md`](./ANALYSIS.md) — without bypassing any reflective discipline, and without breaking the *two locations, one installation* property.

> This plan is derivative. Its only job is to make [`ANALYSIS.md`](./ANALYSIS.md) executable as a sequence of installable, reviewable enhancements. Every stage in this plan is a stage from `ANALYSIS.md §28`; every directory it creates is a directory from `ANALYSIS.md §22`; every required check it enables is a censor from `ANALYSIS.md §13`. Where the plan adds anything `ANALYSIS.md` does not name, it is noted explicitly as a *plan-only scaffold* and justified.

The plan is organised in three layers, in order of decreasing abstraction:

1. **§A — Operating principles for the implementation work itself.** How the work is done, so that the *process* of building the society does not violate the constitution the society is meant to embody.
2. **§B — The cross-cutting deliverable inventory.** Every artifact, directory, workflow, required check, and CODEOWNERS rule that must eventually exist, listed once and referenced from the stages.
3. **§C — The ten stages.** Stage-by-stage work items, each with goal, deliverables, exit criteria, and traceability back to `ANALYSIS.md`.

A short closing section (§D) covers risk, rollback, and out-of-scope items.

---

## §A. Operating principles for the implementation work

These principles bind the *implementer* (humans and the agent), not the system being implemented. They exist because building a constitution by violating it is the failure mode `ANALYSIS.md §17.5` and `§23` warn against, applied to ourselves.

1. **The plan is itself executed as settlements.** Every stage in §C is delivered as one or more PRs. No stage advances by direct push to `main`. Stage exit criteria are checked on a PR, not asserted in a doc.
2. **Each PR carries the smallest viable change.** A stage may take many PRs; a PR never spans more than one stage. The stage label (`stage: 1`, `stage: 2`, …) is added at PR open time and never edited later.
3. **No required check is added without the artifact it protects.** A `censor/*` required check is enabled in the same PR that introduces the directory or schema it guards, or in the immediately following PR. We never have a check that protects nothing, and we never have a directory that nothing protects, for more than one PR's duration.
4. **No directory is created empty.** Each new top-level directory under `.github-society-intelligence/` lands with: a `README.md` citing its `ANALYSIS.md` section, a CODEOWNERS entry, a representative schema or example, and (where applicable) a required-check skeleton.
5. **Move, never rewrite.** Where a future stage will *promote* a thing (an agency, a memory subtree, a directory) to a different location, this plan creates it at the location it will live in **forever**. The `ANALYSIS.md` "promote-by-move" property is preserved by never planning a rewrite-style migration.
6. **Documentation lands with code.** Every new directory, censor, or workflow updates `docs/index.md` and the relevant `docs/design/*` doc in the same PR. Drift between documentation and implementation is itself a failure mode the B-brains will be asked to monitor; do not seed that drift here.
7. **The Stage 0 runtime is never broken.** The current workflow `github-society-intelligence-agent.yml` and the current `state/`, `lifecycle/`, `install/`, `public-fabric/` directories continue to function at every stage. They are wrapped, then replaced — never deleted in place. Until an agency formally supersedes a Stage-0 component through a settlement, the Stage-0 component remains the source of truth.
8. **Economic mode stays `free` until §C Stage 9.** No PR in stages 1–8 may flip `governance/maturity.yaml: economic_layer_enabled` or introduce a non-`free` `economy.mode` on any channel. This is the strongest single discipline of `ANALYSIS.md §17`, applied to the act of building it.
9. **B-brains observe, never merge.** From the moment they exist (Stage 5), B-brain PRs require human review from `governance/` CODEOWNERS. No automation in this plan grants a B-brain merge rights.
10. **Reversibility is a deliverable, not an afterthought.** Every stage has an explicit rollback note. If a stage's deliverables turn out to be wrong, the next PR is a *reversing* PR — never a destructive history edit.

---

## §B. Cross-cutting deliverable inventory

This is the union of every artifact the ten stages produce. It is the *target steady state* of `.github-society-intelligence/` once Stage 9 completes, drawn from `ANALYSIS.md §22`. Stages in §C reference items by their identifier here.

### B.1 Society-level files

| ID | Path | Purpose | Source |
| --- | --- | --- | --- |
| F-CONST | `.github-society-intelligence/constitution.yaml` | The society's root constitution | `ANALYSIS.md §2, §22` |
| F-REP   | `.github-society-intelligence/representation.yaml` | Enumerates valid `representation_class` values | `§3, §22` |
| F-INS   | `.github-society-intelligence/insulation-map.yaml` | Declares forbidden cross-directory writes | `§11, §22` |
| F-MAT   | `.github-society-intelligence/maturity.yaml` | Gates the economic layer | `§17, §22, §24` |

### B.2 Top-level directories

| ID | Path | Purpose | Source |
| --- | --- | --- | --- |
| D-GOV    | `governance/`          | Constitution, authority, rights, self-ideals, approval gates, commands | `§6, §22` |
| D-AGN    | `agencies/`            | All agency directories (incl. `b-brains/`, `bridges/`, `_bootstrap/`, `_archive/`) | `§6, §22` |
| D-CRT    | `critics/`             | Critic agencies (may live under `agencies/` with `role: critic`) | `§6, §22` |
| D-CEN    | `censors/`             | Censor configurations, paired with required checks | `§13, §22` |
| D-SUP    | `suppressors/`         | Suppressors at output boundaries | `§14, §22` |
| D-MEM    | `memory/`              | All cognitive memory (events, episodic, semantic, procedural, failure, frames, klines, analogies, concepts, decisions, recognition-index, consolidation-queue, credit-assignment, suppressor-catches, ledger) | `§15, §16, §17, §22` |
| D-SVC    | `services/`            | `registry.yaml` + `contracts/<svc>.v<N>.yaml` | `§8, §22` |
| D-IMP    | `imports/`             | Per-source pinned-tag import records | `§15, §22` |
| D-WRK    | `workspace/`           | `active-settlements/`, `focus.yaml` | `§6, §22` |
| D-STL    | `settlements/`         | One YAML per settlement, merged at closure | `§10, §22` |
| D-STA    | `state/`               | `self-models/`, `self-ideals/`, `windows/`, `observability/`, `ecology-reports/` | `§12, §18, §19, §22` |

### B.3 Workflows under `.github/workflows/`

| ID | File | Purpose | Source |
| --- | --- | --- | --- |
| W-AG  | `github-society-intelligence-agent.yml` | Existing entrypoint, retained unchanged at Stage 0; wrapped at Stage 1 | runtime |
| W-PRC | `perceive.yml`        | Event normalisation, perception, recognition | `§5, §22` |
| W-ACT | `activate.yml`        | Frame selection, K-line activation, agency response | `§5, §22` |
| W-CRT | `critique.yml`        | Critic review surface | `§5, §22` |
| W-CEN | `censor.yml`          | Aggregating censor surface | `§5, §13, §22` |
| W-STL | `settle.yml`          | Settlement closure and credit-assignment requirement | `§5, §10, §22` |
| W-CON | `consolidate.yml`     | Consolidation window before memory promotion | `§3, §5, §15, §22` |
| W-OBS | `observe.yml`         | Observability emission, B-brain triggers | `§18, §19, §22` |
| W-DLG | `delegate.yml`        | Inter-agency channel transport (in-repo `workflow_dispatch`/`workflow_run`) | `§5, §8, §22` |
| W-IMP | `import-memory.yml`   | Memory import settlements with provenance | `§15, §22` |

### B.4 Required status checks (censors)

The twelve from `ANALYSIS.md §13`, in the order the stages enable them:

| ID | Check | Where it runs | Source |
| --- | --- | --- | --- |
| C-CRED  | `censor/credential`            | every PR | `§13` |
| C-PII   | `censor/pii`                   | every PR | `§13` |
| C-AUTH  | `censor/authority`             | every settlement PR | `§13` |
| C-RC    | `censor/representation-class`  | every PR adding memory artifacts | `§13` |
| C-AO    | `censor/append-only`           | PRs touching `memory/ledger/**` and other append-only subtrees | `§13, §17` |
| C-CDW   | `censor/cross-directory-write` | PRs crossing insulation boundaries | `§11, §13` |
| C-EGR   | `censor/cloud-egress`          | PRs/runs that emit outbound network calls | `§13` |
| C-INR   | `censor/input-rights`          | provider agency intake workflows | `§13` |
| C-PAY   | `censor/payment`               | dispatch-emitting PRs, ledger PRs | `§13, §17` |
| C-DEP   | `censor/delegation-depth`      | every settlement PR | `§13` |
| C-BRP   | `censor/bridge-probation`      | settlement PRs naming a bridge | `§9, §13` |
| C-REP   | `censor/reputation-floor`      | outbound channel calls | `§13` |
| C-MCI   | `censor/memory-class-import`   | memory-import PRs | `§15` |
| C-SCL   | `censor/settlement-closure`    | lead settlement PRs in multi-PR settlements | `§10` |
| C-SR    | `censor/silent-retry`          | retry settlements | `§23` |
| C-SIG   | `censor/commit-signature`      | every PR | `§12` |

### B.5 CODEOWNERS rules

Per `ANALYSIS.md §12`, lines added to `.github/CODEOWNERS` as their directories are created:

- `.github-society-intelligence/governance/constitution.yaml @named-human-owners`
- `.github-society-intelligence/governance/authority-registry.yaml @named-human-owners @at-least-one-other`
- `.github-society-intelligence/governance/self-ideals.yaml @named-human-owners @reviewer-rotation`
- `.github-society-intelligence/state/self-ideals/ @named-human-owners`
- `.github-society-intelligence/memory/ledger/ @ledger-owners`
- `.github-society-intelligence/agencies/bridges/ @bridge-owners`
- `.github-society-intelligence/agencies/b-brains/ @governance-owners`

The `@named-human-owners`, `@at-least-one-other`, `@reviewer-rotation`, `@ledger-owners`, `@bridge-owners`, `@governance-owners` team handles are placeholders. Resolving them to real GitHub teams is a Stage 1 deliverable (item S1-D6 below).

### B.6 Schemas

The plan introduces one schema per cognitive artifact class. Each schema is a YAML file under `.github-society-intelligence/governance/schemas/` (plan-only scaffold; `ANALYSIS.md` describes the fields, not their location). Schemas are:

- `constitution.schema.yaml` — society and agency constitutions
- `settlement.schema.yaml` — `settlements/<id>.yaml` per `§10`
- `channel.schema.yaml` — `agencies/<x>/channels/<y>.yaml` per `§8`
- `service-contract.schema.yaml` — `services/contracts/<svc>.v<N>.yaml`
- `credit-assignment.schema.yaml` — per `§16`
- `import-record.schema.yaml` — per `§15`
- `ledger-entry.schema.yaml` — per `§17`
- `translation-record.schema.yaml` — per `§9`
- `suppressor-catch.schema.yaml` — per `§14`
- `ecology-report.schema.yaml` — per `§18`

The schemas are checked by `censor/representation-class` (C-RC), which is the load-bearing reason this directory exists at all.

---

## §C. The ten stages

Each stage below mirrors `ANALYSIS.md §28`. For each stage the plan records:

- **Goal** — the property the stage establishes (paraphrased from `§28`);
- **Deliverables (S<n>-D<m>)** — concrete artifacts, identified for traceability;
- **Required checks newly enabled** — by ID from §B.4;
- **Exit criteria** — the gate that lets the next stage begin;
- **Rollback** — the reversing settlement that undoes the stage if it is found to be wrong;
- **Trace** — section(s) of `ANALYSIS.md` the stage realises.

The stages are sequential: each stage presupposes its predecessor. **A stage does not begin until its predecessor's exit criteria are satisfied on `main`.** This sequencing is itself a principle of `ANALYSIS.md §28` ("never bypasses an earlier stage") and is the single most important discipline in this plan.

### Stage 0 — baseline (already done; described for completeness)

- **Goal.** Acknowledge the current runtime as the seed: one workflow file (`github-society-intelligence-agent.yml`), session storage under `state/`, docs under `docs/`, no agencies, no censors, no settlements.
- **Deliverables.** None — this is the *as-is*.
- **Exit criteria.** None — Stage 1 may begin immediately.
- **Trace.** `ANALYSIS.md §28 Stage 0`.

### Stage 1 — minimum reflective skeleton

- **Goal.** Make the *shape* of the society present: one agency, one governance dir, one settlement discipline, one minimal memory layout. Nothing is censored yet; the surface area is small enough to inspect by reading.
- **Deliverables.**
  - **S1-D1.** Create `agencies/conversational-bee/` as the rewritten current responder, with `constitution.yaml`, `handlers/`, `state/`. The existing `lifecycle/agent.ts` is *referenced* by the handler; not moved yet.
  - **S1-D2.** Create `governance/constitution.yaml`, `governance/self-ideals.yaml` (use `ANALYSIS.md §12.3` self-ideals verbatim as the starting set), `governance/authority-registry.yaml`, `governance/rights-registry.yaml`, `governance/approval-gates/`, `governance/commands/`.
  - **S1-D3.** Create `memory/{events,episodic,semantic,procedural,failure,frames,klines,analogies,concepts,decisions,recognition-index,consolidation-queue,credit-assignment,suppressor-catches}/` — each with a `README.md` and `.gitkeep`. (`memory/ledger/` is deferred to Stage 7; `memory/concepts/` and friends gain real entries from Stage 4 onward.)
  - **S1-D4.** Create society-level files: F-CONST, F-REP, F-INS, F-MAT. `F-MAT` carries `economic_layer_enabled: false` and the full `ANALYSIS.md §24` checklist, all unchecked.
  - **S1-D5.** Create `settlements/`, `workspace/active-settlements/`, `workspace/focus.yaml`, `state/self-models/`, `state/self-ideals/`, `state/windows/`, `state/observability/`, `state/ecology-reports/`.
  - **S1-D6.** Create `.github/CODEOWNERS` with the rules listed in §B.5. Resolve the placeholder team handles to real GitHub teams (or to specific user handles if a team does not yet exist).
  - **S1-D7.** Create `governance/schemas/` and populate it with the schemas listed in §B.6. (At Stage 1 the schemas are stubs; later stages fill them in as they become load-bearing.)
  - **S1-D8.** Rewrite `github-society-intelligence-agent.yml` (W-AG) to *wrap* the conversational-bee handler call: same external behaviour, but the response is produced inside a settlement PR labelled `settlement: stl-…` and merged after one critic check (which at Stage 1 is a trivial layout-lint).
  - **S1-D9.** Update `docs/index.md` to point at this plan and the new directories.
- **Required checks newly enabled.** None on `main` yet; layout-lint runs as an advisory check.
- **Exit criteria.** Every new directory exists with README + CODEOWNERS coverage; one issue→PR→merge cycle has completed end-to-end with the new wrapper; `governance/maturity.yaml` first-stage checklist items are checked.
- **Rollback.** Revert the W-AG rewrite; the pre-wrap workflow continues to function because we did not delete it in place.
- **Trace.** `ANALYSIS.md §28 Stage 1`, §3, §6, §22.

### Stage 2 — censors and required checks

- **Goal.** Promote the directory layout from decorative to load-bearing by enabling branch protection and the first set of required checks. After Stage 2, the constitution begins to enforce itself.
- **Deliverables.**
  - **S2-D1.** Enable branch protection on `main`: require PRs, require status checks, disallow force pushes, disallow direct pushes, require signed commits (enables C-SIG).
  - **S2-D2.** Implement and enable as required checks: C-CRED, C-PII, C-RC, C-AO, C-CDW, C-AUTH. Each check is a small action under `.github/workflows/` (or a reusable workflow under `censors/<name>/`) plus a Branch Protection rule.
  - **S2-D3.** Populate `governance/schemas/representation.schema.yaml` (real, not stub); C-RC fails any PR adding a memory artifact lacking a `representation_class:` from F-REP.
  - **S2-D4.** Populate `.github-society-intelligence/insulation-map.yaml` with the forbidden cross-directory writes implied by `ANALYSIS.md §11`. C-CDW reads this file.
  - **S2-D5.** Add an advisory dry-run mode for C-CDW on the PR that enables it, then flip to enforced mode in the next PR — this is the smallest viable rehearsal pattern for any required check that could block ordinary work.
- **Required checks newly enabled.** C-SIG, C-CRED, C-PII, C-RC, C-AO, C-CDW, C-AUTH.
- **Exit criteria.** A deliberately crafted PR that would violate each of the seven checks is opened and *fails*; a matching PR that respects each check is opened and *passes*.
- **Rollback.** Disable the branch-protection rule(s); the checks remain present but non-blocking. The repository continues to function exactly as in Stage 1.
- **Trace.** `ANALYSIS.md §28 Stage 2`, §11, §12, §13.

### Stage 3 — second agency and the first inter-agency settlement

- **Goal.** Exercise the inter-agency settlement protocol (`ANALYSIS.md §8`) end-to-end at the smallest possible surface: one requester, one provider, one channel, one bridge-free contract.
- **Deliverables.**
  - **S3-D1.** Create `agencies/critic-bee/` with `constitution.yaml` declaring `role: critic` and authority limited to reviewing other agencies' PRs.
  - **S3-D2.** Create `services/registry.yaml` listing the one service `critic-bee` exposes and `services/contracts/critic-review.v1.yaml`. The contract pins `input.accepted_classes`, `input.forbidden_classes`, `output.retention_rights`, `economy.mode: free`, `governance.censors_required_on_requester: [cloud-egress]`, `governance.censors_required_on_provider: [input-rights]`, `governance.dispute_window_days: 30`.
  - **S3-D3.** Create `agencies/conversational-bee/channels/critic-bee.yaml` pinning the contract file SHA.
  - **S3-D4.** Implement W-DLG (`delegate.yml`) as the in-repo channel transport: a `workflow_dispatch`/`workflow_run` wrapper that carries payload hash + contract SHA, identical in shape to a future `repository_dispatch`.
  - **S3-D5.** Implement and enable as required checks: C-EGR (outbound; runs on PRs touching `agencies/<requester>/channels/**` and on any PR triggering W-DLG), C-INR (inbound; runs on the provider's intake workflow), C-DEP (caps `delegation_depth: 1` for this stage).
  - **S3-D6.** Populate `governance/schemas/credit-assignment.schema.yaml`; require a `memory/credit-assignment/<settlement-id>.yaml` file on every settlement PR via a new required check `censor/credit-assignment` (an instance of `§16`'s rule; identified as plan-only scaffold extension to the §B.4 list).
  - **S3-D7.** Execute one inter-agency settlement end-to-end: a conversational-bee → critic-bee call that passes C-EGR, C-INR, C-DEP, writes a credit-assignment record, and merges through W-STL.
- **Required checks newly enabled.** C-EGR, C-INR, C-DEP, `censor/credit-assignment`.
- **Exit criteria.** The end-to-end inter-agency settlement merges; the credit-assignment record is present on `main`; an attempted bypass (a PR that calls W-DLG without a pinned contract SHA) is rejected.
- **Rollback.** Revert the channel file; W-DLG remains but is no longer called. The two agencies revert to operating only on their own PRs.
- **Trace.** `ANALYSIS.md §28 Stage 3`, §8, §10, §13, §16.

### Stage 4 — frames, K-lines, analogies, consolidation

- **Goal.** Make the cognitive loop (`ANALYSIS.md §5`) load-bearing: nothing acts before recognition; nothing imports before consolidation; every settlement names the frame and K-lines it used.
- **Deliverables.**
  - **S4-D1.** Implement W-PRC: stimulus normalisation → perception → `memory/recognition-index/` lookup → frame selection from `memory/frames/`.
  - **S4-D2.** Implement W-ACT: frame-selected → K-line activation from `memory/klines/` → analogy fallback from `memory/analogies/` → agency response inside a `think/<settlement>/<agency>/` branch.
  - **S4-D3.** Implement W-CON: every memory-promoting PR sits in `memory/consolidation-queue/` for the configured window before W-STL closes it.
  - **S4-D4.** Extend the settlement schema to require `transframe.before`, `transframe.after`, `unknowns`, `blind_spots`, `budgets.{calls,seconds,cost,bridges}`, `frame_used`, `klines_activated`, `analogies_invoked`. C-RC enforces the schema.
  - **S4-D5.** Populate the first real entries in `memory/frames/`, `memory/klines/`, `memory/analogies/`, `memory/concepts/` (each `concepts/<c>.yaml` requires non-empty `examples:` and `non_examples:`).
  - **S4-D6.** Extend the credit-assignment schema to cover all fourteen local credit targets in `ANALYSIS.md §16`; `censor/credit-assignment` fails PRs whose records omit any target that applies.
- **Required checks newly enabled.** A `censor/consolidation-window` check that fails PRs promoting memory whose consolidation window is not closed (plan-only scaffold extending §B.4; faithful to `§3` and `§15`).
- **Exit criteria.** One full cognitive-loop run produces a settlement that names the frame, K-lines, analogies, budgets, transframe, unknowns, and blind spots; the consolidation window is observed; the credit-assignment record covers all fourteen targets.
- **Rollback.** Disable W-PRC / W-ACT / W-CON's required-check status; W-AG falls back to the Stage 3 short-circuit path. Frames/K-lines/analogies remain in memory but are not consulted.
- **Trace.** `ANALYSIS.md §28 Stage 4`, §3, §5, §15, §16.

### Stage 5 — plural self-models, slow self-ideals, B-brains

- **Goal.** Add the reflective layer: plural fast self-models, a small set of slow self-ideals, and B-brain agencies that observe metadata only and cannot merge.
- **Deliverables.**
  - **S5-D1.** Populate `state/self-models/` with at least two non-identical self-models per agency (`fast`, plural by rule), and `state/self-ideals/` with the verbatim set from `ANALYSIS.md §12.3` (slow, CODEOWNER-restricted).
  - **S5-D2.** Create `agencies/b-brains/{activation,memory,channel,bridge,economic,governance-drift,self-model}-steward/`. Each carries `constitution.yaml` with `may_merge: false` and `read_content: false`.
  - **S5-D3.** Implement a `censor/b-brain-content-access` required check on PRs from b-brain agencies: fails any handler that opens a file matching a content directory glob (e.g. `memory/episodic/**` body content, agency `outputs/**` body content). The check inspects the PR's added/changed file *paths*, not their content, exactly to honour the metadata-only constraint.
  - **S5-D4.** Implement W-OBS to emit the observability signals listed in `ANALYSIS.md §19` under `state/observability/`.
  - **S5-D5.** Generate the first quarterly ecology report at `state/ecology-reports/<yyyy>-Q<n>.md`, conforming to `ecology-report.schema.yaml`, produced by a scheduled W-OBS run and merged through a settlement PR that requires `governance/` CODEOWNER review.
- **Required checks newly enabled.** `censor/b-brain-content-access` (plan-only scaffold extending §B.4; required by `§18`).
- **Exit criteria.** First ecology report is on `main`; an attempt by a b-brain handler to read a content file is rejected; b-brain PRs require human review.
- **Rollback.** Disable W-OBS schedule; b-brain agencies remain present but dormant. Self-models and self-ideals remain on disk.
- **Trace.** `ANALYSIS.md §28 Stage 5`, §3, §12, §18, §19.

### Stage 6 — bridges and bridge probation

- **Goal.** Exercise the bridge discipline (`ANALYSIS.md §9`): translators live in their own directory, declare lossiness, run round-trip tests, and respect probation.
- **Deliverables.**
  - **S6-D1.** Create one bridge `agencies/bridges/<x>-to-<y>/` (the exact source/target pair is chosen at planning time from real cognitive need; this plan does not pre-name it because doing so would over-specify the bridge before its requester exists). The bridge carries `constitution.yaml` (with direction), `declared_lossiness:` envelope, `translations/`, `round_trip_tests/`, `state/drift-history.yaml`, `status:` ∈ {`candidate`, `probation`, `active`, `superseded`, `retired`}.
  - **S6-D2.** Implement and enable C-BRP: fails any settlement PR naming a bridge currently in `probation` unless the PR also references a documented alternative bridge or escalates to human approval per `ANALYSIS.md §9`.
  - **S6-D3.** Implement the layout-lint rule that forbids `representation_class: translation_record` anywhere outside `agencies/bridges/**` (a new sub-check of C-RC).
  - **S6-D4.** Execute one bridged inter-agency settlement end-to-end; round-trip tests pass; the translation record is archived under the bridge's `translations/`; drift is recorded.
- **Required checks newly enabled.** C-BRP, the layout-lint sub-check.
- **Exit criteria.** A PR adding a translation file under any non-bridge agency directory is rejected; the bridged settlement merges and produces all required artifacts.
- **Rollback.** Mark the bridge `retired`; C-BRP remains enforced (it costs nothing if no bridge is in probation).
- **Trace.** `ANALYSIS.md §28 Stage 6`, §9, §13, §23.

### Stage 7 — ledger (modes `free` and `reciprocal` only)

- **Goal.** Introduce the ledger and exercise the full settlement → ledger → dispute-window → reputation cycle, with currency mode still disabled.
- **Deliverables.**
  - **S7-D1.** Create `memory/ledger/{entries,reputation,disputes,monthly-statements}/` with CODEOWNERS routed to `@ledger-owners`.
  - **S7-D2.** Populate `governance/schemas/ledger-entry.schema.yaml` per `ANALYSIS.md §17.2`. Entries carry `mode: free | reciprocal` only.
  - **S7-D3.** Enable C-PAY: refuses any transaction whose mode is not `free` or `reciprocal` while `F-MAT.economic_layer_enabled` is `false`; refuses any transaction above per-channel or per-window budget.
  - **S7-D4.** Enable C-AO on `memory/ledger/**` (was enabled in Stage 2 for other append-only subtrees; here scoped to ledger entries: corrections must be reversing entries, never destructive edits).
  - **S7-D5.** Enable C-REP on outbound channel calls (consults `memory/ledger/reputation/`); enable C-SR on retries.
  - **S7-D6.** Implement the `dispute: tx-…` label and a 30-day dispute window workflow (owned by `governance/` CODEOWNERS) that delays reputation updates per `ANALYSIS.md §17`.
  - **S7-D7.** Run one complete settlement cycle through the ledger: entry merged, dispute window observed, reputation updated within envelope. C-PAY remains gated on F-MAT.
- **Required checks newly enabled.** C-PAY, C-REP, C-SR, plus the ledger-scoped C-AO refinement.
- **Exit criteria.** The complete cycle is on `main`; a PR attempting a `currency`-mode entry is rejected; a PR attempting to overwrite a ledger entry is rejected; reputation did not move during the dispute window.
- **Rollback.** Mark the ledger entries `superseded` via reversing entries; the directory and censors remain, ungated. C-PAY remains enforced.
- **Trace.** `ANALYSIS.md §28 Stage 7`, §17, §13, §16.

### Stage 8 — differentiation by fork

- **Goal.** Exercise the evolution mechanism (`ANALYSIS.md §20`) at directory scale: fork one pressured agency under bootstrap protection, run the trial window, and promote or retire through settlement.
- **Deliverables.**
  - **S8-D1.** A B-brain (the activation-steward or self-model-steward) identifies a single agency under double-purpose pressure and opens a settlement proposing differentiation.
  - **S8-D2.** Copy the agency to `agencies/_bootstrap/<x>-variant-a/` and `agencies/_bootstrap/<x>-variant-b/`. Each variant carries reduced authority in its `constitution.yaml`, increased introspection requirements, `economy.mode: free` only, an explicit rollback plan committed to `governance/`.
  - **S8-D3.** Run a trial window during which both variants handle stimuli alongside the parent; credit-assignment records and ecology reports cover the variants explicitly.
  - **S8-D4.** At trial-window close, open a settlement that either promotes one or both variants out of `_bootstrap/` (the parent is superseded or retained per the settlement's analysis) or archives unsuccessful variants under `agencies/_archive/<x>-variant-*/` (history readable, references removed).
- **Required checks newly enabled.** None new; existing checks must hold during the trial window.
- **Exit criteria.** At least one fork has been either promoted or retired through settlement, with full credit-assignment and ecology record; the parent's status (superseded, retained, retired) is recorded in `governance/`.
- **Rollback.** Open an archive settlement for any promoted variant; restore the parent's authority through a governance settlement. No data is lost.
- **Trace.** `ANALYSIS.md §28 Stage 8`, §20, §23.

### Stage 9 — Level 5 declared (still single-repo)

- **Goal.** Verify the maturity contract (`ANALYSIS.md §24`) for the single-repository implementation, declare Level 5, and prove the *move-not-rewrite* property.
- **Deliverables.**
  - **S9-D1.** Walk the seventeen items of `ANALYSIS.md §24`. For each, link to the artifacts on `main` that satisfy it; tick the corresponding box in `F-MAT`.
  - **S9-D2.** Run a quarterly-cycle review: the most recent ecology report at `state/ecology-reports/<yyyy>-Q<n>.md` is reviewed by `governance/` CODEOWNERS and explicitly approves the §24 declaration.
  - **S9-D3.** Perform a *dry-run promotion*: pick one non-critical agency and produce a PR that would *move* its directory to a hypothetical separate repository, with constitution, memory subtree, credit-assignment shape, and self-model unchanged. The PR is opened, demonstrated, then closed without merging. This is the structural proof of the move-not-rewrite property required to seed a federation.
  - **S9-D4.** Update `governance/maturity.yaml` with `level: 5` and the timestamp of approval.
- **Required checks newly enabled.** None new; the full censor set must hold.
- **Exit criteria.** All §24 items checked; `governance/` CODEOWNER approval recorded on the §C Stage 9 closure PR; dry-run promotion PR demonstrates move-not-rewrite.
- **Rollback.** Set `level` back to the previous value and uncheck the §24 items whose evidence was found lacking; no destructive change.
- **Trace.** `ANALYSIS.md §28 Stage 9`, §24, §27.

### Stage 10 — first federation hop (out of scope)

- **Goal.** Begin `DESIGN.md` Stage 3 of its own bootstrap path: one outbound channel to one external provider repo.
- **Status in this plan.** **Out of scope.** This plan does not implement Stage 10. Per `ANALYSIS.md §28 Stage 10`, beginning this stage before Stage 9 is verified is the very anti-pattern `ANALYSIS.md §17.5` and `§23` warn against. When Stage 9 has held for at least one quarterly cycle, a *separate* plan supersedes this one and addresses federation.

---

## §D. Risk, rollback, and out-of-scope

### D.1 Top risks and their mitigations

| Risk | Mitigation in this plan |
| --- | --- |
| Building censors faster than the artifacts they protect, blocking ordinary work | §A item 3; every censor lands with its artifact, and §C Stage 2 uses an advisory dry-run before flipping to enforced |
| Drift between this plan, `ANALYSIS.md`, and the implementation | §A item 6; every PR updates documentation in the same change |
| Premature economic activity | §A item 8 + F-MAT; C-PAY is enabled from Stage 7 and refuses `currency` while F-MAT gates it |
| B-brain over-reach | §A item 9 + S5-D3; `censor/b-brain-content-access` fails any path-based content read by a b-brain handler |
| Stage skipping under schedule pressure | §C preamble; a stage does not begin until its predecessor's exit criteria are on `main` |
| Stage 0 runtime breakage during wrapping | §A item 7 + S1-D8; the Stage-0 workflow is wrapped, never deleted in place |
| Rollback complexity for required checks | §A item 10; rollbacks are reversing settlements, not history edits; required checks are disabled (not removed) on rollback |

### D.2 Reversibility summary

Every stage in §C carries an explicit rollback note. The aggregate property the plan preserves is: **at no point in the staged rollout is there an artifact or check that cannot be reversed by a single subsequent PR.** This is the `ANALYSIS.md §20.3` rule (*"nothing is ever silently removed; removal is itself a reviewed, reverted-if-needed act"*) applied to the implementation itself.

### D.3 Explicitly out of scope

This plan does **not** cover:

- federation primitives (`repository_dispatch`, cross-org credentials, the federation governance repo);
- `economy.mode: currency` enablement;
- automatic agency-constitution import, automatic bridge synthesis, automatic memory merging, or any other automation `ANALYSIS.md §26` declines;
- migrating any historical conversation memory in `state/` into the new `memory/episodic/` layout — that migration, if undertaken at all, is itself a settlement under §C Stage 4's consolidation discipline and is scheduled separately;
- replacing CODEOWNERS with reputation thresholds at any tier.

### D.4 Open questions for the first governance settlement

These questions are not answered by `ANALYSIS.md` and must be resolved by an explicit governance settlement before §C Stage 1 begins:

1. Which GitHub handles or teams are bound to `@named-human-owners`, `@at-least-one-other`, `@reviewer-rotation`, `@ledger-owners`, `@bridge-owners`, `@governance-owners`? (Required for S1-D6.)
2. What is the trial-window duration for §C Stage 8 differentiation? (`ANALYSIS.md §20` describes the mechanism but leaves the duration to governance.)
3. What is the per-channel and per-window budget for C-PAY's first enabled run? (Required for §C Stage 7.)
4. Which agency is chosen for the §C Stage 9 dry-run promotion? (Required for S9-D3.)

Each of these is a one-PR settlement in `governance/`, opened before the stage that depends on it.

---

## §E. Closing

The single-repository Society of Mind is built by **honouring its own constitution as it is built.** This plan's only contribution is to schedule the work so that the discipline is never bypassed by the act of installing the discipline.

`ANALYSIS.md` is the *what*. This plan is the *when, in what order, gated by what evidence*. When Stage 9 closes, `.github-society-intelligence/` is a faithful Stage-1 instance of `DESIGN.md §28`'s bootstrap path, and the question of whether to begin Stage 10 — a federation hop — is itself a settlement opened against a separate plan that supersedes this one.

---

*Source material: [`ANALYSIS.md`](./ANALYSIS.md), [`DESIGN.md`](./DESIGN.md), [`DESIGN-1.md`](./DESIGN-1.md), [`DESIGN-2.md`](./DESIGN-2.md), [`DESIGN-3.md`](./DESIGN-3.md). This plan is one opinionated reading of `ANALYSIS.md` as a sequence of installable enhancements. It is meant to be argued with — and amended through the same settlement discipline it schedules.*
