# DESIGN-3 — From a Reflective Society to a Federation of Societies

### A third great attempt at making repo-based AI agents speak to each other across repository boundaries without losing insulation, reflection, or honesty

> The forge is the mind. The repo is an agency. The branch is a thought. The pull request is a settlement. The merge is action. The committed graph is memory. **The organisation is a society of societies, and a channel between two repos is a governed cognitive transaction, never a raw API call.**

DESIGN-1 made the first bet: **a branch is the natural physical substrate for an insulated thought.** It showed a single repository can host a Minsky-style Level-3 society using only GitHub primitives.

DESIGN-2 kept that bet and added the reflective layer: frames before K-lines, recognition before reconstruction, representation discipline, full-loop credit assignment, consolidation windows, plural B-brains, self-models and self-ideals. It targets Level 4 — a society that can inspect and revise the structures by which it thinks.

DESIGN-3 keeps both prior bets and stretches the architecture across repository boundaries:

- the **repository** becomes the substrate of an *agency*, not just of a thought;
- the **GitHub organisation** becomes the substrate of a society of societies;
- a **cross-repo pull request, repository_dispatch, release, or signed issue** becomes the substrate of an inter-society transaction;
- a **bridge repository** becomes the substrate of a translator between two different cognitive vocabularies;
- a **ledger repository** becomes the substrate of an economy, but only after reflective discipline is already in place.

DESIGN-3 is therefore not a replacement for DESIGN-2. It is DESIGN-2 with the missing federation layer restored, and the economic layer admitted last — never first.

