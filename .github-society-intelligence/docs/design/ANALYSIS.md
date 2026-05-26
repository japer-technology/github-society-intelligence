# ANALYSIS — The Society of Mind in a Single Repository

### A deep reading of [`DESIGN.md`](./DESIGN.md) reinterpreted as a *first* implementation: the entire Society of Mind collapsed into one repository, delivered as a massive enhancement of [`.github-society-intelligence/`](../../)

> The forge is the mind. The repo is *the society itself*. The branch is a thought. The pull request is a settlement. The merge is action. The committed graph is memory. **Before there is a federation, there must first be one repository that can already think, criticise, censor, settle, remember, reflect, differentiate, and be honestly governed — all by itself.**

[`DESIGN.md`](./DESIGN.md) specifies a *federation* of repository-native societies: many repositories, each an agency, speaking through signed channels, translating across honest bridges, paying or crediting each other through an append-only ledger. That design assumes — but does not itself build — a single repository capable of reflective discipline at Levels 3 and 4 of its maturity ladder.

This document is the analysis of how DESIGN.md is implemented **before** the federation exists: a single-repository instantiation in which the Society of Mind lives entirely inside one Git repository, and in which everything DESIGN.md attributes to *separate repositories* (agencies, critics, censors, bridges, memory, governance, ledger, workspace, services) is realised as a *directory and a workflow step* inside `.github-society-intelligence/`.

The thesis of this analysis is narrow:

> **Every constitutional principle of DESIGN.md can be honoured inside one repository. Every federation primitive has a faithful intra-repository analogue. The single-repository implementation is not a toy; it is the substrate on which any later federation can be built without rewriting its constitution.**

The analysis is organised the same way DESIGN.md is, section by section, so the two documents can be read side-by-side. Where DESIGN.md says "a repository", this analysis says "a directory under `.github-society-intelligence/` with its own constitution and CODEOWNERS". Where DESIGN.md says "a release", this analysis says "a tagged commit on `main`". Where DESIGN.md says "a channel transaction", this analysis says "an inter-agency settlement PR with the same constitutional discipline".

---

## 1. Why a single repository first

DESIGN.md §28 itself names this as **Stage 1** of its bootstrap path:

> *"`<name>-society` reaches full reflective compliance: frames, K-lines, analogies, settlements, suppressors, consolidation windows, full-loop credit assignment, plural self-models, slow self-ideals, plural B-brains"* — **before** any federation governance, channels, bridges or ledgers come into existence.

A federation that begins before Stage 1 is satisfied is the very anti-pattern DESIGN.md §17.5 and §23 warn against: *speed without reflection accelerates mistakes*. The single-repository implementation is therefore not a "reduced" version of DESIGN.md — it is **the foundation DESIGN.md presupposes**.

It also matches the lived shape of the current runtime. The installable artifact today is one workflow file and one folder, `.github-society-intelligence/`. That is a single repository, with a single doorway. Anything we add must remain installable that way, or we lose the property — *zero infrastructure, repository-owned* — that makes this design defensible at all.

The single-repository implementation has three further independent justifications:

1. **The constitution must be writable before it can be federated.** A federation imports constitutional law from a governance repo; that law must first be written, exercised, and revised under settlement somewhere. The single-repo society is where that happens.
2. **Insulation has a cheaper analogue inside one repo.** Directory boundaries, CODEOWNERS rules, and required status checks already give us most of what `repository_dispatch` gives us across repos — without any of the cross-org authority, secret-distribution, or trust-bootstrap problems.
3. **Cross-boundary discipline is learned on cheap boundaries first.** A society that cannot keep its own critic agency from rewriting its own memory directory will not safely send a `repository_dispatch` to a sibling repo. The disciplines of `representation_class`, `consolidation_window`, `credit_assignment`, and `non-compromise` are best rehearsed on intra-repo boundaries before they become inter-repo boundaries.

---

## 2. The fourteen principles, reinterpreted for one repository

DESIGN.md §2 lists seven principles for the single-repository society and seven more for the federation. The single-repo implementation must honour all seven of the first set in their full strength, and must honour the second set **as latent invariants** — that is, the implementation must not contradict them now, so that crossing into a federation later requires no constitutional amendment.

| DESIGN.md principle | Status in the single-repository implementation |
| --- | --- |
| 1. A branch is a thought | **Active.** Every agency response opens `think/<settlement>/<agency>/…`. |
| 2. A pull request is a settlement | **Active.** Every settlement is a draft PR with a `settlement: stl-…` label. |
| 3. A merge is an action | **Active.** Nothing is done until merged through the loop. |
| 4. Memory is committed history | **Active.** Everything cognitive lives under `.github-society-intelligence/memory/**` on `main`. |
| 5. Censors are branch protection | **Active.** Required status checks at the `main`-branch boundary. |
| 6. Critics are graduated | **Active.** PR reviews and checks form layered defence (fast heuristic → slow deliberation). |
| 7. The B-brain reads patterns, not content | **Active.** B-brains read commit/PR/label metadata only. |
| 8. A repository is an agency | **Latent.** Internally, *a directory under `agencies/` is an agency*. Its constitutional shape matches a future repository 1:1, so promoting it to its own repo later is a *move*, not a rewrite. |
| 9. A channel is a settlement | **Latent.** Inter-agency boundaries within the repo are themselves settlements via PRs that touch only the contract-shaped files. |
| 10. A bridge is an agency, not a utility | **Latent.** Translators live under `agencies/bridges/<x>-to-<y>/`, never inside the agencies they connect. |
| 11. A federation settlement spans repositories | **Latent.** Intra-repo "federation settlements" span directories under the same shared settlement ID. The same ID-and-label discipline works unchanged when the directories later become repositories. |
| 12. The ledger is append-only | **Active.** `memory/ledger/` is append-only, enforced by a censor; corrections are reversing entries. |
| 13. Reputation is a consequence of credit assignment | **Active.** Reputation is computed from `memory/credit-assignment/**`. |
| 14. The economic layer is last, never first | **Active.** The ledger directory may exist; *monetary* mode is disabled until the maturity contract holds. |

The single-repo implementation is the place where principles 1–7 must demonstrably hold *before* the federation principles 8–14 are exercised across repository boundaries. Until then, principles 8–14 are honoured by **not violating them inside the repo** — no agency may bypass the inter-agency settlement loop even though the directories sit next to each other on disk.

---

## 3. The reflective discipline becomes the directory layout

DESIGN.md §3 lists twelve reflective disciplines. Each one becomes a concrete directory and a workflow step under `.github-society-intelligence/`:

| Discipline (DESIGN.md §3) | Where it lives in `.github-society-intelligence/` |
| --- | --- |
| Frames before K-lines | `memory/frames/` (loaded first), `memory/klines/` (activated only after a frame is selected) |
| Recognition before reconstruction | `memory/recognition-index/` consulted before any retrieval-augmented call |
| Representation discipline for every artifact | Every YAML carries a `representation_class:` field; a censor rejects PRs that introduce artifacts without one |
| Settlements as transframes with provenance, unknowns, blind spots | `settlements/<id>.yaml` schema with `transframe.before`, `transframe.after`, `unknowns`, `blind_spots` |
| Runtime windows with fail-closed behaviour | `state/windows/<settlement-id>/` opens/closes per workflow; missing inputs fail closed |
| Attention and resource budgets | `settlements/<id>.yaml` carries `budgets.{calls,seconds,cost,bridges}`; censor fails on overrun |
| Consolidation windows before memory promotion | `memory/consolidation-queue/` holds artifacts until window closes |
| Full-loop credit assignment | `memory/credit-assignment/<settlement-id>.yaml`; required for settlement closure |
| Differentiation before retirement | `agencies/<x>/` forked under `agencies/_bootstrap/<x>-<variant>/` before any retirement |
| Concept formation with examples and non-examples | `memory/concepts/<c>.yaml` requires both `examples:` and `non_examples:` non-empty |
| Plural self-models, slow self-ideals | `state/self-models/` (plural, fast) and `state/self-ideals/` (small set, slow, CODEOWNER-restricted) |
| Plural B-brains that observe but cannot merge | `agencies/b-brains/<role>/` with `may_merge: false` in their constitution |

