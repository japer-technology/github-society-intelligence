# DESIGN-2 — From Thought-Branches to a Reflective Society

### A second great attempt at making repo-based AI agents learn, differentiate, and govern themselves without leaving the forge

> The forge is the mind. The repo is an agency. The branch is a thought. The pull request is a settlement. The merge is action. The committed graph is memory. The ecology learns only when the record of learning is itself reviewable.

DESIGN-1 made the essential bet: **a branch is the natural physical substrate for an insulated thought**, and GitHub already provides the primitives needed for a first Minsky-style society: issues, branches, pull requests, reviews, checks, labels, commits, Actions, and merges.

DESIGN-2 keeps that bet, but changes the ambition. DESIGN-1 proves a society can *think on branches*. DESIGN-2 specifies how that society becomes **reflective**:

- it recognises situations with frames before activating agencies;
- it separates cheap recognition from expensive reconstruction;
- it treats settlements as transframes with provenance, unknowns, and blind spots;
- it learns with credit assignment across the whole loop, not only the winning agency;
- it grows by differentiation, protected trials, and concept formation;
- it observes itself through plural B-brains without giving them sovereign authority;
- it can later become networked and economic without mistaking scale for cognition.

DESIGN-2 is therefore not a replacement for DESIGN-1. It is DESIGN-1 with the missing cognitive layer restored.

---

## 1. What DESIGN-2 preserves from DESIGN-1

The seven DESIGN-1 principles remain constitutional:

1. **A branch is a thought.**
2. **A pull request is a settlement.**
3. **A merge is an action.**
4. **Memory is committed history.**
5. **Censors are branch protection.**
6. **Critics are graduated.**
7. **The B-brain reads patterns, not content.**

DESIGN-2 does not weaken these. It sharpens them.

In DESIGN-1, a thought-branch is the proposal surface. In DESIGN-2, a thought-branch is also a **representation boundary**: every durable artifact it proposes must declare what kind of memory or governance object it is becoming.

In DESIGN-1, a settlement is a PR conversation. In DESIGN-2, a settlement is also a **transframe**: a structured account of actor, action, object, before-state, after-state, instrument, cause, evidence, alternatives, unknowns, and memory consequences.

In DESIGN-1, memory is files on `main`. In DESIGN-2, memory is a **typed, linked, temperature-bearing graph of committed artifacts**.

---

## 2. The DESIGN-2 thesis

DESIGN-2 rests on a stronger claim:

> Intelligence in the forge comes not only from activation, criticism, censorship, settlement, and memory, but also from representation, insulation, hierarchy, analogy, developmental growth, self-regulation, and ecology-level self-observation.

DESIGN-1 reaches a Level 3 **Society**: multiple agencies activate, criticise, inhibit, settle, and act.

DESIGN-2 targets Level 4: a **Reflective Learning Society**. A Level 4 society does not only route tasks better. It improves the structures by which it recognises, proposes, criticises, remembers, and changes itself.

The line between Level 3 and Level 4 is this:

```text
Level 3: "Which agency should act?"
Level 4: "What kind of situation is this, what structures made us think so,
          which part of the loop helped or harmed, and what should change?"
```

---

## 3. The refined cognitive loop

DESIGN-1 uses the correct loop:

```text
stimulus
  → perception
  → frame selection
  → K-line activation
  → agency response
  → criticism
  → inhibition
  → censorship
  → settlement
  → action
  → memory
  → credit assignment
  → evolution
```

DESIGN-2 makes several implicit steps explicit:

```text
stimulus
  → event normalization
  → perception
  → recognition pass
  → frame selection
  → analogy fallback when recognition is weak
  → K-line activation and inhibition
  → budgeted agency response on thought-branches
  → critic and censor windows
  → settlement as transframe
  → approval gate where required
  → action by merge or authorized surface write
  → outcome observation
  → consolidation window
  → memory promotion
  → fine-grained credit assignment
  → differentiation, retirement, or concept formation
  → B-brain ecology observation
```