The deferred work named in DESIGN-2 §22 (networked societies) and DESIGN-2 §23 (economic layer) is what DESIGN-3 now specifies. The research grounding lives most directly in [`research/THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md`](../../../research/THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md), [`research/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../../../research/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md), [`research/THE-SOCIETY-OF-REPO/08-services/`](../../../research/THE-SOCIETY-OF-REPO/08-services/), [`research/THE-SOCIETY-OF-REPO/09-channels/`](../../../research/THE-SOCIETY-OF-REPO/09-channels/), [`research/THE-SOCIETY-OF-REPO/10-evolution/`](../../../research/THE-SOCIETY-OF-REPO/10-evolution/), and the multi-repo implementation work in [`research/FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md) and [`research/FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md).

---

## 1. What DESIGN-3 preserves from DESIGN-1 and DESIGN-2

The seven DESIGN-1 principles remain constitutional:

1. **A branch is a thought.**
2. **A pull request is a settlement.**
3. **A merge is an action.**
4. **Memory is committed history.**
5. **Censors are branch protection.**
6. **Critics are graduated.**
7. **The B-brain reads patterns, not content.**

The reflective discipline of DESIGN-2 also remains constitutional:

- frames before K-lines;
- recognition before reconstruction;
- representation discipline for every durable artifact;
- settlements as transframes with provenance, unknowns, and blind spots;
- runtime windows with fail-closed behaviour;
- attention and resource budgets;
- consolidation windows before memory promotion;
- full-loop credit assignment;
- differentiation before retirement;
- concept formation with examples and non-examples;
- plural self-models and slow-changing self-ideals;
- plural B-brains that observe but cannot merge.

DESIGN-3 does not weaken any of these. It re-applies each one to a wider scope.

| DESIGN-2 mechanism | DESIGN-3 re-application |
| --- | --- |
| Branch as insulated thought | Repository as insulated agency |
| Settlement as PR thread | Federation settlement as a thread that spans repositories |
| Censor as branch-protection check | Cross-repo censor as a required check on the *boundary* repo (cloud-egress, input-rights, payment) |
| Memory as committed history | Memory across societies as published, signed, version-pinned releases |
| Self-ideals as slow-changing norms | Federation ideals as cross-society norms cited in inter-society settlements |
| B-brain as pattern observer | Federation B-brain as ecology-level observer of channel and reputation patterns |
| Credit assignment across the loop | Credit assignment across societies — including providers, bridges, and channels |

Everything from DESIGN-2 still holds inside one repository. DESIGN-3 specifies what holds *between* them.

---

## 2. The DESIGN-3 thesis

DESIGN-3 rests on a stronger claim:

> A repository-native society becomes safely networked only when every cognition-shaped act that crosses a repository boundary is itself a settlement: discoverable, contracted, censored at both boundaries, audited, paid or credited, disputable, and remembered.

A federation of repositories is not a multi-agent framework. It is not microservices with a thicker proxy. It is a society of bounded cognitive organs that *speak to each other under the same constitutional discipline they apply internally*, with bridges where their vocabularies differ and ledgers where their economies meet.

The line between Level 4 and Level 5 is this:

```text
Level 4: "What kind of situation is this, what made us think so,
          which part of the loop helped or harmed, and what should change?"
Level 5: "Which other society should we ask, under what contract,
          with what input rights, with what censors, with what audit,
          and what do we learn from the exchange?"
```

The line between Level 5 and Level 6 is this:

```text
Level 5: "Which other society should we ask, under what contract?"
Level 6: "What does it cost us, what does it earn us, what is the
          reputation effect, and is the route still worth keeping?"
```

DESIGN-3 targets Level 5 as the **minimum** and Level 6 as an **opt-in extension that may only follow Level 4 + 5 maturity**.

---

## 3. The third bet

DESIGN-1's bet was:

> A branch is a thought.

DESIGN-2's bet was:

> A society becomes intelligent enough to trust only when it can inspect and revise the structures by which it thinks.

DESIGN-3's bet is:

> A society becomes safely networked only when the act of crossing its boundary is held to the same standard as the act of changing its own mind.

This is the substantive claim. Everything in DESIGN-3 follows from it.

If a society can change `main` only through a settlement, then it must be able to call another society only through a settlement.

If a society can promote memory only through a consolidation window, then it must be able to import another society's output only through a consolidation window.

If a society writes off no failure without recording it, then it must record disputes, refunds, and reputation downgrades the same way.

Symmetry is the constitution.

---

## 4. Minsky's vocabulary, extended across repositories

DESIGN-1 mapped Minsky's vocabulary onto the primitives of one GitHub repository. DESIGN-2 sharpened it. DESIGN-3 extends it to the organisation.

| Minsky / SOR concept | DESIGN-1/2 (within one repo) | DESIGN-3 (across repos) |
| --- | --- | --- |
| Agent | A handler inside an agency directory | A handler inside an agency repository |
| Agency | A directory with `constitution.yaml` | A repository with `constitution.yaml` at its root |
| Society | One repository hosting many agencies | A GitHub organisation (or set of orgs) hosting many repositories |
| Frame | `memory/frames/<frame>.yaml` | A frame may also be *imported* under provenance from a memory-repo via a pinned release |
| K-line | `memory/klines/<k>.yaml` | A K-line may name agencies in *other* repositories; the named agencies must be resolvable via the service registry |
| Polyneme / typed payload | Event payloads inside the repo | Cross-repo dispatch payloads (`repository_dispatch`, signed issue comments, release assets) |
| Stimulus | Issue / comment / push / schedule | Also inbound dispatches from other societies, webhook deliveries, and human cross-repo escalations |
| Settlement | The PR conversation | A **federation settlement**: a lead PR or issue that references thought-branches and PRs across multiple repos under one shared `settlement: stl-…` label |
| Action (merge) | Merge into `main` of the acting repo | Also a published release, a service response posted back through the channel, or a signed status update |
| Memory | Files under `memory/**` on `main` | Also pinned releases of memory-repos and signed cross-society audit records |
| Critic | Required PR review or check | Also cross-org critic apps that review service contracts and dispute submissions |
| Censor | Required branch-protection check | Also boundary censors: cloud-egress on the requester repo, input-rights on the provider repo, payment on the ledger repo |
| Suppressor | Output-boundary catch | Also channel-boundary suppressor: blocks an outbound payload that the upstream cloud-egress censor missed |
| Bridge | Translator agency between two representation classes | A **bridge repository** owned by neither side, with declared lossiness, round-trip tests as required checks, and its own constitution |
| Self-model | `state/self-models/` | Plural, plus an organisation-level `federation-self-model.yaml` listing which societies the federation believes it is composed of |
| Self-ideal | `state/self-ideals/` | Plural, plus federation ideals cited in inter-society settlements |
| Constitution | `constitution.yaml` at the agency root, society root | Plus an organisation constitution under a governance repository |

The repository is the unit at which insulation, identity, and authority all coincide. That is why it is the right substrate for an *agency* in a federation.

---

## 5. The federation cognitive loop

The DESIGN-2 loop runs in full inside each participating repository. DESIGN-3 adds the inter-society arc.

```text
stimulus
  → event normalization
  → perception
  → recognition (local memory)
  → frame selection
  → analogy fallback
  → K-line activation and inhibition
  → budgeted local agency response
  → critic and censor windows
  → settlement as transframe
  → ── (decision: is this within our authority and capability?) ──
        ↳ if yes: action by merge / release / API write
        ↳ if no : delegate via Society Channel
                    → discovery against the service registry
                    → contract check
                    → budget and payment-censor check
                    → cloud-egress censor on outbound payload
                    → dispatch through the channel
                    → bridge translation (if vocabularies differ)
                    → provider-side input-rights censor
                    → provider-side full DESIGN-2 loop
                    → response through the channel
                    → output-rights validation
                    → consolidation window
                    → import to local memory under provenance
                    → credit assignment to the provider, the channel, the bridge
                    → ledger update + reputation update + dispute window opens
  → outcome observation
  → memory promotion
  → fine-grained credit assignment
  → differentiation, retirement, or concept formation
  → federation B-brain ecology observation
```

The important additions over DESIGN-2 are:

- **delegation as a settlement decision**, not as a code path;
- **discovery before contract**;
- **contract before budget**;
- **budget before censor**;
- **censor before dispatch**;
- **bridge before vocabulary collision, not after**;
- **consolidation before memory import**, not before memory promotion alone;
- **reputation update only after a dispute window has elapsed.**

Delegation is itself a cognitive act and must be settled like any other.

---

## 6. Repository roles

Inside one repository, DESIGN-2 distinguishes agencies, critics, censors, suppressors, memory, workspace, and meta-admins. DESIGN-3 lifts those distinctions up to the repository level.

| Repository role | Purpose | Where it writes | What it may not do |
| --- | --- | --- | --- |
| **Agency repo** | Does bounded useful work in a specific domain | Its own `main`, its own memory, its outbound channel | Modify another repo's `main` directly |
| **Critic repo** | Challenges proposals across the federation | PR reviews on settlement repos, dispute filings on channels | Merge anything |
| **Censor repo** | Hosts boundary censors (cloud-egress, input-rights, payment, credential, pii) and the required-check apps that enforce them | Status checks on settlement repos, audit entries | Be bypassed by the proposing repo |
| **Memory repo** | Holds episodic, semantic, procedural, failure, frames, K-lines, analogies, concepts, decisions for a domain | Pinned releases that other repos import | Be mutated outside its own settlement process |
| **Governance repo** | Hosts the federation constitution, authority registry, approval gate definitions, rights registry, policy ledger, self-ideals | Releases that pin federation law to a version | Act on stimuli; it speaks only |
| **Workspace repo** | Holds the federation's current focus and active settlements | The federation settlement issues and `active-settlements/<id>.yaml` files | Run agencies; it points at them |
| **Service repo** | Exposes one or more services to the federation or to other federations | Service contracts, version-pinned releases, output artifacts | Carry private state across calls |
| **Bridge repo** | Translates between two representation classes or two societies' vocabularies | Translation outputs with declared lossiness and round-trip records | Be embedded inside another agency |
| **Ledger repo** | Records credits, debits, reputation, disputes, and reciprocal balances | Append-only entries; release-pinned monthly statements | Be edited destructively; entries are corrected by reversing entries, never by overwriting |
| **Bootstrap / dormant repo** | A repository in protected developmental status | Its own `main`, with reduced authority and increased introspection | Take revenue-bearing or irreversible action during bootstrap |

These are *roles*, not exclusive types. A small federation may pack several roles into one repository. A large federation will not.

The rule:

> If a role's outputs need to be inspected, audited, censored, or paid for independently of another role's outputs, those roles should live in separate repositories.

A repository boundary is a constitutional convenience as well as a cognitive one.

---

## 7. The three-repo minimum federation

DESIGN-1 lives inside one repository. DESIGN-2 lives inside one repository. DESIGN-3's *minimum viable federation* is three repositories, adapted from [`research/FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md) and adjusted for GitHub.

```text
github.com/<org>/
├── <name>-intelligence    ← human doorway + governance + command surface
├── <name>-society         ← the cognitive society (DESIGN-2-compliant)
└── <name>-labour          ← the code doorway / execution layer
```

| Repo | Role | What it owns | What it may not do |
| --- | --- | --- | --- |
| `<name>-intelligence` | Human doorway; governance | Federation constitution, authority registry, approval-gate definitions, command system, owner briefings, CODEOWNERS for federation-law files | Run agencies that take autonomous action |
| `<name>-society` | Cognitive society | The full DESIGN-2 stack: frames, K-lines, analogies, agencies, critics, censors, suppressors, memory, workspace, plural self-models and self-ideals | Be installed by hand; it is materialised by the intelligence repo |
| `<name>-labour` | Code doorway; execution | Runners, build adapters, environment shims, ephemeral execution artifacts | Govern, reason, or hold intent; it executes settled instructions only |

The collapse rule from the Forgejo work generalises:

> Everything cognitive or operational in an installed federation lives in one of the three repos. Within each repo, every structure collapses to either (a) a file under that repo's single root folder (`.github-society-intelligence/`), or (b) a step in that repo's single workflow file under `.github/workflows/`. Nothing cognitive or operational lives outside those six locations.

Six locations, three pairs, one installation. Removing any of the three root folders disables that repo's contribution at the next workflow run. This is the federation-scoped form of *presence is permission; absence is denial*.

Larger federations are arbitrarily many such installations, plus memory-repos, service-repos, bridge-repos, and a ledger-repo. The minimum is three.

---

## 8. The Society Channel Protocol on GitHub

DESIGN-2 deferred this. DESIGN-3 specifies it concretely.

A Society Channel is a governed cognitive transaction between two repositories (typically across organisations, but allowed within an organisation when insulation is the point). The GitHub primitives that realise each stage:

```mermaid
sequenceDiagram
  autonumber
  participant RA as Requester repo<br/>workspace + settlement
  participant CE as Requester censor<br/>cloud-egress
  participant PG as Approval gate<br/>(CODEOWNER review)
  participant CH as Channel<br/>(signed dispatch + audit)
  participant BR as Bridge repo<br/>(if vocabularies differ)
  participant PB as Provider censor<br/>input-rights
  participant PS as Provider service<br/>(DESIGN-2 loop)
  participant LE as Ledger repo<br/>credits + reputation

  RA->>CH: 1. Discovery — query service registry (signed release in governance repo)
  CH-->>RA: provider's pinned service contract
  RA->>RA: 2. Settle contract acceptance as a local PR
  alt cost > limit OR sensitive class
    RA->>PG: approval required (CODEOWNER review)
    PG-->>RA: granted / denied (immutable PR record)
  end
  RA->>CE: 3. Prepare outbound payload
  CE-->>RA: ✓ no forbidden inputs / ✗ blocked unconditionally
  RA->>CH: 4. Transmit via signed repository_dispatch (payload hash + classification)
  CH->>BR: bridge translation if required
  BR-->>CH: translated payload + lossiness record
  CH->>PB: forward to provider boundary
  PB-->>PB: input-rights check (required status check)
  PB->>PS: hand off accepted input
  PS-->>CH: 5. Output (release asset + signed dispatch back, with confidence)
  CH-->>RA: deliver output
  RA->>RA: validate output rights; write to workspace; open consolidation PR
  RA->>LE: 6. Payment or reciprocal credit (ledger entry PR)
  RA->>LE: 7. Satisfaction record (after dispute window)
  LE-->>PS: reputation update (signed)
  CH->>CH: 8. Audit trace — input hash, output hash, price, timestamps — append-only
  Note over RA,PS: 30-day dispute window
```

### 8.1 GitHub realisations of each channel stage

| Stage | GitHub primitive | Notes |
| --- | --- | --- |
| Service discovery | A release in the federation's governance repo, naming pinned service-contract releases per provider | The registry is itself a versioned artifact |
| Contract acceptance | A PR in the requester's society repo that merges a `channels/<provider>.yaml` referring to a specific contract release | The acceptance is itself a settlement |
| Outbound censorship | Required status check on the contract-acceptance PR and on every dispatch-emitting PR | Failing closed is the default |
| Dispatch | `repository_dispatch` with a payload that includes a hash of the full inputs and the contract release SHA | The full payload is not transmitted in the clear if it carries sensitive class |
| Bridge translation | A bridge repo receives the dispatch, emits a translated dispatch, and writes a translation record under its own `translations/` directory | Round-trip drift tests are required checks |
| Input rights | Required status check on the provider's intake workflow | Inbound payloads carrying forbidden classes are dropped and logged |
| Provider deliberation | Full DESIGN-2 loop inside the provider repo | The provider may itself delegate, recursively, with depth limits |
| Output | A release in the provider's service repo + a signed dispatch back to the requester | The release is the canonical artifact; the dispatch is the notification |
| Output validation | A required check on the requester's consolidation PR confirms output-rights and confidence | An invalid output triggers dispute opening, not retry |
| Payment / credit | A PR in the ledger repo creates a signed, append-only entry | The ledger PR is itself a settlement |
| Satisfaction | A second PR in the ledger repo updates reputation after the dispute window closes | Satisfaction recorded during the dispute window does not propagate |
| Audit | All of the above are commits, PRs, releases, and dispatches; the audit trace is the git history | Audit is not a separate system |
| Dispute | An issue in a dedicated `disputes` repo, labelled `dispute: tx-…`, with a 30-day window | Closure requires either party agreement or escalation to federation governance |

No part of the channel is an out-of-band API call. Every part is a GitHub artifact that can be inspected, reviewed, signed, reverted, and reasoned about.

### 8.2 Channel contract shape

```yaml
channel_id:               # ch.<requester>.<provider>.<year>-<sequence>
contract_release:         # release tag of the provider's pinned service contract
service_id:               # service.<name>.v<N>

input:
  accepted_classes: []
  forbidden_classes: []
  payload_hash_required: true
  bridge_required: false
  bridge_repo: null

output:
  artifact_form:          # release | signed_dispatch | commit_in_consumer_repo
  retention_rights:
    requester_receives: []
    provider_may_retain: []
    provider_may_not_retain: []
  confidence_required: true

economy:
  mode:                   # currency | reciprocal | free
  price_per_call:
  budget_window:
  reciprocal_partner:

governance:
  censors_required_on_requester: []
  censors_required_on_provider: []
  bridge_round_trip_test_releases: []
  approval_required_above:
  dispute_window_days: 30

observability:
  audit_record_class: channel_transaction
  emits_metrics: []
```

A channel without a pinned contract release is not a channel. It is an unsafe API integration with extra steps.

---

## 9. Bridges as bridge repositories

A bridge is a translator. The Bridges Protocol in [`research/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../../../research/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md) insists a bridge is an agency, not a utility — directional, lossy, learned, and a frequent point of silent failure.

In DESIGN-3 a bridge that crosses two societies must be a **repository of its own**, owned by neither side, with:

- a `constitution.yaml` declaring its direction (X→Y is one repo; Y→X is another);
- a declared envelope of acceptable lossiness;
- round-trip drift tests as required status checks;
- invariant tests with positive and negative cases;
- a memory of past translations with `representation_class: translation_record`;
- credit-assignment fields filled on every transaction it serves;
- a probation status that blocks settlement use when drift exceeds the envelope.

```yaml
bridge_id:                # bridge.<source>-to-<target>
direction:
source_representation:
target_representation:
declared_lossiness:
invariants: []
round_trip_test_release:
status: candidate | probation | active | superseded | retired
on_drift_exceeds_envelope: fail_closed
recent_drift_measurements: []
```

When a bridge enters probation, channels that depend on it must either:

1. fail closed and surface the dependency, or
2. fall back to a documented alternative bridge, or
3. escalate the settlement to human approval.

They may not silently route around the probation.

A bridge inside an agency hides the lossy step from review. A bridge inside the requester or provider repo lets one side adjust the translation to its own benefit. A bridge in its own repo is honest by construction.

---

## 10. Federation settlement — one settlement, many repos

DESIGN-1 says a settlement is a PR conversation. DESIGN-2 says a settlement is a transframe carried in a PR conversation. DESIGN-3 says a federation settlement is a **thread of settlements**, one per participating repo, bound together by a shared settlement ID.

### 10.1 Anatomy

```text
stl-2026-05-26-001                    ← shared settlement ID

<org>/contract-society
└── PR #142 (lead)                    ← the federation lead settlement
    label: settlement: stl-…
    label: federation: lead
    description references:
      ├── <org>/finance-society           PR #87
      ├── <org>/privacy-society           status-only on stl-…
      └── <org>/dental-bridge             translation #12

<org>/finance-society
└── PR #87                            ← provider-side settlement
    label: settlement: stl-…
    label: federation: provider

<org>/dental-bridge
└── translation #12                   ← bridge transaction
    label: settlement: stl-…
    label: federation: bridge

<org>/federation-ledger
└── PR #305                           ← payment + reputation
    label: settlement: stl-…
    label: federation: ledger
```

One settlement ID, four participating repositories, four PRs, all carrying the same label.

### 10.2 The lead settlement

The lead settlement is the repo that *received the original stimulus*. It owns the federation `settlement.yaml`:

```yaml
settlement_id: stl-2026-05-26-001
lead_repo: <org>/contract-society
participants:
  - repo: <org>/finance-society
    role: provider
    pr: 87
    contract_release: finance-society/contracts@v3.2.0
  - repo: <org>/dental-bridge
    role: bridge
    translation: 12
    drift_envelope: 0.05
  - repo: <org>/federation-ledger
    role: ledger
    pr: 305
federation_frame: frame.cross-domain-contract-renewal
federation_ideals_cited:
  - reversible-change-before-irreversible-change
  - dignity-over-convenience
delegation_chain:
  - from: contract-society
    to:   finance-society
    via:  dental-bridge
    depth: 1
delegation_depth_limit: 3
budgets:
  max_outbound_calls: 4
  max_total_wall_clock_seconds: 600
  max_federation_cost: 50
  max_bridges: 2
introspection:
  unknowns: []
  blind_spots: []
  opaque_provider_dependencies:
    - finance-society uses an internal pricing model we cannot inspect
```

### 10.3 Rules

- A federation settlement closes when **all** participating PRs close.
- A federation settlement *cannot* close with a partial merge. If one provider-side settlement fails closed, the lead either retries (with a new settlement ID and a citation of the failure record) or abandons.
- The non-compromise principle holds across repos: two providers giving contradictory high-severity verdicts trigger escalation. Their outputs are not averaged.
- Delegation has a depth limit. A provider that delegates to *its* provider increments the depth. Depth-limit breaches are settlement-failing.
- Every participant must record credit-assignment data the federation lead can read.

A federation settlement is not a remote procedure call with an audit log bolted on. It is a many-PR settlement that uses GitHub's native cross-repo references and labels as its substrate.

---

## 11. Insulation across repositories

DESIGN-2 makes insulation an explicit architectural rule. DESIGN-3 promotes it to a federation rule.

```yaml
federation_insulation:
  private_by_default: true
  shared_only_by:
    - settled_release
    - signed_dispatch_with_pinned_contract
    - approved_memory_import
    - explicit_bridge
  forbidden_direct_state_sharing:
    - from: <org>/finance-society
      to:   <org>/contract-society
      reason: prevent supplier-pricing model from contaminating obligation extraction
    - from: any
      to:   <org>/federation-ledger
      reason: ledger entries are produced only by the ledger's own settlement
  forbidden_cross_org_writes:
    - any direct push to another org's main branch
```

The rule:

> A repository in the federation may **consume** another repository's *released* outputs. It may not **depend on** another repository's *unreleased* working state.

Releases are the boundary of insulation. A consumer pins a producer's release SHA. The producer's `main` may change tomorrow; the consumer is unaffected until it imports a new release through its own settlement.

This is exactly the property `git submodule` and dependency pinning give us — DESIGN-3 simply admits that those primitives are the federation's insulation mechanism, not a build-tooling detail.

### 11.1 Permitted cross-repo writes

- Cross-repo issue comments (federation settlement coordination).
- `repository_dispatch` payloads (channel transactions).
- PRs opened against the consumer's own repo by automation (memory imports proposed for review).
- PRs opened against the provider's repo by the requester (only against the contract directory, only when allowed by the provider's CODEOWNERS).
- Releases published in the producer's repo (and only by its own merges).
- Append-only entries to the ledger repo (only by signed PR).

### 11.2 Forbidden cross-repo writes

- Direct `git push` to another repo's branch.
- Workflow run from one repo that mutates another repo's `main` via a deploy token.
- Cross-repo file overwrites disguised as imports.
- "Helper" service accounts with admin scope across repos.
- Anything that bypasses the consumer's own settlement loop.

If a federation needs a write that does not fit either list, the federation needs a settlement, not a new credential.

---

## 12. Authority, identity, and the human anchor

DESIGN-1 names CODEOWNERS as the constitutional anchor. DESIGN-2 keeps it. DESIGN-3 extends it to a federation layer.

### 12.1 Identity

| Identity surface | What it identifies | Anchored by |
| --- | --- | --- |
| GitHub repository | An agency | Its `constitution.yaml` and CODEOWNERS file |
| GitHub organisation | A society | An organisation-level constitution release in the governance repo |
| Signed commit | A specific human or service contributor | GPG / Sigstore signature; verified by required check |
| Signed release | A version-pinned cognitive artifact | Repository-level signing key with attestations |
| GitHub App | A bot identity acting on behalf of a society | Declared in the governance repo, scoped per repository |
| OIDC token from Actions | An ephemeral, audience-scoped identity for one workflow run | Validated by the receiving repository's input-rights censor |

The federation does not trust unsigned cross-repo writes. Every channel transaction carries provenance.

### 12.2 Authority

The authority registry lives in the governance repo as a versioned file, releasing as a pinned artifact. Other repos in the federation import the latest accepted release through their own settlement loop.

```yaml
authority_registry_release:        # governance@v4.1.0
authorities:
  - id: authority.contract-renewal
    held_by:
      - repo: <org>/contract-society
        agencies: [contract-bee]
    may_delegate_to:
      - repo: <org>/finance-society
        services: [service.price-history.v1]
    requires_approval_above:
      cost: 100
      sensitivity: high
    cannot_be_redelegated: true
  - id: authority.payment
    held_by:
      - repo: <org>/federation-ledger
    may_delegate_to: []
    requires_approval_above:
      cost: 0
    cannot_be_redelegated: true
```

An agency that acts beyond its declared authority triggers the `censor/authority` boundary check on its settlement PR. The check is a required status check; the agency cannot self-approve.

### 12.3 The human anchor at the federation level

CODEOWNERS at each repository covers that repository's law. A federation also needs a human anchor for *federation* law. DESIGN-3 places this in the governance repo:

- CODEOWNERS on `governance/constitution.yaml` requires named human owners;
- CODEOWNERS on `governance/authority-registry.yaml` requires the same humans plus at least one other;
- CODEOWNERS on `governance/self-ideals.yaml` is the most restrictive — these are the slowest-changing artifacts in the federation.

Self-ideals (from DESIGN-2 §18) are the federation's slow norms:

```text
evidence before confidence
reversible change before irreversible change
local-first where risk is comparable
dignity over convenience
restraint under uncertainty
non-compromise between equals
no economic acceleration before reflective discipline
```

These do not get edited because a transaction failed yesterday. They are reviewed across multiple cycles, with explicit owner acknowledgement. A society whose ideals drift to match its behaviour no longer has ideals.

---

## 13. Cross-repository censors

DESIGN-1 puts censors on branch protection. DESIGN-2 sharpens the suppressor/critic/censor split and adds fail-closed semantics. DESIGN-3 lifts censorship to the channel boundary.

| Censor | Where it runs | What it blocks |
| --- | --- | --- |
| `censor/cloud-egress` | Required check on the requester's dispatch-emitting PR | Outbound payloads carrying classes the channel contract forbids |
| `censor/input-rights` | Required check on the provider's intake workflow | Inbound payloads carrying classes the provider's contract does not accept |
| `censor/payment` | Required check on the requester's dispatch-emitting PR and on the ledger PR | Transactions above per-channel or per-window budget |
| `censor/delegation-depth` | Required check on the lead settlement PR | Delegation chains exceeding declared depth |
| `censor/credential` | Required check on every PR in every repo | Any commit containing credentials, tokens, or keys (already in DESIGN-1; remains here, now federation-wide) |
| `censor/pii` | Required check on every PR and every dispatch | PII crossing a boundary it is not authorised for |
| `censor/authority` | Required check on every settlement PR | Agencies acting beyond their declared authority |
| `censor/bridge-probation` | Required check on settlement PRs that name a bridged channel | Use of a bridge currently in probation |
| `censor/reputation-floor` | Required check on outbound dispatches | Calls to providers below the federation's reputation floor |

The fail-closed rules from DESIGN-2 §8 apply to channel censors with one strengthening:

> A channel censor that is offline at dispatch time means **fail closed at the channel level**. There is no retry until the censor is back online. The settlement records the failure and exits.

This prevents the easiest exploit of any networked system — make the safety check unreliable, then claim the unreliable check authorised the action.

---

## 14. The federation suppressor layer

DESIGN-2 §9 introduces suppressors as a learning event: a boundary catch that names the upstream censor that should have prevented the path earlier.

DESIGN-3 places federation-level suppressors at the *channel boundary itself*:

| Suppressor | Where it sits | What it learns |
| --- | --- | --- |
| Outbound payload suppressor | Inside the channel adapter between requester and dispatch | Reveals missing entries in the requester's cloud-egress rules |
| Inbound payload suppressor | Inside the channel adapter between dispatch and provider | Reveals missing entries in the provider's input-rights contract |
| Output-rights suppressor | Inside the channel adapter between provider response and requester import | Reveals provider over-retention or under-redaction |
| Reputation-drift suppressor | Inside the ledger | Reveals reputation reports that exceed the agreed change envelope per cycle |
| Bridge-lossiness suppressor | Inside the bridge | Reveals translations whose drift exceeds the bridge's declared envelope |

Every suppressor catch is a `representation_class: suppressor_catch` artifact under the catching repo's memory, with a learning proposal referencing the upstream censor or rule that should have caught it earlier. This is how the federation grows new censors instead of stacking exceptions.

---

## 15. Memory across the federation

DESIGN-1 keeps memory in `memory/**` on `main`. DESIGN-2 adds representation classes, temperatures, links, consolidation windows, and concept candidates. DESIGN-3 generalises memory to *published, signed, version-pinned releases* that other repos may import under their own settlement.

### 15.1 Memory publishing

A memory repo publishes its current accepted state as a release. The release tag encodes the schema version and the temperature snapshot date:

```text
memory/frames @ v2025.12-warm
memory/klines @ v2025.12-hot
memory/decisions @ v2025.12-archive
```

The release is signed. The release notes name the settlement(s) that promoted the included artifacts.

### 15.2 Memory importing

A consuming repo imports a memory release by opening a PR against its own `memory/` that pins the release SHA and adds the new artifacts under provenance:

```yaml
import_record:
  source_repo: <org>/contract-memory
  source_release: v2025.12-warm
  source_release_sha: <40-hex>
  imported_at: 2026-01-04T12:00:00Z
  imported_by_settlement: stl-2026-01-04-005
  representation_classes_imported:
    - frame
    - kline
  consolidation_window:
    closed_at: 2026-01-04T13:00:00Z
    required_inputs_received:
      - credit_assignment_record
      - introspection_record
      - critic_objection_window
```

The consumer never trusts memory it did not consolidate. Memory import passes through the same consolidation window that promotion does.

### 15.3 Memory rules

- Memory imports are settlements.
- Imported memory carries its provenance forever; the link is part of the representation.
- Imported memory enters at temperature `warm` at most. Promotion to `hot` requires local evidence of usefulness.
- A consumer never imports another society's `failure/` memory as its own `episodic/` memory. Failure stays failure across boundaries.
- A consumer never imports another society's `self-model.*` as its own. Self-models are *non-portable* by constitutional rule.
- Imported K-lines must be re-weighted by local credit assignment before any reinforcement applies.

This prevents the federation's most dangerous failure mode: one society's stale lesson becoming several societies' confident default.

---

## 16. Federation credit assignment

DESIGN-2 §15 assigns credit across the whole local loop. DESIGN-3 adds cross-society credit targets.

```text
local credit targets (from DESIGN-2):
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

federation credit targets (added by DESIGN-3):
  delegation decision
  provider choice
  contract acceptance quality
  bridge choice and lossiness handling
  outbound censor pass
  inbound censor pass
  provider response quality
  output-rights compliance
  consolidation of imported result
  ledger entry accuracy
  dispute outcome
  reputation update accuracy
```

Federation credit signals flow back to the named participants through PRs against their respective memory repos. A provider that consistently delivers useful, well-documented outputs sees rising reputation in the ledger and rising K-line weight in repeat consumers. A bridge that consistently translates within envelope sees its `status: active` reaffirmed. A channel whose outputs are consistently disputed sees its budget tightened automatically by the next monthly governance review.

The rule:

> Reputation is a consequence of cumulative credit-assignment records across many settlements, not a free-standing opinion.

Reputation that is not derived from credit-assignment records is rumour. A federation that uses rumour for routing decisions is no longer a society of inspectable parts.

---

## 17. The economic layer — last, never first

DESIGN-1 and DESIGN-2 do not monetise anything. DESIGN-3 specifies the economic layer because the deferred section in DESIGN-2 §23 needs to be honoured — but it places the layer behind a hard ordering rule:

> A federation may not enable Level 6 (economic) capabilities unless Level 4 (reflective) discipline is verifiably in place for *every participating repository* and Level 5 (networked) capabilities are verifiably in place for *every channel between them*.

### 17.1 The ledger repository

```text
<org>/federation-ledger/
├── .github-society-intelligence/
│   ├── constitution.yaml
│   ├── agencies/
│   │   ├── ledger-bookkeeper/
│   │   ├── reputation-keeper/
│   │   └── dispute-clerk/
│   ├── censors/
│   │   ├── payment/                ← required for every ledger PR
│   │   ├── reputation-drift/       ← caps per-cycle reputation change
│   │   └── append-only/            ← rejects history rewrites
│   └── memory/
│       ├── ledger-entries/         ← append-only YAML, one per transaction
│       ├── reputation/             ← time-decayed signal per provider
│       ├── disputes/
│       └── monthly-statements/     ← release-pinned
└── .github/workflows/
    └── ledger.yml
```

### 17.2 Ledger entries

Every ledger entry is append-only. Corrections are reversing entries, never overwrites. The entry shape:

```yaml
transaction_id:           # tx.<year>.<sequence>
settlement_id:            # stl-… shared across the federation settlement
channel_id:               # ch.<requester>.<provider>.…
contract_release:
requester:
provider:
mode:                     # currency | reciprocal | free
amount:
currency:                 # ISO 4217 or "credits"
input_classification: []
output_confidence:
timestamps:
  dispatched_at:
  received_at:
  consolidated_at:
status:                   # pending | committed | disputed | reversed
reversal_of: null
audit:
  input_hash:
  output_hash:
  bridge_translation_hash:
  censor_pass_records: []
```

### 17.3 Reputation

Reputation is a per-provider time-decayed signal derived from credit-assignment records, not a free-form rating. It is updated only after the dispute window closes. It cannot move by more than a declared envelope per monthly governance review — the reputation-drift suppressor enforces this.

### 17.4 Disputes

A dispute is an issue in the ledger repo with a 30-day window. Closure requires either party agreement, federation governance arbitration, or window expiry. A disputed transaction does not affect reputation until closure.

### 17.5 The hard rule

> Do not monetise routes the society cannot explain, censor, audit, or learn from.

A federation that turns on the economic layer before it can demonstrate full DESIGN-2 compliance, full channel governance, and full audit history is not a Level 6 society. It is a Level 0 marketplace pretending to be a mind. Speed in such a setting accelerates mistakes, not learning.

---

## 18. Federation B-brains and ecology

DESIGN-2 §19 makes B-brains plural inside one repository. DESIGN-3 adds *federation* B-brains.

```text
federation-activation-steward
federation-memory-steward
federation-channel-steward
federation-bridge-steward
federation-economic-steward
federation-governance-drift-monitor
federation-self-model-steward
```

They observe metadata, never content. Their substrate is the federation's commit history, release graph, dispatch records, and ledger entries. They do not read settlement payloads; they read *patterns* of settlements.

Things they observe:

- per-repo activation rates and drift;
- channel call rates per provider per requester;
- bridge translation rates and drift trends;
- censor firing rates at boundaries;
- suppressor catches that suggest missing upstream censors;
- ledger spend per channel per window;
- reputation drift inside the allowed envelope;
- single-provider dominance;
- single-requester dominance;
- delegation-depth distributions;
- recursive delegation paths that approach the depth limit;
- repeat dispute counts per channel;
- governance amendment frequency per stability tier (a leading indicator of constitutional drift).

They may open issues, propose federation settlements, and request reviews on governance changes. They may not merge structural changes themselves. The federation must not become a monarchy at its meta-layer either.

The federation B-brain layer is summarised in a single artifact, regenerated by scheduled workflow and version-pinned per quarter:

```text
<org>/federation-governance/state/federation-ecology-report.<yyyy>-Q<n>.md
```

This report is reviewed by humans on the cadence defined in [`research/THE-SOCIETY-OF-REPO/10-evolution/README.md`](../../../research/THE-SOCIETY-OF-REPO/10-evolution/README.md): post-outcome reinforcement after every settlement, quarterly ecology review, annual constitution review.

---

## 19. Federation cognitive observability

DESIGN-2 inherits the observability surface from [`research/THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md`](../../../research/THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md). DESIGN-3 adds federation-specific signals.

| Surface | Signal | Healthy direction |
| --- | --- | --- |
| Channels | `outbound_call_rate_per_channel` | Stable share; spikes per channel indicate over-reliance |
| Channels | `inbound_call_rate_per_service` | Diversity of requesters; a single requester dominating one service is a coupling smell |
| Channels | `channel_censor_block_rate` | Non-zero is honest; zero usually means a censor is asleep |
| Channels | `channel_failure_rate_by_cause` | Each cause class (egress, input-rights, payment, depth, bridge) should appear, not all collapse into "unknown" |
| Bridges | `bridge_drift_per_cycle` | Inside envelope; trending toward zero |
| Bridges | `bridge_round_trip_test_pass_rate` | 100% is the only acceptable target |
| Memory | `memory_import_rate_by_class` | Rising imports of `frame` or `analogy` is healthy; rising imports of `self-model` is forbidden |
| Memory | `memory_import_consolidation_window_breach_rate` | Trend toward zero |
| Ledger | `dispute_open_count_by_channel` | Trend toward zero; non-trend rise is a channel quality signal |
| Ledger | `reputation_drift_within_envelope_rate` | 100% |
| Federation | `delegation_depth_distribution` | Most depth-1; depth-3 rare; depth-4+ should not exist |
| Federation | `cross_repo_non_compromise_event_count` | MUST be zero (the federation does not silently average) |
| Federation | `monarch_provider_share` | No single provider should serve more than the constitutionally declared share without governance review |
| Federation | `governance_amendment_rate_by_tier` | Slow tiers should be slow; spikes in slow-tier amendment is a drift signal |

These are emitted by ordinary workflow steps writing to a small set of YAML files in each repository's `state/observability/` directory. The federation B-brain rolls them up into the quarterly ecology report. No external observability stack is required; the substrate is again the repository itself.

---

## 20. Evolution across repositories

DESIGN-2 specifies differentiation, bootstrap protection, and retirement inside one repository. DESIGN-3 lifts each to the federation level.

### 20.1 Differentiation by fork

The federation's natural differentiation mechanism is **fork**.

When one repository shows double-purpose pressure (its credit-assignment records show it serving two distinct competence regions), the meta-admin layer opens a federation settlement proposing a fork:

```text
<org>/contract-society
  → fork: <org>/contract-obligation-society
  → fork: <org>/contract-risk-society
```

The forks enter bootstrap protection. During bootstrap they:

- inherit the parent's frames and K-lines under provenance;
- are evaluated on constitutional compliance, safety, evidence quality — not raw throughput;
- carry a `parent: <org>/contract-society` link in their constitution;
- run side-by-side with the parent for a declared trial window;
- are governed by an explicit rollback plan in the federation governance repo.

After the trial window:

- successful forks are promoted;
- unsuccessful forks are retired (their git history archived, their releases stay readable but unreferenced);
- the parent is either superseded (if both forks dominate) or retained (if it remains the best generalist).

This implements the differentiation discipline from [`research/THE-SOCIETY-OF-REPO/10-evolution/README.md`](../../../research/THE-SOCIETY-OF-REPO/10-evolution/README.md) at the repository scale.

### 20.2 Merge of converged repositories

If two repositories' scopes converge after several cycles — credit-assignment records show overlapping competence and overlapping criticism patterns — a merge settlement is allowed. The merged repository keeps both parents as `merged_from` links in its constitution.

### 20.3 Retirement

Retirement is a settlement, not a deletion. A retired repository:

- is archived;
- has its outstanding service contracts revoked through dispute-window-aware settlements (consumers given notice);
- has its memory repo pinned to its final release;
- remains readable; channels referencing it surface a deprecation warning and require a governance settlement to continue.

Nothing in the federation is ever silently removed. Removal is itself a reviewed, reverted-if-needed act.

---

## 21. Operational body, governed mind, federated organism

DESIGN-2 §20 distinguishes the operational body from the governed cognitive layer. DESIGN-3 extends this distinction with a third layer.

| Layer | GitHub realisation | Role |
| --- | --- | --- |
| **Body** | Actions runners, tokens, branch protection, storage, releases, dispatch transport | Executes and constrains within one repository |
| **Brain** | Classifiers, retrieval, local or cloud models, similarity indexes, embedding stores | Produces candidate patterns within one repository |
| **Mind** | Settlements, critics, censors, constitutions, memory promotion, self-ideals | Governs meaning and authorisation within one repository |
| **Federation** | Channels, contracts, bridges, ledgers, federation governance, ecology stewards | Governs the relationships *between* minds |

A successful federation transaction is not wisdom. It is one transaction inside a network of accountable relationships, recorded for review.

A provider with high reputation is not authoritative. It is a provider whose recent credit-assignment record is favourable, and whose contracts have recently held.

A bridge with low drift is not faithful. It is a bridge whose round-trip drift has *so far* remained inside envelope on the cases tested.

A ledger entry is not money. It is a signed commitment to a recorded view of an exchange, subject to a dispute window.

DESIGN-3 keeps these boundaries explicit so the federation does not confuse operational connectivity, cognitive depth, and economic activity.

---

## 22. Minimum federation layout

```text
github.com/<org>/
├── <name>-intelligence/                        ← human doorway repo
│   ├── .github/workflows/intelligence.yml
│   └── .github-society-intelligence/
│       ├── constitution.yaml
│       ├── commands/                           ← human commands and surfaces
│       ├── owner-briefings/
│       └── state/
│
├── <name>-society/                             ← cognitive society repo (DESIGN-2)
│   ├── .github/workflows/
│   │   ├── perceive.yml
│   │   ├── activate.yml
│   │   ├── critique.yml
│   │   ├── censor.yml
│   │   ├── settle.yml
│   │   ├── consolidate.yml
│   │   ├── observe.yml
│   │   ├── delegate.yml                        ← federation-aware
│   │   └── import-memory.yml                   ← federation-aware
│   └── .github-society-intelligence/
│       ├── constitution.yaml
│       ├── representation.yaml
│       ├── insulation-map.yaml
│       ├── agencies/
│       ├── critics/
│       ├── censors/
│       ├── suppressors/
│       ├── memory/
│       │   ├── events/
│       │   ├── episodic/
│       │   ├── semantic/
│       │   ├── procedural/
│       │   ├── failure/
│       │   ├── frames/
│       │   ├── analogies/
│       │   ├── concepts/
│       │   ├── klines/
│       │   └── decisions/
│       ├── channels/                           ← per-provider contract pins
│       ├── services/                           ← what this society exposes
│       ├── imports/                            ← memory imports under provenance
│       ├── workspace/
│       └── state/
│           ├── self-models/
│           ├── self-ideals/
│           └── ecology-report.yaml
│
├── <name>-labour/                              ← code doorway repo
│   ├── .github/workflows/labour.yml
│   └── .github-society-intelligence/
│       ├── constitution.yaml
│       ├── runners/
│       ├── adapters/
│       └── state/
│
├── <name>-federation-governance/               ← federation law
│   └── .github-society-intelligence/
│       ├── constitution.yaml
│       ├── authority-registry.yaml
│       ├── rights-registry.yaml
│       ├── self-ideals.yaml
│       ├── service-registry/                   ← versioned pinned contracts
│       ├── approval-gates/
│       └── ecology-reports/
│
├── <name>-federation-ledger/                   ← economy (Level 6 opt-in)
│   └── .github-society-intelligence/
│       ├── constitution.yaml
│       ├── agencies/{ledger-bookkeeper,reputation-keeper,dispute-clerk}/
│       ├── censors/{payment,reputation-drift,append-only}/
│       └── memory/{ledger-entries,reputation,disputes,monthly-statements}/
│
└── <name>-bridge-<source>-to-<target>/         ← one repo per direction
    └── .github-society-intelligence/
        ├── constitution.yaml
        ├── translations/
        ├── round-trip-tests/
        └── state/{drift-history,envelope}/
```

The first three (`-intelligence`, `-society`, `-labour`) are required for any DESIGN-3 federation.

The next two (`-federation-governance`, plus at least one consuming or providing repo) are required for Level 5.

The ledger and bridge repos are required only when the federation begins to use them — Level 6 and any cross-vocabulary channel, respectively.

---

## 23. Anti-patterns DESIGN-3 must prevent

DESIGN-1 and DESIGN-2 named local anti-patterns. DESIGN-3 adds federation-scale ones.

- **Federation cancer** — cross-repo entanglement without channels; deploy tokens with org-wide write; private state shared via "helper" repos.
- **Service swamp** — services exposed without contracts; many endpoints, no censors, no audit.
- **Bridge inside an agency** — a translator hidden in worker code, escaping round-trip tests.
- **Sovereign mediator** — one repository that decides for all (the federation monarch).
- **Reputation laundering** — a low-reputation provider serving requests through a higher-reputation proxy.
- **Ledger drift** — overwriting entries instead of issuing reversing entries.
- **False federation** — many repositories owned by one team, all rubber-stamping each other's PRs; structural form without independent CODEOWNERS.
- **Memory poisoning** — importing another society's failure memory as one's own episodic memory; importing another society's self-model.
- **Economic acceleration before cognition** — turning on payments, metering, or reputation before Level 4 reflective discipline is verifiable.
- **Settlement bypass via dispatch** — using `repository_dispatch` to take action without a corresponding local settlement.
- **Bridge probation skipped** — continuing to use a bridge whose drift exceeds envelope because "there is no alternative".
- **Silent retry across the federation** — a failed channel call repeated under a new settlement ID without citing the failure record.
- **Constitution amendment by velocity** — frequent low-friction edits to slow-tier law because nobody invoked the stability discipline.

If a federation drifts into any of these, it may still automate work, but it is no longer a faithful descendant of DESIGN-3.

---

## 24. The DESIGN-3 maturity contract

To claim DESIGN-3 compliance, a federation must demonstrate:

- [ ] every participating repository is independently DESIGN-2 compliant (see DESIGN-2 §26);
- [ ] every cross-repo interaction is a Society Channel transaction with a pinned contract release;
- [ ] every channel has at least one required censor on each side (typically `cloud-egress` outbound, `input-rights` inbound);
- [ ] every cross-vocabulary channel has a bridge repository with passing round-trip tests;
- [ ] federation insulation is declared in `federation-governance/insulation-map.yaml` and the forbidden writes are not present in practice;
- [ ] every federation settlement carries a shared settlement ID across all participating PRs;
- [ ] no federation settlement closes with a partial merge;
- [ ] memory imports pass through a consolidation window;
- [ ] no participant imports another participant's failure memory as episodic memory, or another participant's self-model;
- [ ] credit assignment records exist for every channel transaction and name the provider, the bridge (if any), and the censors that fired;
- [ ] a federation ecology report is generated quarterly and reviewed by humans named in the governance repo CODEOWNERS;
- [ ] federation self-ideals exist, are slow-tier protected, and are cited by high-impact settlements;
- [ ] the economic layer, if present, runs only after the above hold for at least one full quarterly review cycle;
- [ ] the ledger is append-only and its `append-only` censor is enforced as a required check;
- [ ] disputes use a 30-day window and reputation does not move during disputes;
- [ ] differentiation by fork has been exercised at least once, and at least one fork has been either promoted or retired through settlement;
- [ ] retirement of any participant is a settlement, not a deletion.

If these do not hold, the system may still be useful, but it is not yet DESIGN-3.

---

## 25. Worked example — federated contract renewal

DESIGN-1 ran a contract renewal inside one repository. DESIGN-2 deepened the same example with frames, reconstruction, suppressors, consolidation, credit assignment, and differentiation. DESIGN-3 spreads it across a federation.

Federation members:

- `<org>/contract-society` — extracts obligations, hosts the lead settlement;
- `<org>/finance-society` — provides supplier price-history as a service;
- `<org>/dental-compliance-society` — provides domain-specific risk check (the contract is a dental supplier);
- `<org>/contract-to-dental-bridge` — translates `contract.clause` representation into `dental.regulatory-event` representation;
- `<org>/federation-governance` — hosts the constitution, authority registry, service registry, self-ideals;
- `<org>/federation-ledger` — hosts payment, reputation, disputes.

The stimulus arrives at `<org>/contract-society` as an issue with a contract PDF.

1. **Stimulus**: issue opened in `contract-society` with the renewal PDF.
2. **Event normalisation, perception, recognition, frame selection**: per DESIGN-2. Frame `frame.contract-renewal` selected with confidence 0.83. Recognition reports 0.78 to past supplier-renewal episodes.
3. **K-line activation**: `kline.contract-renewal` wakes `contract-bee`, `risk-critic`, `privacy-censor`, and *also* names two cross-repo services: `service.finance.price-history.v1` and `service.dental-compliance.risk-check.v1`.
4. **Federation budget**: lead settlement `stl-2026-05-26-001` is minted with `max_outbound_calls: 2`, `max_total_wall_clock_seconds: 600`, `max_federation_cost: 50`, `max_bridges: 1`, `delegation_depth_limit: 3`.
5. **Local thought-branches**: `contract-bee/extract-obligations`, `risk-critic/flag-auto-renewal` are opened in `contract-society`.
6. **Delegation decisions**: the lead settlement decides to delegate two questions:
   - price history → `finance-society` directly (same representation class);
   - dental-regulatory risk → `dental-compliance-society` via `contract-to-dental-bridge`.
7. **Channel preparation**: the `channels/finance-society.yaml` contract release is `finance-society@v3.2.0`. The `channels/dental-compliance-society.yaml` contract release is `dental-compliance@v2.1.0`. Both releases are pinned. The bridge repo is at `contract-to-dental-bridge@v1.7.0`.
8. **Outbound censorship**: `censor/cloud-egress` reviews the outbound payloads. The finance call passes. The dental call would have included supplier identity in the clear; the censor blocks. The settlement records the block as a learning event and re-attempts with redacted supplier identity, which passes.
9. **Dispatch**: signed `repository_dispatch` to `finance-society` and to `contract-to-dental-bridge`.
10. **Bridge translation**: `contract-to-dental-bridge` translates `contract.clause` → `dental.regulatory-event` and emits a translation record with drift 0.02 (well within envelope 0.05). It dispatches to `dental-compliance-society`.
11. **Provider deliberation**: each provider runs a full DESIGN-2 loop locally, settles, and dispatches signed responses back. `finance-society` returns a price-history release. `dental-compliance-society` returns a regulatory-event evaluation release.
12. **Output validation**: `contract-society` validates output rights on both responses. The dental response includes a confidence score and an `opaque_model_dependencies` field naming an external classifier — recorded under introspection.
13. **Consolidation**: `contract-society` opens a consolidation PR that imports both responses into local workspace. The consolidation window is 1 hour. During the window a late critic objection arrives on the dental response (the regulatory event referenced a deprecated rule). The bridge is *not* at fault; the provider is. The consolidation closes after the objection is recorded.
14. **Local settlement closure**: `contract-bee/extract-obligations` wins. `risk-critic/flag-auto-renewal` is recorded as a positive-credit objection that improved the proposal. Privacy censor passed.
15. **Approval gate**: human CODEOWNER approval is requested because the constitution flags `legal_escalation: requires_approval`.
16. **Action**: the contract-society lead PR merges.
17. **Federation settlement closure**: all participating PRs close together under `stl-2026-05-26-001`. The lead writes the federation `settlement.yaml` to `memory/decisions/`.
18. **Ledger**: PRs are opened in `<org>/federation-ledger` for two transactions: `tx.2026.0123` (finance, 5 credits) and `tx.2026.0124` (dental, 10 credits). Both are signed and merged. The dispute window opens.
19. **Reputation**: not yet updated. Reputation update is scheduled for after the 30-day window.
20. **Credit assignment**:
    - frame.contract-renewal: positive;
    - contract-bee: positive;
    - finance-society: positive;
    - dental-compliance-society: mixed (positive useful output, negative deprecated-rule reference);
    - contract-to-dental-bridge: positive (drift within envelope);
    - censor/cloud-egress (contract-society side): positive (caught the supplier identity leak);
    - risk-critic: positive (improved proposal);
    - federation-ledger: positive (clean entries, no anomalies).
21. **B-brain observations**: the federation B-brain notes that `contract-society` has called `dental-compliance-society` via the bridge three times this quarter, with one censor block. It opens a quarterly review item to verify the cloud-egress censor's supplier-redaction rule.
22. **Differentiation signal**: the meta-admin layer notes that `contract-society` is now serving two distinct competence regions (general contract obligations and dental-specific contract obligations). A federation settlement is opened proposing a fork to `contract-dental-obligation-society`. The proposal enters bootstrap protection if accepted.
23. **Dispute window**: 30 days later, no dispute. Reputation updates apply: finance-society +0.02, dental-compliance-society +0.01 (the mixed credit dampens the rise). Both updates are inside the per-cycle envelope; the reputation-drift suppressor does not fire.

That is one complete federation loop. Every cross-repo interaction is a settlement. Every channel transaction is signed, censored, audited, and either credited or disputed. The federation learns not only what to do, but who to ask, with what contract, through which bridge, at what reputation, and at what cost.

---

## 26. What DESIGN-3 deliberately does *not* do

A third great attempt earns its honesty by saying what it omits.

- **Open federation discovery without governance.** DESIGN-3 does not enable a society to discover and call arbitrary other societies on the public internet. Discovery is bounded to the service registry pinned by the federation governance repo. Cross-federation discovery is a future design.
- **Automatic constitution import.** DESIGN-3 does not let a society inherit another society's constitution wholesale. Constitutions are written and reviewed locally.
- **Automatic bridge synthesis.** Bridges are written and reviewed by humans (or, eventually, by a bridge-authoring agency under strict bootstrap). DESIGN-3 does not auto-generate translators between vocabularies.
- **Automatic memory merging.** A consumer never merges two providers' memories without local settlement.
- **Cross-org governance amendments by automation.** Federation governance edits remain CODEOWNER-anchored. Automation can propose; it cannot merge.
- **Public-currency settlement on the ledger.** DESIGN-3 specifies the ledger shape but does not bind it to a real currency. Implementations may stay in credits / reciprocal until governance opens a real currency channel.
- **Federation-level self-models that span organisations.** Self-models are non-portable by rule. The federation-self-model lives in *one* governance repo per federation.
- **Cross-federation reputation laundering channels.** Inbound reputation from external federations is treated as a stimulus, not as a fact.
- **Replacing CODEOWNERS with reputation thresholds.** Humans remain the constitutional anchor at every tier.

These are not failures of ambition. They are explicit choices to keep DESIGN-3 honestly Minskyan: many small, limited, inspectable parts; insulation as fundamental as connection; representation as a political choice; no compromise between equals.

---

## 27. What DESIGN-3 still does not claim

DESIGN-3 remains honest about its boundaries.

It does not claim:

- sentience or consciousness at any level (single repo, federation, or beyond);
- emotion, desire, or intentionality independent of cited self-ideals;
- automatic safe self-replication of repositories;
- safe open-ended automatic differentiation without governance review;
- economic efficiency in any real market;
- perfect bridges (lossiness is declared, not eliminated);
- perfect reputation (it is a smoothed signal of recorded credit, not truth);
- that scale or revenue make a federation wiser.

It claims something narrower and stronger:

> A federation of repository-native AI societies can be governably networked and, later, governably economic, only when every cross-boundary act is a settlement: discoverable, contracted, censored at both ends, bridged where vocabularies differ, audited, paid or credited, disputable, consolidated, credit-assigned, and remembered as ordinary, reviewable, revertable Git history.

---

## 28. The seven federation principles DESIGN-3 commits to

The seven DESIGN-1 principles remain. DESIGN-3 adds seven more, sitting on top of them.

1. **A repository is an agency.** Insulation between agencies is insulation between repositories.
2. **A channel is a settlement.** No cross-boundary act is exempt from the loop.
3. **A bridge is an agency, not a utility.** Lossy translation lives in a repository with a constitution and round-trip tests.
4. **A federation settlement spans repositories.** One settlement ID, many PRs, one closure.
5. **The ledger is append-only.** Corrections are reversing entries. History is never rewritten.
6. **Reputation is a consequence of credit assignment, not an opinion.**
7. **The economic layer is last, never first.** Speed without reflection accelerates mistakes.

If any future design abandons one of these fourteen (seven from DESIGN-1, seven new here), it is no longer DESIGN-3's descendant — it is a different bet.

---

## 29. Bootstrap path

DESIGN-2 ends with a four-stage bootstrap. DESIGN-3 adds the federation stages on top.

### Stage 0 — three dormant repos

- `<name>-intelligence`, `<name>-society`, `<name>-labour` exist;
- each carries its enable sentinel and CODEOWNERS;
- no autonomous action yet.

### Stage 1 — one DESIGN-2 society

- `<name>-society` reaches full DESIGN-2 compliance per DESIGN-2 §26;
- `<name>-intelligence` is the human doorway;
- `<name>-labour` executes settled instructions.

### Stage 2 — federation governance

- `<name>-federation-governance` added;
- constitution, authority registry, rights registry, self-ideals released as v1.0.0;
- service registry exists (may be empty).

### Stage 3 — first channel

- one outbound channel to one provider;
- pinned contract release;
- `cloud-egress` censor on requester, `input-rights` censor on provider;
- one ledger-free transaction (reciprocal or free mode);
- consolidation, credit assignment, audit recorded.

### Stage 4 — first bridge

- one bridge repository between two representation classes;
- round-trip tests passing as required checks;
- one bridged channel transaction completed end-to-end.

### Stage 5 — federation B-brains and ecology report

- federation-level activation, channel, bridge, and memory observations enabled;
- first quarterly ecology report generated and reviewed by humans.

### Stage 6 — differentiation by fork

- one fork executed through federation settlement;
- bootstrap protection observed;
- promotion, retention, or retirement decision recorded.

### Stage 7 — Level 5 declared

- DESIGN-3 maturity contract verified (see §24);
- without the economic layer.

### Stage 8 — Level 6 opt-in (later)

- `<name>-federation-ledger` added;
- `payment`, `reputation-drift`, `append-only` censors enforced;
- one complete settlement cycle including ledger entry, dispute window, reputation update;
- only then declare Level 6.

A federation that skips a stage is not faster. It is more brittle, and its first surprise will be more expensive.

---

## 30. Closing — the third bet

DESIGN-1's bet was:

> A branch is a thought.

DESIGN-2's bet was:

> A society becomes intelligent enough to trust only when it can inspect and revise the structures by which it thinks.

DESIGN-3's bet is:

> A society becomes safely networked only when the act of crossing its boundary is held to the same standard as the act of changing its own mind.

The forge already gives us the substrate for one society:

- branches for insulated futures;
- pull requests for settlements;
- reviews for criticism;
- branch protection for censorship;
- commits for memory;
- workflow runs for embodied execution;
- labels and issues for attention;
- merges for action.

The forge also already gives us the substrate for a federation:

- repositories as agencies;
- organisations as societies of societies;
- releases as signed, version-pinned outputs;
- `repository_dispatch` and signed issues as typed inter-society messages;
- cross-repo PRs and labels as federation-spanning settlements;
- branch protection across repositories as federation-wide censorship;
- CODEOWNERS at each tier as the constitutional anchor;
- the git graph itself as the audit trace.

DESIGN-3 adds the missing federation machinery:

- repository roles;
- the three-repo minimum federation;
- Society Channel Protocol on GitHub primitives;
- bridge repositories with round-trip tests;
- federation settlements that span repositories;
- cross-repository insulation, identity, and authority;
- boundary censors and suppressors;
- memory publishing, importing, and consolidation under provenance;
- federation credit assignment;
- the ledger, last;
- federation B-brains and ecology observability;
- evolution by fork, merge, and reviewed retirement.

The result is not a multi-agent framework with a thicker proxy. It is not a marketplace pretending to be a mind. It is not a chatbot federation.

It is a governed ecology of governed ecologies: many small, limited, inspectable repositories, speaking to each other through contracted channels, translating across vocabularies through honest bridges, settling jointly when stimuli cross their boundaries, paying or crediting each other through an append-only ledger, learning at every layer, and answerable to humans at every tier.

DESIGN-1 showed that the repo can think.

DESIGN-2 showed that the repo can learn what kind of thinker it is becoming.

DESIGN-3 shows that many such repos can speak — and that the only honest way for them to speak is to hold the act of speaking to the same standard as the act of thinking.

---

*Source material: [`DESIGN-1.md`](DESIGN-1.md), [`DESIGN-2.md`](DESIGN-2.md), [`research/THE-SOCIETY-OF-REPO/`](../../../research/THE-SOCIETY-OF-REPO/) (especially [`02-protocols/07-service-channel.md`](../../../research/THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md), [`02-protocols/18-bridges.md`](../../../research/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md), [`08-services/`](../../../research/THE-SOCIETY-OF-REPO/08-services/), [`09-channels/`](../../../research/THE-SOCIETY-OF-REPO/09-channels/), [`10-evolution/`](../../../research/THE-SOCIETY-OF-REPO/10-evolution/), [`00-foundations/03-maturity-model.md`](../../../research/THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md), [`00-foundations/09-cognitive-observability.md`](../../../research/THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md)), [`research/THE-SOCIETY-OF-MIND/`](../../../research/THE-SOCIETY-OF-MIND/), [`research/THE-REPO-IS-SOCIETY/`](../../../research/THE-REPO-IS-SOCIETY/), and [`research/FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/) (especially [`13-inter-repo-communication.md`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md) and [`14-three-repo-implementation-targets.md`](../../../research/FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md)). DESIGN-3 is a synthesis of the deferred sections of DESIGN-2 (§22 Networked societies, §23 Economic layer) with the deeper federation, channel, bridge, and evolution research, and a direct successor to DESIGN-1 and DESIGN-2.*