The discipline is enforced by the workflow steps and the censor checks. Without those, the directory layout is decorative. **The directories are necessary; the checks are what make them load-bearing.**

---

## 4. Minsky's vocabulary, mapped twice

DESIGN.md §4 maps every Society-of-Mind concept onto both a single-repository and a cross-repository primitive. The single-repository implementation uses the *first column* of that table directly, and re-uses the *second column* by collapsing "repository" into "directory":

| SoM concept | DESIGN.md "within one repository" | This implementation's single-repo realisation |
| --- | --- | --- |
| Agent | A handler inside an agency directory | A function/script under `agencies/<x>/handlers/` |
| Agency | A directory with `constitution.yaml` | `agencies/<x>/constitution.yaml` |
| Society | One repository hosting many agencies | The whole `.github-society-intelligence/` folder |
| Frame | `memory/frames/<frame>.yaml` | Identical |
| K-line | `memory/klines/<k>.yaml` | Identical; K-lines may name *agencies* in other directories under the same repo |
| Stimulus | Issue / comment / push / schedule | Identical |
| Settlement | The PR conversation | Identical, with an explicit `settlements/<id>.yaml` artifact merged at closure |
| Action | Merge into `main` | Identical |
| Memory | Files under `memory/**` on `main` | Identical |
| Critic | Required PR review or check | Identical |
| Censor | Required branch-protection check | Identical |
| Suppressor | Output-boundary catch | Identical, captured under `memory/suppressor-catches/` |
| Bridge | Translator agency between two representation classes | A *bridge agency*, lives at `agencies/bridges/<x>-to-<y>/`, owned by neither side, with declared lossiness and round-trip tests |
| Self-model | `state/self-models/` | Identical |
| Self-ideal | `state/self-ideals/` | Identical, CODEOWNER-protected |
| Constitution | `constitution.yaml` at agency and society roots | Identical |

What DESIGN.md says of federation primitives (the second column) is honoured by this implementation in *inert form*: an inter-agency channel YAML exists at `agencies/<x>/channels/<provider>.yaml`, but the "dispatch" it controls is an in-repo workflow trigger, not a `repository_dispatch`. The contract shape is unchanged. The settlement shape is unchanged. The audit shape is unchanged. Only the transport differs — and the transport is the *cheapest* thing to swap when the federation arrives.

---

## 5. The cognitive loop, in one repository

DESIGN.md §5 specifies the loop as the same shape inside every repository, with the federation arc added when delegation is needed. In the single-repository implementation, **the delegation arc is folded inward**: "delegate via Society Channel" becomes "delegate to a sibling agency under the same constitution, via the same settlement discipline".

```text
stimulus (issue / comment / push / schedule)
  → event normalisation              (workflow: perceive.yml)
  → perception                       (workflow: perceive.yml)
  → recognition (local memory)       (memory/recognition-index/)
  → frame selection                  (memory/frames/)
  → analogy fallback                 (memory/analogies/)
  → K-line activation and inhibition (memory/klines/)
  → budgeted local agency response   (think/<settlement>/<agency>/ branches)
  → critic and censor windows        (PR reviews + required status checks)
  → settlement as transframe         (settlements/<id>.yaml)
  → (decision: is this within our authority and capability?)
       ↳ if yes: merge to main
       ↳ if no : delegate via inter-agency channel
                   → discovery against `services/registry.yaml`
                   → contract check on `agencies/<x>/channels/<y>.yaml`
                   → budget and payment-censor check
                   → outbound censor on payload
                   → in-repo workflow trigger to provider agency
                   → bridge agency translation (if vocabularies differ)
                   → provider-side input-rights censor
                   → provider-side local loop
                   → response through the same channel artifact
                   → output-rights validation
                   → consolidation window
                   → import to local memory under provenance
                   → credit assignment to provider, channel, bridge
                   → ledger update + reputation update + dispute window opens
  → outcome observation
  → memory promotion (after consolidation window)
  → fine-grained credit assignment
  → differentiation, retirement, or concept formation
  → B-brain ecology observation
```

The decisive ordering rules from DESIGN.md hold unchanged:

- **Delegation is a settlement, not a code path.** Even within one repo, an agency calling another agency does so by opening an inter-agency settlement PR — never by importing the other agency's code.
- **Discovery before contract.**
- **Contract before budget.**
- **Budget before censor.**
- **Censor before dispatch.**
- **Bridge before vocabulary collision.**
- **Consolidation before memory import.**
- **Reputation update only after a dispute window has elapsed.**

The properties DESIGN.md attributes to the loop — that every step is observable, that every step is revertable, that every step is reviewable, that every step is fail-closed — are properties of the workflows and checks, not the transport. They survive intact when the transport is in-repo.

---

## 6. Repository roles become directory roles

DESIGN.md §6 distinguishes ten repository roles. In the single-repository implementation, each becomes a **top-level directory under `.github-society-intelligence/`** with the same purpose, the same authority constraints, and the same forbidden actions. The directory is governed by its own CODEOWNERS entry; CODEOWNERS does the work that "owner of a separate repo" does in DESIGN.md.

| DESIGN.md role | Realisation in this implementation | Forbidden actions |
| --- | --- | --- |
| Agency repo | `agencies/<x>/` | Modify any file outside its own directory except by opening a settlement PR |
| Critic repo | `critics/<x>/` (or `agencies/<x>/` with a `role: critic` declaration) | Merge anything |
| Censor repo | `censors/<x>/` plus the GitHub Actions check that enforces it | Be bypassed by a proposing agency — required status checks are mandatory |
| Memory repo | `memory/` and its sub-directories | Be mutated outside the consolidation settlement process |
| Governance repo | `governance/` (constitution, authority registry, rights registry, self-ideals, approval gates) | Act on stimuli — its workflows only *speak* |
| Workspace repo | `workspace/` (active settlements, focus) | Run agencies; it points at them |
| Service repo | `services/` (contracts, output artifacts) | Carry private state across calls |
| Bridge repo | `agencies/bridges/<x>-to-<y>/` | Be embedded inside another agency's directory |
| Ledger repo | `memory/ledger/` (append-only entries, reputation, disputes, monthly statements) | Be edited destructively; corrections are reversing entries |
| Bootstrap / dormant repo | `agencies/_bootstrap/<x>/` | Take revenue-bearing or irreversible action during bootstrap |

The rule from DESIGN.md §6 — *"if a role's outputs need to be inspected, audited, censored, or paid for independently, those roles should live in separate repositories"* — is satisfied here by **separate top-level directories under separate CODEOWNERS rules with separate required checks**. The day a role's outputs really do need cross-organisation audit, the directory is **moved**, not rewritten. Its constitution, its memory, its credit-assignment records, its self-model and its history travel with it.

---

## 7. The "three-repo minimum federation" becomes a three-tier directory layout

DESIGN.md §7 specifies a minimum viable federation of three repositories — `<name>-intelligence` (human doorway + governance), `<name>-society` (cognitive society), `<name>-labour` (code doorway / execution). The single-repository implementation collapses these into **three top-level concerns inside the same repository**, separated by directory and by CODEOWNERS, not by org:

```text
<repo>/
├── .github/workflows/                          ← labour (execution surface, runners, adapters)
│   └── github-society-intelligence-agent.yml
└── .github-society-intelligence/
    ├── governance/                             ← intelligence (constitution, authority, approvals)
    │   ├── constitution.yaml
    │   ├── authority-registry.yaml
    │   ├── rights-registry.yaml
    │   ├── self-ideals.yaml
    │   ├── approval-gates/
    │   └── commands/
    ├── agencies/                               ← society (the cognitive layer)
    │   ├── b-brains/<role>/
    │   ├── bridges/<x>-to-<y>/
    │   ├── _bootstrap/<x>/
    │   └── <x>/
    │       ├── constitution.yaml
    │       ├── handlers/
    │       ├── channels/<y>.yaml
    │       └── state/
    ├── critics/<x>/
    ├── censors/<x>/                            ← each has a paired required-check action
    ├── suppressors/<x>/
    ├── memory/
    │   ├── events/
    │   ├── episodic/
    │   ├── semantic/
    │   ├── procedural/
    │   ├── failure/
    │   ├── frames/
    │   ├── analogies/
    │   ├── concepts/
    │   ├── klines/
    │   ├── decisions/
    │   ├── recognition-index/
    │   ├── consolidation-queue/
    │   ├── credit-assignment/
    │   ├── suppressor-catches/
    │   └── ledger/                             ← append-only entries, reputation, disputes
    ├── services/
    │   ├── registry.yaml
    │   └── contracts/<service>.v<N>.yaml
    ├── workspace/
    │   ├── active-settlements/<id>.yaml
    │   └── focus.yaml
    ├── settlements/<id>.yaml                   ← one per settlement, merged at closure
    └── state/
        ├── self-models/
        ├── self-ideals/                        ← CODEOWNER-restricted
        ├── windows/<settlement-id>/
        └── observability/
```

The DESIGN.md §7 "collapse rule" — *"everything cognitive or operational lives in one of three repos … six locations, three pairs, one installation"* — is preserved here as **two locations, one installation**: `.github/workflows/` and `.github-society-intelligence/`. Removing either disables the agent at the next workflow run. *Presence is permission; absence is denial* holds unchanged.

The single-repository implementation also preserves the DESIGN.md property that a future split into `-intelligence`, `-society`, `-labour` is a *move* operation: the `.github/workflows/` directory becomes the labour repo, `governance/` plus `commands/` becomes the intelligence repo, and the rest becomes the society repo. The constitutions, CODEOWNERS, and required checks carry over unchanged.

---

## 8. The Society Channel Protocol, as an *inter-agency* protocol

DESIGN.md §8 specifies a governed cognitive transaction between two repositories. The same protocol applies, unchanged in shape, to a governed cognitive transaction between two **agencies in the same repository**. Every stage that DESIGN.md realises with a GitHub *primitive* across repos has a faithful in-repo analogue:

| DESIGN.md stage | DESIGN.md cross-repo realisation | This implementation's intra-repo realisation |
| --- | --- | --- |
| Service discovery | Release in governance repo, naming pinned contract releases | A tagged commit on `main` touching `services/registry.yaml`, naming pinned contract files at specific commit SHAs |
| Contract acceptance | PR in requester's society repo merging `channels/<provider>.yaml` | PR in this repo merging `agencies/<requester>/channels/<provider>.yaml` against a contract file SHA |
| Outbound censorship | Required check on dispatch-emitting PR | Same: a `censor/cloud-egress` required check that runs on PRs touching `agencies/<requester>/channels/**` and on any PR triggering an in-repo channel call |
| Dispatch | `repository_dispatch` with payload hash + contract SHA | An in-repo workflow trigger (workflow_run / workflow_dispatch) carrying the same payload hash + contract SHA |
| Bridge translation | Bridge repo emits translated dispatch + translation record | Bridge agency under `agencies/bridges/<x>-to-<y>/` emits a translation file under its own `translations/` directory |
| Input rights | Required check on provider's intake workflow | Required check on the provider agency's intake workflow, identical shape |
| Provider deliberation | Full local loop inside provider repo | Full local loop inside the provider's directory (own `think/` branches, own settlement PR) |
| Output | Release + signed dispatch back | A commit on `main` under `agencies/<provider>/outputs/` + an in-repo workflow trigger back |
| Output validation | Required check on consumer consolidation PR | Same |
| Payment / credit | PR in ledger repo creates append-only entry | PR touching `memory/ledger/entries/<tx>.yaml` with the same shape |
| Satisfaction | Second PR in ledger repo after dispute window | Same |
| Audit | Commits, PRs, releases, dispatches across repos | Commits, PRs, tags, workflow runs across directories — same git history, fewer repos |
| Dispute | Issue in `disputes` repo, 30-day window | Issue in this repo with `dispute: tx-…` label, 30-day window, owned by `governance/` CODEOWNERS |

The channel contract YAML from DESIGN.md §8.2 is used **unchanged**. The `channel_id`, `contract_release`, `service_id`, `input.accepted_classes`, `input.forbidden_classes`, `output.retention_rights`, `economy.mode`, `governance.censors_required_on_requester`, `governance.censors_required_on_provider`, `governance.dispute_window_days` — every field is meaningful inside a single repo. When the federation arrives, the `channel_id` namespace expands; nothing else changes.

This is the *load-bearing* claim of the single-repository implementation: **the protocol does not weaken when the transport shrinks**. It would weaken only if we stopped requiring the censors, dropped the contract pinning, skipped the consolidation window, or stopped writing the audit. None of those are concessions DESIGN.md permits, and none are concessions this implementation makes.

---

## 9. Bridges live in their own directory, never inside an agency

DESIGN.md §9 insists a bridge is an agency, not a utility. The single-repository implementation honours this with a hard layout rule:

> **No file under `agencies/<x>/` may perform a translation between two `representation_class` values.** All such translations live under `agencies/bridges/<source>-to-<target>/` with:
>
> - `constitution.yaml` declaring the direction (X→Y is one directory; Y→X is another),
> - `declared_lossiness:` envelope,
> - `round_trip_tests/` whose pass status is a required check on any settlement that names this bridge,
> - `translations/<id>.yaml` archive with `representation_class: translation_record`,
> - `state/drift-history.yaml` with rolling drift measurements,
> - `status:` ∈ {`candidate`, `probation`, `active`, `superseded`, `retired`}.

The bridge-probation behaviour from DESIGN.md §9 is enforced by a required check (`censor/bridge-probation`) that fails any settlement PR which names a bridge currently in probation, *unless* the settlement also references a documented alternative bridge or escalates to human approval.

Bridges sit in their own subtree precisely so a critic or B-brain can inspect *the translator* without entering the agencies that depend on it. The anti-pattern DESIGN.md §23 names — *"bridge inside an agency"* — is structurally impossible here: a PR adding a translation file under `agencies/<x>/` fails a layout-lint required check.

---

## 10. Settlements span directories the way federation settlements span repositories

DESIGN.md §10 defines a federation settlement as a thread of settlements bound by a shared settlement ID. In the single-repository implementation, the same shared-ID discipline binds settlements across **directories**:

```text
stl-2026-05-26-001                    ← shared settlement ID

PR #142 (lead)                        ← lead settlement
  label: settlement: stl-…
  label: federation: lead             ← retained: today it spans directories;
                                         tomorrow the same label spans repos
  changes:
    agencies/contract-bee/state/...
    settlements/stl-2026-05-26-001.yaml

PR #143 (provider-side)               ← provider settlement
  label: settlement: stl-…
  label: federation: provider
  changes:
    agencies/finance-helper/outputs/...

PR #144 (bridge)                      ← bridge transaction
  label: settlement: stl-…
  label: federation: bridge
  changes:
    agencies/bridges/contract-to-dental/translations/12.yaml

PR #145 (ledger)                      ← payment / reputation
  label: settlement: stl-…
  label: federation: ledger
  changes:
    memory/ledger/entries/tx.2026.0123.yaml
```

The federation `settlement.yaml` from DESIGN.md §10.2 is created at `settlements/stl-2026-05-26-001.yaml` and lists each participating PR. The closure rules from DESIGN.md §10.3 — *all participating PRs close together*, *no partial merge*, *non-compromise across providers*, *depth limit on delegation*, *credit-assignment record per participant* — are enforced by a required check (`censor/settlement-closure`) that refuses to merge the lead PR until all participant PRs have either merged or been recorded as fail-closed.

This is the moment where the constitutional discipline of DESIGN.md most clearly translates without loss. A settlement that spans three directories in this repository is the same shape as a settlement that will one day span three repositories in an organisation. The CODEOWNERS lists differ; the workflow triggers differ; nothing about the *constitutional artifact* differs.

---

## 11. Insulation across directories

DESIGN.md §11 declares insulation a federation rule. In the single-repository implementation it becomes a **directory rule with the same enforceability**:

```yaml
intra_repo_insulation:
  private_by_default: true
  shared_only_by:
    - settled_main_commit                       # equivalent to "settled_release"
    - in_repo_workflow_trigger_with_pinned_contract
    - approved_memory_import
    - explicit_bridge
  forbidden_direct_state_sharing:
    - from: agencies/finance-helper/
      to:   agencies/contract-bee/
      reason: prevent supplier-pricing model from contaminating obligation extraction
    - from: any
      to:   memory/ledger/
      reason: ledger entries are produced only by the ledger's own settlement
  forbidden_cross_directory_writes:
    - any PR that writes outside the proposer's declared directories without a
      cross-directory settlement label
```

Enforcement is achieved with three mechanisms already available on GitHub:

1. **CODEOWNERS per directory.** A PR touching `memory/ledger/**` requires review by the ledger CODEOWNERS, regardless of who opened it.
2. **A required check `censor/cross-directory-write`** that fails any PR whose changed files cross declared insulation boundaries unless the PR carries a `settlement: stl-…` label and a settlement YAML that lists the crossing.
3. **A required check `censor/append-only`** on `memory/ledger/**` that fails any PR mutating or deleting existing entries.

The rule from DESIGN.md §11 — *"a repository may consume another's released outputs, never depend on its unreleased working state"* — becomes: **an agency may consume another agency's `main`-merged outputs, never depend on another agency's open think-branches or unmerged settlements.** A PR that imports artifacts from a `think/` branch fails a required check.

The permitted and forbidden lists in DESIGN.md §11.1 and §11.2 translate one-for-one. The forbidden list is structurally enforced rather than discouraged; this is the single biggest *advantage* of the single-repository implementation over a federation: no cross-org credential is even available, so the anti-patterns *"`helper` service accounts with admin scope across repos"* and *"workflow run from one repo that mutates another repo's main via a deploy token"* cannot occur.

---

## 12. Authority, identity, and the human anchor — in one repo

DESIGN.md §12 distinguishes six identity surfaces. The single-repository implementation uses a strict subset, sufficient for the discipline:

| DESIGN.md identity surface | This implementation |
| --- | --- |
| GitHub repository = agency | Replaced by: a directory under `agencies/` with its own `constitution.yaml` and CODEOWNERS entry |
| GitHub organisation = society | Replaced by: the whole repository |
| Signed commit | Required; enforced by a `censor/commit-signature` required check |
| Signed release | Replaced by: tagged commit on `main`, signed |
| GitHub App | The agent's GitHub App identity, scoped per directory by CODEOWNERS |
| OIDC token from Actions | Retained for any cloud step the labour layer takes |

The authority registry from DESIGN.md §12.2 lives at `governance/authority-registry.yaml` unchanged. Authorities reference directories where DESIGN.md references repositories. The `cannot_be_redelegated: true` field is enforced by a required check that fails any settlement PR proposing to redelegate an authority so marked.

The CODEOWNERS discipline from DESIGN.md §12.3 maps onto a per-file CODEOWNERS in this repo:

```text
governance/constitution.yaml          @named-human-owners
governance/authority-registry.yaml    @named-human-owners @at-least-one-other
governance/self-ideals.yaml           @named-human-owners @reviewer-rotation
state/self-ideals/                    @named-human-owners
memory/ledger/                        @ledger-owners
agencies/bridges/                     @bridge-owners
```

The self-ideals from DESIGN.md §12.3 are used **verbatim** as the starting set. They are the slowest-changing artifacts in the repo and are reviewed across multiple cycles before any edit lands.

---

## 13. Censors

DESIGN.md §13 lists nine cross-repository censors. The single-repository implementation runs all nine, with their scope narrowed from "the channel boundary between repositories" to "the boundary between directories that the settlement crosses":

| Censor | Where it runs in this implementation | What it blocks |
| --- | --- | --- |
| `censor/cloud-egress` | Required check on any PR that triggers an outbound network call from a labour workflow | Outbound payloads carrying forbidden classes |
| `censor/input-rights` | Required check on the provider agency's intake workflow | Inbound payloads carrying classes the provider's contract does not accept |
| `censor/payment` | Required check on dispatch-emitting PRs and on every ledger PR | Transactions above per-channel or per-window budget |
| `censor/delegation-depth` | Required check on every settlement PR | Delegation chains exceeding declared depth |
| `censor/credential` | Required check on every PR | Any commit containing credentials, tokens, or keys |
| `censor/pii` | Required check on every PR | PII crossing a boundary it is not authorised for |
| `censor/authority` | Required check on every settlement PR | Agencies acting beyond declared authority |
| `censor/bridge-probation` | Required check on settlement PRs naming a bridged channel | Use of a bridge currently in probation |
| `censor/reputation-floor` | Required check on outbound channel calls | Calls to providers below the repo's reputation floor |

Additionally, the single-repository implementation adds three censors that protect properties DESIGN.md takes for granted at the federation layer but which must be made explicit when everything shares a worktree:

- `censor/cross-directory-write` — fails PRs that cross insulation boundaries without a settlement label.
- `censor/append-only` — fails destructive edits to `memory/ledger/**` and to other append-only memory directories.
- `censor/representation-class` — fails any new memory artifact lacking a `representation_class:` field.

The fail-closed strengthening from DESIGN.md §13 — *"a channel censor that is offline at dispatch time means fail closed at the channel level"* — applies unchanged: a censor whose required check is unavailable blocks the settlement; there is no retry until the check is back online.

---

## 14. Suppressors

DESIGN.md §14 names five federation-level suppressors. The single-repository implementation provides their intra-repo analogues, each of which writes a `representation_class: suppressor_catch` artifact under `memory/suppressor-catches/`:

| Suppressor | Where it sits | What it learns |
| --- | --- | --- |
| Outbound payload suppressor | Inside any agency's outbound-payload assembly step | Reveals missing entries in `censor/cloud-egress` rules |
| Inbound payload suppressor | Inside the provider agency's intake step | Reveals missing entries in provider's `input-rights` contract |
| Output-rights suppressor | Inside the requester's import-from-output step | Reveals provider over-retention or under-redaction |
| Reputation-drift suppressor | Inside the ledger's reputation-update step | Reveals reputation reports exceeding the agreed envelope |
| Bridge-lossiness suppressor | Inside the bridge agency's translation step | Reveals translations exceeding declared envelope |