The important additions are:

- **recognition before reconstruction**;
- **frames before K-lines**;
- **analogy before unbounded search**;
- **budgets before work explodes**;
- **settlement windows before action**;
- **consolidation before memory promotion**;
- **credit assignment before reinforcement**;
- **differentiation before retirement**.

---

## 4. Frames before K-lines

DESIGN-1 includes frames and K-lines, but treats frames lightly. DESIGN-2 makes frames first-class.

A K-line answers:

> Which activation pattern worked before?

A frame answers:

> What kind of situation is this?

The order matters. The society should not wake agencies merely because a lexical feature resembles a past task. It should first ask what situation the stimulus belongs to, what defaults apply, what roles are expected, what failures are likely, and what procedures are relevant.

Frame records live under:

```text
.github-society-intelligence/memory/frames/
```

Each frame declares:

```yaml
id:
domain:
status: candidate | probation | active | superseded | retired
default_assumptions: []
required_roles: []
expected_events: []
failure_conditions: []
linked_procedures: []
linked_klines: []
linked_analogies: []
exceptions: []
```

Every non-trivial settlement records:

```yaml
governing_frame:
frame_confidence:
frame_defaults_used:
frame_exceptions_encountered:
```

This lets frame defaults become reviewable instead of hidden in prompts.

---

## 5. Recognition before reconstruction

DESIGN-1 collapses memory lookup into a single retrieval step. DESIGN-2 separates it into two operations.

| Operation | Question | Cost | Result |
| --- | --- | --- | --- |
| **Recognition** | "Have we seen this kind of thing before?" | Cheap | Match score, candidate frame, candidate K-lines |
| **Reconstruction** | "Re-evoke the active pattern that handled it." | Expensive | Frame defaults, K-line slots, prior agencies, analogies, unknowns |

The rule is:

> Reconstruction must be justified by recognition.

This keeps attention bounded. A society that reconstructs full prior contexts for every small stimulus is not thoughtful; it is wasteful.

Recognition can return "no strong match". Reconstruction can return a partial state. Partial returns are not failure. They are **time-blinks**: explicitly marked unknowns that tell downstream agencies what was not recovered.

```yaml
memory_query:
  operation: recognition
  result:
    strongest_frame: frame.contract-renewal
    confidence: 0.71
    reconstruction_allowed: true

reconstruction:
  filled_slots:
    supplier: acme
    deadline: unknown
  low_confidence_slots:
    - renewal_type
  time_blinks:
    - missing prior approval rationale
```

Agencies may not silently treat reconstructed guesses as recalled facts.

---

## 6. Representation discipline

In DESIGN-1, memory is a directory tree. In DESIGN-2, every durable artifact must declare what kind of cognitive object it is.

Every long-lived record carries:

```yaml
representation_class:
status:
temperature: hot | warm | cold | archived
links:
  - type:
    target:
```

Valid representation classes:

```text
event
episodic
semantic
procedural
failure
frame
analogy
concept-candidate
kline
decision
self-model
self-ideal
settlement
```

Valid link types include:

```text
supports
contradicts
caused-by
specialized-from
analogous-to
supersedes
activated-by
derived-from
blocked-by
criticized-by
```

This is the difference between a directory of notes and a mind with differentiated memory.

The rule is simple:

> No durable artifact enters memory without a representation class.

---

## 7. Settlement as transframe

DESIGN-1 says the PR conversation is the settlement. DESIGN-2 keeps the PR as the human-visible surface, but pins the settlement schema more tightly.

A settlement records:

- the stimulus;
- normalized event context;
- recognition result;
- governing frame;
- analogies used;
- K-lines fired;
- agencies activated and inhibited;
- budgets assigned and used;
- proposals made;
- evidence, method, confidence, and alternatives;
- unknowns, blind spots, observability limits;
- critic objections;
- censor blocks;
- suppressor catches;
- approval requirements;
- action authorized or denied;
- memory updates proposed;
- credit-assignment targets;
- follow-up evolution signals.

