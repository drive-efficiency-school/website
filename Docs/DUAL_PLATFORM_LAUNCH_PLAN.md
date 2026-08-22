# Website — dual-platform launch implementation plan

**Created:** 2026-08-23
**Branch:** `feat/website-dual-platform-launch` (off `release/v1.5`)
**Trigger:** Google Play **production access granted** 2026-08-23. The site can finally say Android is available without it being untrue.

**House rule:** `npm run test:e2e` green is the gate for every change here.

---

## Why a new branch, not the old one

`feat/android-website-content` exists (4 commits, branched **2026-06-26**) and already
did this work once — but it is **29 commits behind `release/v1.5`**. It predates the
v1.5 content rewrite, the fleet privacy disclosure and the version-free share
titles. Merging it would revert two months of copy.

Its _ideas_ are reused; its _diff_ is not. Salvage assessment:

| From `feat/android-website-content`                 | Verdict                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `config.ts` — Play Store URL                        | ✅ reuse verbatim (correct package `school.efficiency.drive.efficiver`)                                |
| `Hero.vue` — dual CTA pattern                       | ✅ reuse the pattern, re-apply by hand (Hero has changed since)                                        |
| `Hero.vue` — "FaceID Secured" → "Biometric Secured" | ✅ reuse — genuinely wrong on Android                                                                  |
| `Footer.vue`                                        | ⚠️ mostly obsolete — `release/v1.5` already ships the Android link + `(soon)` chip; only the chip goes |
| `e2e/03-content-truth.spec.ts`                      | ✅ **the most valuable piece** — see below                                                             |

**Leave the old branch in place.** Do not delete it until this ships; it is the
only record of the original dual-platform pass.

---

## ⚠️ The e2e suite currently blocks the launch copy

`e2e/03-content-truth.spec.ts:73` **asserts the "(soon)" chip must be present**:

```js
expect(footerTxt).toMatch(/Android\s*\(soon\)/i)
```

That test exists to stop the site over-claiming — it did its job for two months.
The moment Android is presented as launched it fails, and `test:e2e` is the deploy
gate. **Realigning this suite is not optional cleanup; it is part of the change.**

The suite must flip from _"assert Android is NOT yet available"_ to _"assert
Android IS available and the old hedge wording is gone"_ — keeping the ban on
"coming soon" in both directions.

---

## Scope

### Phase 1 — Launch copy 🔴 this release

| ID      | Change                                                                                                  | Files                             | Done                               |
| ------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------- |
| **L1**  | Play Store URL as the default (env var still wins)                                                      | `src/lib/config.ts`               | ✅                                 |
| **L2**  | Hero: dual CTA — "Download on the App Store" + "Get it on Google Play"                                  | `src/components/Hero.vue`         | ✅                                 |
| **L3**  | Drop the `(soon)` chip                                                                                  | `src/components/Footer.vue`       | ✅ **no code change needed**       |
| **L4**  | "FaceID Secured" → "Biometric Secured" (Face ID is iOS-only)                                            | `src/components/Hero.vue`         | ✅                                 |
| **L5**  | Realign the content-truth suite to dual-platform launched                                               | `e2e/03-content-truth.spec.ts`    | ✅                                 |
| **L10** | FAQ: "An Android port is in active development" → available on Google Play, with the device requirement | `src/components/FAQ.vue`          | ✅ **found during implementation** |
| **L11** | Help: remove Android from "On the Roadmap"; correct the iOS-only shipping prose                         | `src/components/Help.vue`         | ✅ **found during implementation** |
| **L12** | Reframe the M10 "FaceID Secured" assertion — it was audited ACCURATE for an iOS-only product            | `e2e/04-brand-and-chrome.spec.ts` | ✅ **found by the suite**          |

### What the plan missed, and how it surfaced

- **L3 needed no code.** `Footer.vue` was already written to flip on
  `v-if="config.app.android"`, so setting the URL activated the link and retired
  the `(soon)` span by itself. The `v-else` branch is kept deliberately: clearing
  the env var reverts the site to iOS-only rather than linking to nothing.