Each catch is paired with a learning proposal: a draft PR that proposes a new entry in the upstream censor's rule file. This is the mechanism by which the single-repo society *grows new censors instead of stacking exceptions* — exactly the property DESIGN.md attributes to federation suppressors.

---

## 15. Memory, in one repo

DESIGN.md §15 distinguishes memory inside a repository (files on `main`) from memory across repositories (signed, pinned releases imported under settlement). The single-repository implementation uses **both modes, both intra-repo**:

- **Local memory:** files under `memory/**` on `main`, with `representation_class`, temperature, links, and consolidation windows. Identical to DESIGN.md §15.
- **"Published" memory:** a *tagged commit* on `main` that names a snapshot of a memory subtree. Other agencies in the same repo "import" by opening a PR that pins that tag SHA under their own `imports/<source>/<tag>.yaml` with provenance:

```yaml
import_record:
  source_subtree: memory/frames
  source_tag: memory/frames@v2025.12-warm
  source_tag_sha: <40-hex>
  imported_at: 2026-01-04T12:00:00Z
  imported_by_settlement: stl-2026-01-04-005
  representation_classes_imported: [frame, kline]
  consolidation_window:
    closed_at: 2026-01-04T13:00:00Z
    required_inputs_received: [credit_assignment_record, introspection_record, critic_objection_window]
```

The memory rules from DESIGN.md §15.3 are honoured **strictly**:

- Memory imports are settlements (a PR with `settlement: stl-…`).
- Imported memory carries provenance forever.
- Imported memory enters at temperature `warm` at most.
- An agency never imports another agency's `failure/` memory as its own `episodic/` memory. Required check `censor/memory-class-import` enforces this.
- An agency never imports another agency's `self-model.*`. The same check enforces this.
- Imported K-lines must be re-weighted by local credit assignment before any reinforcement applies.

The dangerous failure mode DESIGN.md §15 warns against — *"one society's stale lesson becoming several societies' confident default"* — is exactly the failure mode the single-repository implementation must prevent across *agencies*. The check is the same shape; the surface area is smaller, which makes it cheaper to verify the check works.

---

## 16. Credit assignment

DESIGN.md §16 lists local and federation credit targets. The single-repository implementation records **both** sets of targets, with the federation targets renamed to *inter-agency*:

```text
local credit targets (per settlement):
  perception quality
  recognition quality
  frame choice
  analogy choice
  K-line activation
  inhibition decision
  agency proposal
  critic objection
  censor block
  suppressor catch
  settlement choice
  approval decision
  execution quality
  memory promotion

inter-agency credit targets (per inter-agency settlement):
  delegation decision
  provider-agency choice
  contract acceptance quality
  bridge-agency choice and lossiness handling
  outbound censor pass
  inbound censor pass
  provider response quality
  output-rights compliance
  consolidation of imported result
  ledger entry accuracy
  dispute outcome
  reputation update accuracy
```

Each credit record is a YAML file under `memory/credit-assignment/<settlement-id>.yaml`. A settlement does not close without one. This is enforced by a required check (`censor/credit-assignment`).

The rule from DESIGN.md §16 — *"reputation is a consequence of cumulative credit-assignment records, not a free-standing opinion"* — applies unchanged. Reputation that does not derive from credit-assignment records is rumour, and the repository uses no rumour for routing decisions.

---

## 17. The ledger and the economic layer — last, not first

DESIGN.md §17 makes the economic layer a Level 6 opt-in that may only follow verifiable Level 4 + Level 5 maturity. The single-repository implementation honours this with a **disabled-by-default ledger**:

- `memory/ledger/` exists from day one as a directory and a schema (because the *audit shape* must hold even when no money moves).
- `economy.mode: free` is the default for every channel contract.
- The `censor/payment` check is enabled and active from day one — its job is to refuse any transaction whose mode is not `free` until a governance settlement flips the maturity flag.
- The maturity flag at `governance/maturity.yaml` carries `economic_layer_enabled: false` until *every* checklist item from DESIGN.md §24 has held for at least one full quarterly cycle.

Ledger entries follow the schema from DESIGN.md §17.2 unchanged. The `append-only` censor enforces what DESIGN.md §17.5 calls the hard rule:

> Do not monetise routes the society cannot explain, censor, audit, or learn from.

A federation that turns on the economic layer prematurely is the Level-0 marketplace pretending to be a mind. A single-repository society that does so is the same anti-pattern at smaller scale, and the discipline is no weaker for being smaller.

---

## 18. B-brains, in one repo

DESIGN.md §18 lists seven federation-level B-brains. The single-repository implementation runs **all seven** as agencies under `agencies/b-brains/`, with their scope rewritten from "federation" to "repository":

```text
agencies/b-brains/
├── activation-steward/
├── memory-steward/
├── channel-steward/                 ← observes inter-agency channels
├── bridge-steward/                  ← observes bridge agencies
├── economic-steward/                ← inert until economic layer enables
├── governance-drift-monitor/
└── self-model-steward/
```

They observe metadata only — `read_content: false` is declared in each constitution and enforced by a required check that blocks any handler under `agencies/b-brains/**` from opening a file whose path matches a content directory. They watch:

- per-agency activation rates and drift,
- inter-agency channel call rates,
- bridge translation rates and drift,
- censor firing rates at directory boundaries,
- suppressor catches that suggest missing upstream censors,
- ledger spend per channel per window,
- single-agency dominance (one agency serving too many channels),
- delegation-depth distributions,
- repeat dispute counts per channel,
- governance amendment frequency per stability tier.

The output is a quarterly ecology report regenerated by scheduled workflow and version-pinned per quarter, stored at `state/ecology-reports/<yyyy>-Q<n>.md`. This is exactly the artifact DESIGN.md §18 names; the only difference is its scope.

The constitutional rule from DESIGN.md §18 — *"they may not merge structural changes themselves"* — is enforced by removing merge rights on any PR opened by a b-brain agency: their PRs require human review by `governance/` CODEOWNERS.

---

## 19. Observability

DESIGN.md §19 specifies a small set of observability signals emitted by ordinary workflow steps writing to `state/observability/`. The single-repository implementation emits the same signals, all of them meaningful when channels are inter-agency:

| Surface | Signal | Healthy direction |
| --- | --- | --- |
| Channels | `outbound_call_rate_per_channel` | Stable share; spikes per channel indicate over-reliance |
| Channels | `inbound_call_rate_per_service` | Diversity of requesters |
| Channels | `channel_censor_block_rate` | Non-zero (zero usually means a censor is asleep) |
| Channels | `channel_failure_rate_by_cause` | Every cause class represented, none collapsing into "unknown" |
| Bridges | `bridge_drift_per_cycle` | Inside envelope; trending toward zero |
| Bridges | `bridge_round_trip_test_pass_rate` | 100% |
| Memory | `memory_import_rate_by_class` | Rising imports of `frame`/`analogy` is healthy; rising imports of `self_model` is forbidden |
| Memory | `memory_import_consolidation_window_breach_rate` | Trend toward zero |
| Ledger | `dispute_open_count_by_channel` | Trend toward zero |
| Ledger | `reputation_drift_within_envelope_rate` | 100% |
| Repo | `delegation_depth_distribution` | Most depth-1; depth-3 rare; depth-4+ should not exist |
| Repo | `non_compromise_event_count` | MUST be zero |
| Repo | `monarch_agency_share` | No single agency may serve more than the constitutionally declared share without governance review |
| Repo | `governance_amendment_rate_by_tier` | Slow tiers stay slow |