The settlement file lives on the thought-branch while open:

```text
settlement.yaml
```

and is promoted to decision memory when closed:

```text
.github-society-intelligence/memory/decisions/<settlement-id>.yaml
```

A minimal DESIGN-2 settlement shape:

```yaml
settlement_id:
stimulus:
normalized_event:
recognition:
governing_frame:
analogies_used: []
activation:
  activated: []
  inhibited: []
  suppressed: []
budgets:
  max_agencies:
  max_critic_passes:
  max_wall_clock_seconds:
  max_workspace_items:
proposals: []
objections: []
blocks: []
suppressor_catches: []
approval:
  required:
  basis:
settlement:
  outcome:
  authorized_action:
  winning_branch:
  closed_siblings: []
memory_updates: []
credit_assignment: []
introspection:
  unknowns: []
  blind_spots: []
  opaque_model_dependencies: []
```

Contradictory high-severity critic verdicts do not get averaged. They trigger escalation under the non-compromise principle.

---

## 8. Runtime windows and fail-closed behavior

DESIGN-1 implies that critics and censors run as GitHub checks. DESIGN-2 specifies window semantics.

```yaml
runtime:
  censor_window_seconds: 30
  critic_window_seconds: 120
  approval_window_seconds: 86400
  required_censors:
    - cloud-egress
    - authority
    - credential
  required_critics:
    - evidence
    - risk
  optional_critics:
    - source-quality
    - staleness
```

Rules:

1. A required censor offline at close means **fail closed**.
2. A required critic offline at close means **fail closed** unless the constitution explicitly marks that critic optional for this frame.
3. An optional critic offline is recorded, not ignored.
4. Budget exhaustion does not authorize action. It produces a failure or continuation settlement.
5. A failed-closed settlement is not automatically retried.
6. Re-attempting the same stimulus must cite the failure record.

This prevents silent retry-until-success, one of the easiest ways for a society to erase its own failure signals.

---

## 9. Critics, censors, suppressors

DESIGN-2 keeps the DESIGN-1 distinction:

- **Critics** object.
- **Censors** block.

It adds a third operational category:

- **Suppressors** catch boundary outputs that should not pass, and name the upstream censor or rule that should have prevented the path earlier.

| Function | Timing | Effect | Learning value |
| --- | --- | --- | --- |
| Critic | During deliberation | Objection, requested change, severity | Improves proposal quality |
| Censor | Before action | Non-negotiable block | Enforces constitutional boundary |
| Suppressor | At output boundary | Catch and stop leakage or unsafe action | Reveals missing upstream inhibition |

Suppressor catches are not merely incidents. They are learning events.

```yaml
suppressor_catches:
  - from: suppressor.cloud-egress-output
    boundary: external-call
    upstream_censor_that_should_have_caught: censor.cloud-egress
    severity: high
    learning_proposal: add supplier identity to forbidden outbound fields
```

---

## 10. Attention and resource economy

DESIGN-1 treats branch creation as cheap. It is cheap relative to many alternatives, but attention is not free.

Every activation carries a budget:

```yaml
budgets:
  max_agencies: 6
  max_critic_passes: 4
  max_model_cost: local-only
  max_wall_clock_seconds: 180
  max_workspace_items: 20
```

Budgets are cognitive boundaries, not deployment trivia.

The society must record:

- which agencies consumed attention;
- how many critic passes occurred;
- whether summaries were used instead of raw evidence;
- whether raw evidence escalation was justified;
- whether budget exhaustion was itself a useful signal.

Summary-first routing is the default when evidence volume exceeds the settlement budget. Raw context access requires a reason: uncertainty, dispute, high impact, or censor need.

---

## 11. Hierarchy without monarchy

DESIGN-1 is intentionally flat enough to build. DESIGN-2 adds hierarchy while preserving the anti-homunculus rule.

Hierarchy means:

- lower agencies produce raw proposals and evidence;
- assembly agencies compress them into summaries;
- settlement agencies assemble transframes;
- meta-admin agencies observe patterns and propose structural changes.