- **L10 / L11 were found by reading the failing assertion**, not by planning. The
  e2e test pointed at FAQ copy ("An Android port is in active development") that
  the plan had not listed; a grep for the same hedge then turned up two more
  claims in `Help.vue`, including Android sitting under "On the Roadmap".
- **L12 was found by the suite itself.** `04-brand-and-chrome.spec.ts` asserted
  `FaceID Secured` must be present, audited as "verified accurate" — and it _was_,
  while iOS was the only platform. This is the second contract flip in the change:
  a claim that was true becomes platform-incomplete the moment a second platform
  ships.

### Phase 2 — Correctness that the launch forces 🔴

Launching Android turns three known-wrong statements from _latent_ into _published
alongside a download button_. From `docs/Efficiver_Product_Playbook_v1.0_Website_Claims.md`:

| ID     | Playbook    | Issue                                                                                                                       | Status                              |
| ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **L6** | **A3 / W3** | Privacy Policy tells Android users there is **"no cloud sync"** while the app backs the drive database to Google by default | 🟡 **blocked on owner decision O5** |
| **L7** | **W16**     | Terms of Use do not cover Android at all                                                                                    | 🔴 ready                            |
| **L8** | **W18**     | Help.vue says "currently v1.3"                                                                                              | 🔴 ready                            |
| **L9** | **W19**     | Android status copy — the playbook explicitly says to coordinate with the parked branch                                     | 🔴 folded into Phase 1              |

**L6 is the one that matters.** Play validates the privacy-policy URL at review
time, and production access was just granted. Publishing "download it on Google
Play" beside a false statement about Android data handling is the real exposure —
not a copy nit.

### Out of scope — recorded so it is not lost

The playbook's other 17 items (W1, W2, W4–W15, W17, W20) — 11 factually wrong
statements, unsupported claims, absolute privacy wording, and the commercial
workstream that is gated on store approvals anyway. **This branch does not touch
them.** They remain open in the playbook.

---

## Sequencing

```
Phase 1 (L1-L5) ──→ test:e2e green ──┐
                                     ├─→ deploy DEV ──→ owner visual pass
Phase 2 (L7, L8) ────────────────────┘
L6 ── blocked on O5 ─────────────────────→ must land before PRODUCTION deploy
```

**Order that avoids lying in either direction:** promote the Android app to Play
**production first**, then deploy the website. A site claiming "available on Google
Play" before the listing is live is the worse failure of the two.

---

## Decisions needed

| ID     | Question                                                                                                                    | Blocks                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **O5** | Android Auto Backup — exclude `databases/` from `data_extraction_rules.xml`, **or** correct the policy and disclose in-app? | L6, and production deploy |
| **D1** | Deploy Phase 1 to dev before Phase 2 is complete, or hold both?                                                             | sequencing only           |

---

## Verification

- `npm run test:e2e` green — the house gate
- `npm run build` clean (`vue-tsc` type-check runs first)
- Owner visual pass on dev before any production deploy
- Android production listing confirmed **live** before the site claims it

---

## Status

| Item                                 | Status                               |
| ------------------------------------ | ------------------------------------ |
| Branch created off `release/v1.5`    | ✅                                   |
| Phase 1 (L1–L5, L10–L12)             | ✅ complete                          |
| `vue-tsc` type-check                 | ✅ clean                             |
| `npm run test:e2e`                   | ✅ **80 passed, 0 failed**           |
| Phase 2 (L7 Terms, L8 stale version) | ☐                                    |
| L6 privacy fix                       | 🟡 blocked on O5                     |
| Dev deploy                           | ☐                                    |
| Production deploy                    | ☐ gated on Android listing live + L6 |

**Environment note:** the Playwright chromium binary was missing on this machine —
every page test failed at 0 ms until `npx playwright install chromium` was run.
Worth knowing before reading a future red suite as a code regression.