The substrate is again the repository itself. No external observability stack is required. The B-brain ecology report rolls these up; the quarterly review is the moment they become *acted on*.

---

## 20. Evolution

DESIGN.md §20 names three evolutionary mechanisms: differentiation by fork, merge of converged repositories, and reviewed retirement. The single-repository implementation supports all three at the directory scale:

- **Differentiation by fork** ⇒ when an agency under `agencies/<x>/` shows double-purpose pressure, the meta-admin layer (a B-brain) opens a settlement that copies the directory to `agencies/_bootstrap/<x>-variant-a/` and `agencies/_bootstrap/<x>-variant-b/` under bootstrap protection: reduced authority, increased introspection, no economic actions, side-by-side trial window, explicit rollback plan in `governance/`. After the trial window: successful forks are promoted out of `_bootstrap/`; unsuccessful forks are retired (their directories archived, their git history readable but unreferenced); the parent is either superseded or retained.
- **Merge of converged agencies** ⇒ a merge settlement is allowed when credit-assignment records show overlapping competence and overlapping criticism patterns. The merged agency keeps both parents as `merged_from:` links in its constitution.
- **Retirement** ⇒ a settlement, not a deletion. A retired agency is archived under `agencies/_archive/<x>/`; its outstanding service contracts are revoked through dispute-window-aware settlements; its memory subtree is pinned to its final tag; it remains readable; channels referencing it surface a deprecation warning and require a governance settlement to continue.

The rule from DESIGN.md §20.3 — *"nothing is ever silently removed; removal is itself a reviewed, reverted-if-needed act"* — applies unchanged.

---

## 21. Body, brain, mind — without "federation"

DESIGN.md §21 distinguishes Body / Brain / Mind / Federation. In the single-repository implementation, the first three layers are present and explicit; the fourth is **honoured as latent**:

| Layer | GitHub realisation in this implementation | Role |
| --- | --- | --- |
| **Body** | `.github/workflows/`, runners, tokens, branch protection, commits, tags | Executes and constrains within this repository |
| **Brain** | Classifiers, retrieval, embedding indexes living under `agencies/<x>/state/` | Produces candidate patterns |
| **Mind** | Settlements, critics, censors, constitutions, memory promotion, self-ideals | Governs meaning and authorisation |
| **Federation** | *(latent)* the inter-agency channel protocol is already in place; only the transport changes when a federation later materialises | (not yet exercised across repositories) |

The boundary statements DESIGN.md §21 makes about not confusing operational connectivity, cognitive depth, and economic activity apply *inside the single repository as well*. A merged settlement is not wisdom — it is one settlement inside a repository of accountable relationships, recorded for review. A high-reputation agency is not authoritative — it is an agency whose recent credit-assignment record is favourable. A ledger entry is not money — it is a signed commitment to a recorded view of an exchange, subject to a dispute window.

---

## 22. The single-repository layout that delivers the above

This is the layout the implementation produces. Everything DESIGN.md §22 puts under multiple repository roots lives here under a single root:

```text
<repo>/
├── .github/workflows/
│   ├── github-society-intelligence-agent.yml       ← existing entrypoint, kept
│   ├── perceive.yml
│   ├── activate.yml
│   ├── critique.yml
│   ├── censor.yml
│   ├── settle.yml
│   ├── consolidate.yml
│   ├── observe.yml
│   ├── delegate.yml                                ← inter-agency channel transport
│   └── import-memory.yml
└── .github-society-intelligence/
    ├── constitution.yaml                           ← society constitution
    ├── representation.yaml
    ├── insulation-map.yaml
    ├── maturity.yaml                               ← gates the economic layer
    ├── governance/
    │   ├── constitution.yaml
    │   ├── authority-registry.yaml
    │   ├── rights-registry.yaml
    │   ├── self-ideals.yaml
    │   ├── approval-gates/
    │   └── commands/
    ├── agencies/
    │   ├── b-brains/{activation,memory,channel,bridge,economic,governance-drift,self-model}-steward/
    │   ├── bridges/<source>-to-<target>/
    │   ├── _bootstrap/<x>/
    │   ├── _archive/<x>/
    │   └── <x>/
    │       ├── constitution.yaml
    │       ├── handlers/
    │       ├── channels/<y>.yaml
    │       └── state/
    ├── critics/<x>/
    ├── censors/
    │   ├── cloud-egress/
    │   ├── input-rights/
    │   ├── payment/
    │   ├── delegation-depth/
    │   ├── credential/
    │   ├── pii/
    │   ├── authority/
    │   ├── bridge-probation/
    │   ├── reputation-floor/
    │   ├── cross-directory-write/
    │   ├── append-only/
    │   └── representation-class/
    ├── suppressors/<x>/
    ├── memory/
    │   ├── events/
    │   ├── episodic/
    │   ├── semantic/
    │   ├── procedural/
    │   ├── failure/
    │   ├── frames/
    │   ├── analogies/
    │   ├── concepts/
    │   ├── klines/
    │   ├── decisions/
    │   ├── recognition-index/
    │   ├── consolidation-queue/
    │   ├── credit-assignment/<settlement-id>.yaml
    │   ├── suppressor-catches/
    │   └── ledger/
    │       ├── entries/
    │       ├── reputation/
    │       ├── disputes/
    │       └── monthly-statements/
    ├── services/
    │   ├── registry.yaml
    │   └── contracts/<service>.v<N>.yaml
    ├── imports/<source>/<tag>.yaml
    ├── workspace/
    │   ├── active-settlements/<id>.yaml
    │   └── focus.yaml
    ├── settlements/<id>.yaml
    └── state/
        ├── self-models/
        ├── self-ideals/
        ├── windows/<settlement-id>/
        ├── observability/
        └── ecology-reports/<yyyy>-Q<n>.md
```

Two locations, one installation: `.github/workflows/` and `.github-society-intelligence/`. Removing either disables the agent. This is the single-repository preservation of DESIGN.md's *"presence is permission; absence is denial"* discipline.

---

## 23. Anti-patterns DESIGN.md names — and how the single-repository implementation prevents them *at smaller scale*

| DESIGN.md anti-pattern | Single-repository analogue | Structural prevention |
| --- | --- | --- |
| Federation cancer (cross-repo entanglement without channels) | **Directory cancer**: PRs that touch many directories without an inter-agency settlement | `censor/cross-directory-write` blocks unlabelled cross-directory PRs |
| Service swamp | Many handlers exposed without contracts | `services/registry.yaml` is the only discovery surface; handlers not in the registry cannot be addressed |
| Bridge inside an agency | Translator file under `agencies/<x>/` | Layout-lint required check forbids `representation_class: translation_record` outside `agencies/bridges/**` |
| Sovereign mediator | One agency that decides for all | B-brain `monarch_agency_share` metric raises a governance review when a single agency exceeds the constitutionally declared share |
| Reputation laundering | A low-reputation agency serving requests through a higher-reputation proxy | Provenance fields on every output name the *originating* agency, not the proxy |
| Ledger drift | Overwriting entries | `censor/append-only` fails any non-additive change to `memory/ledger/**` |
| False federation | Many directories owned by one person, rubber-stamping each other | CODEOWNERS rotation requirement on cross-directory settlements |
| Memory poisoning | Importing failure as episodic; importing self-model | `censor/memory-class-import` blocks both |
| Economic acceleration before cognition | Enabling `economy.mode: currency` before maturity | `censor/payment` refuses non-`free` modes until `governance/maturity.yaml` flips the flag |
| Settlement bypass via dispatch | Triggering a workflow that mutates `main` without a settlement PR | Branch protection requires the PR; `censor/settlement-closure` enforces the settlement record |
| Bridge probation skipped | Continuing to use a probation bridge | `censor/bridge-probation` fails settlements naming a probation bridge unless an alternative is named |
| Silent retry across the federation | Repeating a failed call under a new settlement ID without citing the failure | `censor/silent-retry` fails any settlement that doesn't cite the prior failure record when its channel-id+contract-release+payload-hash matches a recent failure |
| Constitution amendment by velocity | Frequent low-friction edits to slow-tier law | CODEOWNERS rotation + governance B-brain raises a review when amendment rate exceeds tier envelope |