Hierarchy does **not** mean:

- one monarch agent decides;
- one planner owns the society;
- one model has final authority.

DESIGN-2 introduces summary tiers:

```text
raw evidence
working summary
assembly summary
settlement summary
owner briefing
```

The higher the tier, the stronger the obligation to preserve links back to lower-tier evidence.

An assembly agency may compress. It may not erase dissent, censor blocks, confidence limits, or minority critic views.

---

## 12. Insulation as law

DESIGN-1 identifies branch insulation as the substrate. DESIGN-2 generalizes insulation into an explicit architectural rule.

The society maintains an insulation map:

```yaml
insulation:
  private_by_default: true
  shared_only_by:
    - settlement
    - approved_memory_promotion
    - service_contract
    - explicit_bridge
  forbidden_direct_state_sharing:
    - from: agency.finance-watch
      to: agency.contract-bee
      reason: prevent price analysis from contaminating obligation extraction
```

Insulation prevents:

- over-coupled agencies;
- double-purpose deadlock;
- shared-state drift;
- premature consensus;
- hidden dependency on another agency's private micronemes.

Agencies may consume another agency's settled outputs. They may not depend on its private working state.

---

## 13. Analogy and bridges

When no frame or K-line strongly matches, DESIGN-2 does not default to unbounded deliberation. It runs an analogy pass.

An analogy record declares:

```yaml
id:
source_frame:
target_frame:
shared_structure:
known_mismatches:
transfer_confidence:
bridge_required:
```

Analogy is allowed to wake agencies, but with dampened confidence and explicit transfer notes.

For cross-realm analogies, a bridge is required. A bridge is not a utility function. It is an agency with:

- declared direction;
- declared lossiness;
- invariants;
- round-trip tests;
- authority limits;
- settlement-reviewed outputs.

This keeps metaphor useful without letting metaphor silently become fact.

---

## 14. Memory promotion and consolidation

DESIGN-1 writes memory after merge. DESIGN-2 inserts a consolidation window.

Outcome is not memory yet. Outcome becomes memory after a settled promotion decision.

```yaml
consolidation_window:
  opens_at:
  minimum_duration: P1H
  maximum_duration: P24H
  required_inputs_before_close:
    - credit_assignment_record
    - introspection_record
    - late_critic_objections
    - suppressor_firings
  closing_decision:
```

This deliberate slowness is a feature:

- late signals can arrive;
- credit can be assigned across the loop;
- failure memories can be separated from episodic memories;
- K-line updates can be proposed instead of impulsively written;
- concept candidates can be noticed from repeated patterns.

Promotion targets:

| Runtime artifact | Memory target |
| --- | --- |
| Redacted event payload | events |
| Completed settlement | decisions |
| Specific experience | episodic |
| Generalized fact | semantic |
| Accepted procedure | procedural |
| Failed path | failure |
| Repeated activation pattern | K-line |
| Reusable situation model | frame |
| Structural similarity | analogy |
| Emerging abstraction | concept candidate |

Secrets, tokens, passwords, raw credentials, and sensitive payloads are never memory artifacts.

---

## 15. Credit assignment across the whole loop

DESIGN-1 assigns credit mainly to participating agencies and K-lines. DESIGN-2 assigns credit to every important part of the loop.

Credit targets:

```text
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
```

A winning agency may receive negative credit if it succeeded despite bad evidence. A critic may receive positive credit even when its objection did not win, if later evidence proves it was useful. A censor may receive positive credit for blocking a dangerous path and negative credit for excessive false positives.

Example:

```yaml
credit_assignment:
  - target: frame.contract-renewal
    signal: positive
    reason: selected frame predicted deadline and approval requirements
  - target: agency.finance-watch
    signal: mixed
    reason: useful price comparison, but attempted forbidden cloud egress
  - target: censor.cloud-egress
    signal: positive
    reason: blocked outbound supplier-identifying payload
  - target: critic.evidence
    signal: positive
    reason: low-confidence clause objection forced better citation
```

