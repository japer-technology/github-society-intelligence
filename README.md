# GitHub Society Intelligence

#### Please read [more](.github-society-intelligence/README.md) before you install this AI Agent.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/github-society-intelligence/main/.github-society-intelligence/logo.png" alt="Society Intelligence" width="500">
  </picture>
</p>

> **The forge is the mind. The repo is an agency. The branch is a thought. The pull request is a proposal. The merge is a committed change to the organism.**

GitHub Society Intelligence is a repository-local AI framework that turns a single GitHub repository into the substrate for a Minsky-style cognitive society. Issues become stimuli, branches become insulated futures, pull requests become proposed actions, reviews become criticism, branch protection enforces censorship, merges become accepted changes, and commits become durable memory.

---

## Start here

| Document | What it is |
| --- | --- |
| [`DESIGN-1.md`](DESIGN-1.md) | **First great attempt** at implementing Marvin Minsky's *Society of Mind* using repo-based AI agents that think on branches. The single most concrete document in this repository — read this first if you want to know what we are actually building. |
| [`.github-society-intelligence/README.md`](.github-society-intelligence/README.md) | The installable agent runtime today: one workflow file, GitHub Issues as the conversation surface, Git as persistent memory. |
| [`research/THE-SOCIETY-OF-REPO/README.md`](research/THE-SOCIETY-OF-REPO/README.md) | The full specification of a repo-native cognitive society — governance, protocols, agencies, critics, censors, memory, workspace, services, channels, evolution. |
| [`research/THE-SOCIETY-OF-MIND/`](research/THE-SOCIETY-OF-MIND/) | The source-text companion to Minsky's *The Society of Mind* (1986) and the term-by-term crosswalk to the Society-of-Repo vocabulary. |
| [`research/THE-REPO-IS-SOCIETY/`](research/THE-REPO-IS-SOCIETY/) | Earlier framing essays on why the repository is the right cognitive unit. |
| [`research/FORGEJO-SOCIETY-IMPLEMENTATION/`](research/FORGEJO-SOCIETY-IMPLEMENTATION/) | A sibling implementation pathway targeting self-hosted Forgejo. |

---

## The bet, in one paragraph

Most attempts to build multi-agent AI systems reach for a custom framework and a vector store, then bolt cognitive metaphors on top. We make the opposite bet: **GitHub already is the substrate**. A Git branch is the natural physical realisation of a Minsky-style *thought* — insulated, speculative, inspectable, cheap, composable, and reviewable. A pull request is the natural realisation of a *settlement* — a visible record of how a judgment formed, with structured criticism, hard censorship via required checks, and human approval where the constitution demands it. The full design lives in [`DESIGN-1.md`](DESIGN-1.md).

---

## The cognitive loop, in GitHub primitives

```
issue / comment / push / schedule    →  stimulus
perception workflow                   →  features + confidence
frame selection                       →  which kind of situation is this?
K-line activation                     →  which agencies wake?
agency response                       →  each opens a `think/<settlement>/<agency>/…` branch + draft PR
critic agencies                       →  PR reviews (graduated, evidence-weighted)
censor agencies                       →  required status checks (non-negotiable, branch-protected)
settlement                            →  the PR conversation itself
action                                →  the merge to `main`
memory                                →  commits + structured files under `memory/`
credit assignment                     →  post-merge workflow updates K-line weights via PR
reinforcement + evolution             →  frames refined, agencies retired — all as reviewable diffs
```

Every artifact is a file, a commit, a PR, a label, a check, a review, or an issue. Nothing is hidden. Memory is revertable. Learning is reviewable.

---

## Status

This repository holds three concentric layers:

1. **The installable runtime** ([`.github-society-intelligence/`](.github-society-intelligence/)) — works today as a single-workflow GitHub Actions agent with Git-versioned memory.
2. **The design** ([`DESIGN-1.md`](DESIGN-1.md)) — the first opinionated attempt at evolving the runtime into a full Minsky-style society on GitHub primitives.
3. **The research** ([`research/`](research/)) — the deep theoretical and architectural grounding the design draws on.

Read [`DESIGN-1.md`](DESIGN-1.md) to see how they connect.