All thirteen of DESIGN.md §23's anti-patterns map onto failures the single-repository implementation can *structurally* prevent. None require a federation to expose; all can be exercised and prevented before any second repository exists.

---

## 24. The maturity contract, at single-repository scale

DESIGN.md §24 specifies the maturity contract a federation must meet to claim compliance. The single-repository implementation must meet a closely-parallel contract before it claims compliance with DESIGN.md as its first implementation:

- [ ] every agency directory under `agencies/` has a `constitution.yaml`, a CODEOWNERS entry, required-check coverage, and reflective discipline (frames, K-lines, analogies, settlements, suppressors, consolidation windows, credit assignment, plural self-models, slow self-ideals, plural B-brains under `agencies/b-brains/`);
- [ ] every inter-agency interaction is a settlement with a pinned contract file SHA;
- [ ] every inter-agency channel has at least one required censor on each side (typically `cloud-egress` outbound, `input-rights` inbound);
- [ ] every cross-vocabulary inter-agency channel routes through a bridge agency with passing round-trip tests;
- [ ] intra-repo insulation is declared in `.github-society-intelligence/insulation-map.yaml` and the forbidden cross-directory writes are not present in practice;
- [ ] every inter-agency settlement carries a shared settlement ID across all participating PRs;
- [ ] no inter-agency settlement closes with a partial merge;
- [ ] memory imports across directories pass through a consolidation window;
- [ ] no agency imports another agency's `failure/` memory as its own `episodic/`, or another agency's `self-model`;
- [ ] credit-assignment records exist for every inter-agency transaction and name the provider agency, the bridge agency (if any), and the censors that fired;
- [ ] an ecology report is generated quarterly and reviewed by humans named in `governance/` CODEOWNERS;
- [ ] self-ideals exist under `state/self-ideals/`, are slow-tier protected, and are cited by high-impact settlements;
- [ ] the economic layer remains disabled until the above hold for at least one full quarterly review cycle;
- [ ] the ledger is append-only and its `append-only` censor is enforced as a required check;
- [ ] disputes use a 30-day window and reputation does not move during disputes;
- [ ] differentiation by fork has been exercised at least once at directory scale, and at least one fork has been either promoted or retired through settlement;
- [ ] retirement of any agency is a settlement, not a deletion.

A single-repository implementation that meets this list satisfies DESIGN.md's Stage 1 of the bootstrap path *for one of the federation's eventual members*. It is therefore the **enabling precondition** for everything DESIGN.md §28 specifies after Stage 1.

---

## 25. Worked example — the contract-renewal loop, in one repo

The federated example from DESIGN.md §25 maps onto the single-repository implementation directly. Where DESIGN.md names a separate repository, this implementation names a directory.

Federation members → directory members:

- `<org>/contract-society` → `agencies/contract-bee/`
- `<org>/finance-society` → `agencies/finance-helper/`
- `<org>/dental-compliance-society` → `agencies/dental-compliance-checker/`
- `<org>/contract-to-dental-bridge` → `agencies/bridges/contract-to-dental/`
- `<org>/federation-governance` → `governance/`
- `<org>/federation-ledger` → `memory/ledger/`

The stimulus arrives as an issue with a contract PDF. The loop runs exactly as DESIGN.md §25 specifies, with these adjustments:

1. **Stimulus, perception, recognition, frame selection, K-line activation, budget, local thought-branches** — unchanged. The frame `frame.contract-renewal` is selected with the same provenance; the K-line names two inter-agency services rather than two inter-repo ones.
2. **Delegation decisions** open two inter-agency PRs: one to `agencies/finance-helper/` directly, one to `agencies/bridges/contract-to-dental/`.
3. **Channel preparation** pins contract file SHAs under `agencies/contract-bee/channels/finance-helper.yaml` and `…/dental-compliance-checker.yaml`. The bridge is at `agencies/bridges/contract-to-dental@<tag-sha>`.
4. **Outbound censorship** runs as a required check on the PR opening the channel call. The supplier identity is caught by `censor/cloud-egress` in exactly the same way DESIGN.md §25 step 8 describes; the settlement records the block as a learning event and re-attempts with redacted supplier identity.
5. **Dispatch** is an `workflow_dispatch` / `workflow_run` trigger in this repo carrying the same payload-hash + contract-SHA fields a federation `repository_dispatch` would carry.
6. **Bridge translation** runs inside `agencies/bridges/contract-to-dental/`, with drift recorded under `agencies/bridges/contract-to-dental/translations/<id>.yaml` and `state/drift-history.yaml`.
7. **Provider deliberation** runs the full local loop inside `agencies/dental-compliance-checker/` and `agencies/finance-helper/`. Each settles, each emits output under its own `outputs/` directory.
8. **Output validation, consolidation, local settlement closure, approval gate, action** — unchanged in shape. The contract-bee lead PR merges after CODEOWNER approval (legal-escalation).
9. **Ledger** PRs open under `memory/ledger/entries/tx.2026.0123.yaml` and `…/0124.yaml`. The mode is `reciprocal` (the maturity flag has not enabled `currency`).
10. **Reputation** is not updated; it waits for the 30-day dispute window.
11. **Credit assignment** records are written under `memory/credit-assignment/stl-2026-05-26-001.yaml` — naming the frame, the proposer agency, the providers, the bridge, the censors that fired, and the critics that improved the proposal.
12. **B-brain observation** records the activation pattern in `state/observability/`; the quarterly ecology report rolls it up.
13. **Differentiation signal** — the meta-admin B-brain notes that `agencies/contract-bee/` is serving two distinct competence regions and opens a settlement proposing a fork to `agencies/_bootstrap/contract-bee-dental-variant/` under bootstrap protection.
14. **30 days later** — no dispute. Reputation updates apply within envelope; the reputation-drift suppressor does not fire.

That is one complete loop. Every cross-directory interaction is a settlement. Every inter-agency transaction is signed, censored, audited, and either credited or disputed. The repository learns not only what to do, but *which of its own agencies to ask*, with what contract, through which bridge, at what reputation, and at what cost — all without leaving the single repository, and all in a shape that lifts unchanged into a federation when the time comes.

---

## 26. What this single-repository implementation deliberately does *not* do

In the same spirit as DESIGN.md §26, the single-repository implementation explicitly declines:

- **Open discovery beyond the local registry.** Agencies discover each other only through `services/registry.yaml`. There is no scanning of the repo for handlers.
- **Automatic agency-constitution import.** A new agency's constitution is written and reviewed locally, never copied from another.
- **Automatic bridge synthesis.** Bridges are written and reviewed; not auto-generated between representations.
- **Automatic memory merging across agencies.** A consumer never merges two providers' memories without local settlement.
- **Constitution amendments by automation.** Governance edits remain CODEOWNER-anchored at every tier.
- **Real-currency settlement.** `economy.mode: currency` is gated on the maturity flag and a governance settlement.
- **Cross-agency self-models.** Self-models are non-portable by rule; a B-brain that reads a self-model belonging to another agency fails a required check.
- **Reputation thresholds replacing CODEOWNERS.** Humans remain the constitutional anchor at every tier.