Learning without fine-grained credit is only mood.

---

## 16. Evolution: differentiate before retire

DESIGN-1 can retire weak agencies. DESIGN-2 adds the missing growth mechanism:

> duplicate, differentiate, compare, promote, merge, or retire.

When one agency shows double-purpose pressure, the society does not immediately punish it. It opens a differentiation settlement.

```text
agency.contract-bee
  → agency.contract-obligation-bee
  → agency.contract-risk-bee
```

The successor trial records:

```yaml
specialized_from:
trial_window:
protected_bootstrap: true
comparison_metrics:
  - constitutional_compliance
  - evidence_quality
  - false_positive_rate
  - settlement_usefulness
promotion_criteria:
rollback_plan:
```

New agencies receive developmental protection. During bootstrap, they are judged first on safety, constitutional compliance, non-harm, and evidence quality — not raw productivity.

This implements the investment principle: do not destroy a developing skill because it is not yet as efficient as a mature one.

---

## 17. Concept formation

A Level 4 society should not only reinforce routes. It should invent better intermediate abstractions.

Repeated settlement patterns may propose concept candidates:

```yaml
representation_class: concept-candidate
id: concept.recurring-supplier-risk
examples: []
non_examples: []
predicted_use:
linked_frames: []
linked_failures: []
promotion_requirements:
governance_status: probation
```

Concept candidates can become:

- new semantic categories;
- new frame defaults;
- new critic dimensions;
- new K-line features;
- new service boundaries;
- new self-ideal language.

They must include examples and non-examples. A concept without non-examples is usually just a label.

---

## 18. Self-models and self-ideals

DESIGN-1 uses one `self-model.yaml`. DESIGN-2 pluralizes self-models.

The society may hold several self-models:

```text
self-model.operational
self-model.memory-quality
self-model.safety-boundaries
self-model.economic-capacity
self-model.owner-trust
```

No self-model is the Self. Each is a bounded model with honesty fields:

```yaml
scope:
known_capabilities: []
known_limits: []
blind_spots: []
load_bearing_for_governance: false
last_validated_at:
```

DESIGN-2 also adds self-ideals: slow-changing internal norms that guide settlements without pretending to be emotions or desires.

Examples:

```text
evidence before confidence
reversible change before irreversible change
local-first where risk is comparable
restraint under uncertainty
human approval for authority expansion
```

High-impact settlements cite relevant ideals. Repeated behavior against an ideal triggers drift review.

---

## 19. B-brains as plural observers

DESIGN-1 introduces a B-brain that reads patterns, not content. DESIGN-2 makes it plural.

Examples:

```text
activation-steward
memory-steward
representation-steward
evaluation-steward
ecology-monitor
governance-drift-monitor
```

They observe:

- activation rates;
- settlement latency;
- critic usefulness;
- censor saturation;
- suppressor catches;
- K-line precision;
- repeated budget exhaustion;
- single-agency dominance;
- groupthink;
- unnecessary deliberation;
- stale frames;
- repeated unknowns.

They may open issues, propose settlements, or request reviews. They may not merge their own structural changes.

The meta-layer must not become a monarch.

---

## 20. Operational body, governed mind

The research distinguishes the operational body from the governed cognitive layer. DESIGN-2 adopts that distinction.

| Layer | GitHub realization | Role |
| --- | --- | --- |
| **Body** | Actions runners, workflow logs, tokens, API adapters, branch protection, storage | Executes and constrains |
| **Brain** | classifiers, retrieval, local or cloud models, similarity indexes | Produces candidate patterns |
| **Mind** | settlements, critics, censors, constitutions, memory promotion, self-ideals | Governs meaning and authorization |

A successful workflow run is not a settlement. It is execution evidence.

A model answer is not memory. It is a candidate output.

A passing check is not wisdom. It is one signal inside a settlement.

DESIGN-2 keeps this boundary explicit so the project does not confuse operational automation with cognition.

---

## 21. GitHub first, Forgejo honest

DESIGN-1 chooses GitHub.com for the first build because it is the shortest install path. The research corpus also contains a detailed Forgejo path.

DESIGN-2 treats GitHub and Forgejo as two forge bodies that can host the same cognitive contract, with different operational surfaces.

| Cognitive function | GitHub path | Forgejo path |
| --- | --- | --- |
| Event loop | `.github/workflows/` | `.forgejo/workflows/` |
| Runtime state | `.github-society-intelligence/state/` | `.forgejo-intelligence/state/` |
| Agent runtime | `.github-society-intelligence/` | `.forgejo-intelligence/` |
| Governance and memory | `.github-society-intelligence/` | `THE-SOCIETY-OF-REPO/` or instance-specific equivalent |
| Proposal surface | Pull requests | Pull requests |
| Action surface | Merge commits and API writes | Merge commits and Forgejo API writes |

DESIGN-2 does not claim false parity. GitHub-only capabilities are optional surfaces, not cognitive requirements. Forgejo-only deployment controls are implementation details, not changes to the society's mind.

---

## 22. Networked societies

DESIGN-1 defers multi-repo and inter-society channels. DESIGN-2 still does not make them part of the minimum viable build, but it specifies the design direction.

A Society Channel is not an API call. It is a governed cognitive transaction:

```text
service contract
input rights
output rights
pricing or reciprocal credits
privacy terms
retention terms
audit trace
confidence score
dispute window
reputation update
```

Every outbound channel passes:

1. service discovery;
2. contract check;
3. budget check;
4. cloud-egress or data-egress censor;
5. approval gate where needed;
6. input-rights check by the provider;
7. output validation;
8. audit and reputation update.

Network reach does not imply deeper cognition. A Level 5 society that lacks frames, introspection, relational memory, and credit assignment is operationally connected but cognitively shallow.

---

## 23. Economic layer, later

The economic layer belongs after reflective discipline, not before it.

DESIGN-2 defines the future hooks:

- per-service prices or reciprocal credits;
- budget limits per settlement;
- cost attribution by agency and channel;
- reputation for service providers;
- dispute windows;
- monthly governance review thresholds.

But the rule is:

> Do not monetize routes the society cannot explain, censor, audit, or learn from.

Economic behavior without reflective memory only makes mistakes faster and more expensive.

---

## 24. Bootstrap path

DESIGN-1 ends with a minimum viable build. DESIGN-2 makes the day-one path more explicit.

### Stage 0 — dormant substrate

- `.github-society-intelligence/constitution.yaml`
- runtime enable flag
- CODEOWNERS or equivalent human anchor
- branch protection on `main`
- no autonomous action yet

### Stage 1 — one safe loop

- one intake/perception agency;
- one worker agency;
- one evidence critic;
- one authority or credential censor;
- one frame;
- one K-line;
- one issue-triggered settlement;
- human approval required for merge.

### Stage 2 — reflective memory

- recognition before reconstruction;
- decision memory;
- episodic memory;
- failure memory;
- K-line update PRs;
- explicit unknowns and blind spots in settlements.

### Stage 3 — Level 4 candidate

- frame exceptions;
- analogy fallback;
- credit assignment across the loop;
- consolidation window;
- one differentiation trial;
- one concept candidate;
- B-brain pattern observation.

Only after Stage 3 should the society claim reflective learning.

---

## 25. Minimal repository layout for DESIGN-2

```text
<your-repo>/
├── .github/
│   └── workflows/
│       ├── perceive.yml
│       ├── activate.yml
│       ├── critique.yml
│       ├── censor.yml
│       ├── settle.yml
│       ├── consolidate.yml
│       └── observe.yml
├── .github-society-intelligence/
│   ├── constitution.yaml
│   ├── representation.yaml
│   ├── insulation-map.yaml
│   ├── agencies/
│   ├── critics/
│   ├── censors/
│   ├── suppressors/
│   ├── memory/
│   │   ├── events/
│   │   ├── episodic/
│   │   ├── semantic/
│   │   ├── procedural/
│   │   ├── failure/
│   │   ├── frames/
│   │   ├── analogies/
│   │   ├── concepts/
│   │   ├── klines/
│   │   └── decisions/
│   ├── workspace/
│   │   ├── current-focus.yaml
│   │   └── active-settlements/
│   └── state/
│       ├── self-models/
│       ├── self-ideals/
│       └── ecology-report.yaml
├── DESIGN-1.md
└── DESIGN-2.md
```