These are the same explicit choices DESIGN.md §26 makes, scaled down to the single-repository surface. They keep the implementation honestly Minskyan even before a federation exists.

---

## 27. What this single-repository implementation claims, and what it does not

It does not claim:

- sentience, consciousness, emotion, desire, or intentionality at the repository level;
- automatic safe self-replication of agencies;
- safe open-ended automatic differentiation without governance review;
- economic efficiency in any real market;
- perfect bridges (lossiness is declared, not eliminated);
- perfect reputation (it is a smoothed signal, not truth);
- that *being* a single repository makes the discipline weaker than a federation's.

It claims something narrower and stronger:

> **The entire constitutional and reflective discipline DESIGN.md attributes to a federation of repository-native societies can be honoured inside one repository, by replacing every "repository" with "directory under `.github-society-intelligence/`", every "release" with "tagged commit on `main`", and every "channel transaction" with "an inter-agency settlement PR with the same censor, contract, bridge, and audit shape". The result is a faithful Stage-1 instance of the bootstrap path DESIGN.md §28 begins with, and a substrate on which any later federation can be built without rewriting its constitution.**

---

## 28. Bootstrap path from the current `.github-society-intelligence/` runtime

The current runtime — one workflow file, GitHub Issues as conversation surface, Git as persistent memory — is the *seed* of this implementation. The path forward is staged so that each stage delivers a working, installable enhancement and never bypasses an earlier stage.

### Stage 0 — what exists today

- `.github-society-intelligence/` with the agent runtime, session storage, and docs;
- one workflow `github-society-intelligence-agent.yml` that responds to issues;
- Git-versioned conversation memory;
- no agencies, no censors, no settlements, no critics, no bridges, no ledger.

### Stage 1 — minimum reflective skeleton

- introduce `.github-society-intelligence/agencies/` with one agency: the current responder, rewritten as `agencies/conversational-bee/`;
- introduce `governance/constitution.yaml`, `governance/self-ideals.yaml`, and a CODEOWNERS file for `governance/`;
- introduce `memory/{events,episodic,semantic,frames,klines,decisions,credit-assignment}/`;
- every issue response becomes a draft PR labelled `settlement: stl-…`, merged after one critic check.

### Stage 2 — censors and required checks

- enable branch protection on `main`;
- add the required-check set: `censor/credential`, `censor/pii`, `censor/authority`, `censor/representation-class`, `censor/append-only`, `censor/cross-directory-write`;
- every PR that mutates `memory/**` now passes through these checks.

### Stage 3 — second agency and the first inter-agency settlement

- add `agencies/critic-bee/` whose only job is to review the conversational-bee's PRs;
- declare the inter-agency channel `agencies/conversational-bee/channels/critic-bee.yaml` with a pinned contract SHA;
- the first inter-agency settlement merges with `censor/cloud-egress`, `censor/input-rights`, and a credit-assignment record.

### Stage 4 — frames, K-lines, analogies, consolidation

- introduce frame selection before K-line activation;
- introduce a consolidation window before memory promotion;
- introduce analogy fallback;
- record full-loop credit assignment.

### Stage 5 — plural self-models, slow self-ideals, B-brains

- introduce `state/self-models/` and `state/self-ideals/`;
- introduce `agencies/b-brains/{activation,memory,channel,governance-drift,self-model}-steward/` with `read_content: false` enforced;
- emit the first quarterly ecology report.

### Stage 6 — bridges and bridge probation

- introduce `agencies/bridges/<x>-to-<y>/` with `round_trip_tests/` and `state/drift-history.yaml`;
- enable `censor/bridge-probation`;
- exercise one bridged inter-agency settlement end-to-end.

### Stage 7 — ledger (mode `free` and `reciprocal` only)

- introduce `memory/ledger/{entries,reputation,disputes,monthly-statements}/`;
- enable `censor/payment`, `censor/reputation-drift`, `censor/append-only` on ledger writes;
- run one complete settlement cycle including ledger entry, dispute window, and reputation update — all in non-currency mode;
- the economic layer remains gated on `governance/maturity.yaml`.

### Stage 8 — differentiation by fork

- exercise the differentiation-by-fork mechanism on one pressured agency;
- promote or retire the fork through settlement after the trial window.

### Stage 9 — Level 5 declared (still single-repo)

- the maturity contract above (§24 of this analysis) is verified;
- the single-repository implementation is a faithful Stage-1 instance of DESIGN.md §28 and is now eligible to *seed* a federation;
- the move-not-rewrite property holds: any agency directory may be promoted to its own repository without changing its constitution, its memory shape, its credit-assignment shape, or its self-model.

### Stage 10 — first federation hop (out of scope for this analysis)

- DESIGN.md §28 Stage 3 begins: one outbound channel to one external provider repo.
- The single-repository discipline is now *load-bearing*. Without it, this hop is the unsafe API integration with extra steps that DESIGN.md §8 warns against.

---

## 29. Closing — DESIGN.md, in one repository, before there is a federation

The forge already gives us the substrate for one society:

- branches for insulated futures,
- pull requests for settlements,
- reviews for criticism,
- branch protection for censorship,
- commits for memory,
- workflow runs for embodied execution,
- labels and issues for attention,
- merges for action,
- CODEOWNERS for the human anchor,
- tags for pinned, signed cognitive artifacts.

This is enough. A single repository, with `.github-society-intelligence/` enhanced according to this analysis, already realises:

- the seven single-repo principles of DESIGN.md, in their full constitutional strength;
- the seven federation principles of DESIGN.md, as latent invariants the implementation does not violate;
- the reflective disciplines of DESIGN.md §3 as concrete directories and workflow steps;
- the cognitive loop of DESIGN.md §5 with the federation arc folded inward as inter-agency settlements;
- the ten repository roles of DESIGN.md §6 as ten directory roles under separate CODEOWNERS;
- the Society Channel Protocol of DESIGN.md §8 as an inter-agency settlement protocol with the same contract shape;
- bridges as their own directories, never embedded inside an agency;
- federation settlements as multi-directory settlements bound by one shared settlement ID;
- insulation, identity, and authority as directory-scoped CODEOWNERS rules and required checks;
- the censor and suppressor layer in full, with three additional intra-repo censors specific to the directory substrate;
- memory publishing and importing as tagged-commit pinning under provenance;
- credit assignment, the gated economic layer, B-brain ecology, observability, and evolution by fork — all at directory scale.

It does not claim to be a federation. It claims to be the substrate that makes a federation honest when it later forms. It is the answer to the question DESIGN.md begins from: *what does it take for one repository to be the kind of thing that, when it later speaks to another repository, is held to the same constitutional discipline as the act of changing its own mind?*

A repo can think. A repo can learn what kind of thinker it is becoming. **First, a repo can be the entire Society of Mind by itself — and only then is it ready to speak to others.**

---

*Source material: [`DESIGN.md`](./DESIGN.md), [`DESIGN-1.md`](./DESIGN-1.md), [`DESIGN-2.md`](./DESIGN-2.md), [`DESIGN-3.md`](./DESIGN-3.md), [`../../README.md`](../../README.md), [`../../../research/THE-SOCIETY-OF-MIND/`](../../../research/THE-SOCIETY-OF-MIND/), [`../../../research/THE-SOCIETY-OF-REPO/`](../../../research/THE-SOCIETY-OF-REPO/), [`../../../research/THE-REPO-IS-SOCIETY/`](../../../research/THE-REPO-IS-SOCIETY/), and [`../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/). This analysis is one opinionated reading of DESIGN.md as a single-repository implementation. It is meant to be argued with.*