DESIGN-2 adds:

- `representation.yaml`;
- `insulation-map.yaml`;
- `suppressors/`;
- `memory/events/`;
- `memory/concepts/`;
- `consolidate.yml`;
- plural self-models and self-ideals.

---

## 26. The DESIGN-2 maturity contract

To claim DESIGN-2 compliance, a repository-local society must demonstrate:

- [ ] at least one frame used before K-line activation;
- [ ] recognition and reconstruction recorded separately;
- [ ] every durable memory artifact declares `representation_class`;
- [ ] settlements record evidence, method, confidence, alternatives, unknowns, and blind spots;
- [ ] censors fail closed and cannot be overridden by proposers;
- [ ] suppressor catches are recorded as learning events;
- [ ] credit assignment covers at least frame, K-line, proposal, critic, censor, settlement, and memory promotion;
- [ ] memory promotion passes through a consolidation window;
- [ ] at least one B-brain observer reads metadata patterns only;
- [ ] at least one evolution path exists for differentiation, not only retirement;
- [ ] self-models are plural or explicitly scoped;
- [ ] self-ideals exist and are cited by high-impact settlements;
- [ ] network or economic features, if present, do not bypass settlement, censorship, memory, or approval.

If these do not hold, the system may still be useful, but it is not yet DESIGN-2.

---

## 27. Worked example — renewal contract, second pass

The DESIGN-1 example begins when a contract PDF is attached to an issue. DESIGN-2 runs the same case with deeper structure.

1. **Stimulus**: Issue opened with renewal contract.
2. **Event normalization**: The issue body, attachment metadata, actor, repository, and surface are normalized.
3. **Recognition**: The memory index reports a 0.78 match to previous supplier-renewal episodes.
4. **Frame selection**: `frame.contract-renewal` is selected with confidence 0.83.
5. **Reconstruction**: Prior activation pattern is partially reconstructed; `deadline` is unknown and marked as a time-blink.
6. **K-line activation**: `kline.contract-renewal` wakes `contract-bee`, `finance-watch`, `risk-critic`, and `privacy-censor`; it softly inhibits unrelated staff and marketing agencies.
7. **Budgeting**: Activation budget allows four agencies, two critic passes, local-only model use, and 180 seconds.
8. **Thought-branches**:
   - `think/stl-.../contract-bee/extract-obligations`
   - `think/stl-.../finance-watch/compare-pricing`
   - `think/stl-.../risk-critic/auto-renewal-risk`
9. **Proposals**: Each branch writes `settlement.yaml`, proposal text, evidence, confidence, unknowns, and cited procedures.
10. **Criticism**: Evidence critic flags clause 7 confidence. Risk critic flags auto-renewal ambiguity.
11. **Censorship**: Cloud-egress censor blocks a supplier-identifying external call from `finance-watch`.
12. **Suppressor catch**: A proposed owner briefing includes too much raw supplier context. The suppressor catches it and proposes a stricter briefing redaction rule.
13. **Settlement**: The contract-bee branch wins after revision. Finance-watch is closed as useful-but-blocked. Risk critic's objection is recorded as positive credit.
14. **Approval**: Human approval is required because legal escalation is in scope.
15. **Action**: The approved PR merges.
16. **Consolidation**: A one-hour window collects late signals and credit records.
17. **Memory promotion**:
    - episodic record for this renewal;
    - decision record for the settlement;
    - failure record for the blocked cloud-egress attempt;
    - K-line reinforcement with a caution flag;
    - suppressor learning proposal.
18. **Credit assignment**:
    - frame positive;
    - contract-bee positive;
    - finance-watch mixed;
    - cloud-egress censor positive;
    - evidence critic positive;
    - suppressor positive.
19. **Evolution signal**: Repeated finance-watch cloud-egress attempts trigger a B-brain anomaly.
20. **Differentiation proposal**: The meta-admin agency proposes splitting finance-watch into local-price-history and external-market-comparison variants, with the latter requiring stronger approval gates.

This is not just a better answer to a contract issue. It is a society learning which parts of its own cognition need to change.

---

## 28. Anti-patterns DESIGN-2 must prevent

DESIGN-2 explicitly defends against:

- **Monarch agent** — one agent becomes the hidden decider.
- **Prompt swamp** — cognitive rules live in prompts instead of versioned protocols.
- **Memory hoarding** — everything is saved without representation class, temperature, or links.
- **Cloud leakage** — external calls bypass censors and rights.
- **No settlement** — action happens without a visible decision record.
- **Retry-until-success** — failures are erased by automatic retries.
- **False parity** — GitHub or Forgejo features are claimed without operational support.
- **Over-coupled ecology** — agencies share private state instead of settled outputs.
- **Double-purpose deadlock** — one agency carries conflicting functions and cannot specialize.
- **Overconfidence without provenance** — proposals lack evidence, method, alternatives, or blind spots.
- **Economic acceleration before cognition** — services, credits, or pricing precede reflective discipline.

If an implementation drifts into these, it may still automate work, but it is no longer a faithful descendant of DESIGN-2.

---

## 29. What DESIGN-2 still does not claim

DESIGN-2 is still honest about its boundaries.

It does not claim:

- sentience;
- emotion;
- human-like consciousness;
- complete Minsky fidelity;
- automatic frame formation from raw experience;
- safe open-ended self-modification;
- perfect Forgejo/GitHub parity;
- that networking or economics make a society wiser.

It claims something narrower and stronger:

> A repository-native AI society can become reflectively governable when every significant cognition-shaped act is represented as a branch, settlement, review, censor check, committed memory artifact, and revisable evolution record.

---

## 30. Closing — the second bet

DESIGN-1's bet was:

> A branch is a thought.

DESIGN-2's bet is:

> A society becomes intelligent enough to trust only when it can inspect and revise the structures by which it thinks.

The forge already gives us the substrate:

- branches for insulated futures;
- pull requests for settlements;
- reviews for criticism;
- branch protection for censorship;
- commits for memory;
- workflow runs for embodied execution;
- labels and issues for attention;
- merges for action.

DESIGN-2 adds the missing reflective machinery:

- frames;
- representation discipline;
- recognition and reconstruction;
- analogy;
- hierarchy;
- insulation maps;
- consolidation windows;
- fine-grained credit assignment;
- differentiation;
- concept formation;
- self-models;
- self-ideals;
- plural B-brains.

The result is not a chatbot with tools. It is not a custom multi-agent framework pretending to be a mind.

It is a governed ecology of small, limited, inspectable agencies whose intelligence lives in the structured interaction among them — and whose learning is visible as ordinary, reviewable, revertable Git history.

DESIGN-1 showed that the repo can think.

DESIGN-2 shows how the repo can learn what kind of thinker it is becoming.

---

*Source material: [`DESIGN-1.md`](DESIGN-1.md), [`research/THE-SOCIETY-OF-REPO/`](research/THE-SOCIETY-OF-REPO/), [`research/THE-SOCIETY-OF-MIND/`](research/THE-SOCIETY-OF-MIND/), [`research/THE-REPO-IS-SOCIETY/`](research/THE-REPO-IS-SOCIETY/), and [`research/FORGEJO-SOCIETY-IMPLEMENTATION/`](research/FORGEJO-SOCIETY-IMPLEMENTATION/). DESIGN-2 is a synthesis of the deeper research layer and a direct successor to DESIGN-1.*
