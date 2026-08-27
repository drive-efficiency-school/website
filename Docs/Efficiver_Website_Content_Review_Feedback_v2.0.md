# Efficiver Development Website — Post-Implementation Review

| Field            | Details                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Website reviewed | [Efficiver development website](https://www-dev.efficiver.com/) after implementation of the first-review feedback |
| Reference        | `Efficiver_Website_Content_Review_Feedback_v1.0.md`                                                               |
| Review scope     | Product claims, content consistency, metadata, privacy, pricing and technical clarity                             |

## 1. Overall assessment

The website has improved substantially and most of the original feedback has been implemented. In particular, the unsupported percentage claim, broad competitor comparisons, Investor page, traction wording and one-time calibration wording have been corrected.

A small number of important inconsistencies remain, mainly involving privacy, iCloud behaviour, pricing and residual fuel-saving, offline and safety wording.

## 2. Status of remaining items from the original review

| Area                             | Status                                         | Current assessment                                                                                                                                        |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fuel, cost and CO₂ estimates     | **Mostly resolved**                            | Main feature descriptions label these outputs as estimates. Some broader outcome language remains elsewhere.                                              |
| Safety claims                    | **Mostly resolved**                            | Visible safety-benefit wording was removed and an appropriate safety disclaimer was added. “Safe driving” remains in metadata and image alternative text. |
| Privacy wording                  | **Open**                                       | Absolute statements remain and do not fully account for Fleet and connected-service data flows.                                                           |
| Offline wording                  | **Mostly resolved**                            | The FAQ now separates offline core functions from connected features. Some broader offline wording remains elsewhere.                                     |
| Pricing                          | **Partially resolved**                         | The plans are clearer, but the hero message, plan wording and pricing buttons need correction.                                                            |
| GPS behaviour                    | **Improved - Technical confirmation required** | Weak-signal and recovery behaviour are explained, but the technical team should confirm that the wording exactly matches both apps.                       |
| Battery and background operation | **Mostly resolved**                            | “Minimal battery drain” has been removed. The remaining background and low-power descriptions require normal technical confirmation.                      |

## 3. Required changes

### 3.1 Align the privacy wording

The following statements are still too absolute:

- Features: **“No tracking, ever.”**
- Social-sharing metadata: **“Your drives never reach Efficiver's servers.”**
- FAQ: **“We don't collect, store, or sell your driving data.”** without mentioning Fleet.
- Privacy Policy summary: Efficiver says that it does not share personal information with anyone except the user's fleet, although the same summary and later sections disclose location requests to map and weather providers.
- Privacy Policy summary: The Fleet exception is followed by **“which almost nobody does”**. The website does not show evidence for this usage statement, and the phrase unnecessarily minimises a material privacy exception. The phrase **“which almost nobody does”** should be removed. The Fleet exception should be described neutrally, without making an unverified statement about how many users join a fleet.

These statements do not fully account for:

- On-duty drive uploads after a driver joins Efficiver Fleet.
- Location requests made to map and weather providers.
- iCloud or Android platform backup.
- Information submitted through website forms.

Suggested replacement:

> Personal drive records are stored on your device. On-duty drives are uploaded only if you choose to join Efficiver Fleet. Maps, weather, backup and other connected-service data flows are explained in our Privacy Policy. Efficiver does not use advertising identifiers or third-party analytics.

### 3.2 Resolve the iCloud contradiction

The website currently gives different explanations:

- Privacy Policy: Efficiver has no separate synchronization switch; synchronization occurs while the user is signed into iCloud.
- FAQ: iCloud synchronization is optional.
- Help and Releases: synchronization is optional, off by default and controlled by a toggle.

**Required action:** The technical team should confirm the implemented behaviour. Features, FAQ, Help, Releases and Privacy Policy must then use one consistent explanation.

### 3.3 Correct the remaining fuel and emissions language

The homepage and Features section still say that Efficiver is designed to **save fuel** and **reduce emissions**. Help and older Release content also refer to fuel, money or CO₂ that the user “saved.”

The alternative text for one product screenshot still says **“Efficiver app screenshot showing fuel savings metrics.”** Because the outputs are estimates, change it to:

> Efficiver app screenshot showing estimated fuel and CO₂ metrics

Recommended main description:

> Efficiver is a phone-only driving coach designed to help users understand and improve driving efficiency. It provides estimated fuel, cost and CO₂ impact without requiring additional vehicle hardware.

Recommended Wallet Watch wording:

> View estimated fuel or energy use, cost and CO₂ impact using your trip data and configured vehicle information.

### 3.4 Remove residual safety positioning

Remove **“safe driving”** from:

- The metadata keywords.
- The logo image alternative text.

The safety limitation in the Terms of Use and the disclaimer near the Features section should remain because they define the product boundary rather than claim a safety benefit.

Suggested logo alternative text:

> Efficiver logo - phone-based driving efficiency coach

### 3.5 Qualify broad offline wording

Broad offline wording remains in the hero, Features introduction and How It Works section. The Features introduction says that Efficiver works **“all without needing internet or hardware,”** although maps, weather, route planning, platform synchronization or backup, and Fleet uploads require connected services.

Suggested wording:

> Core trip recording and scoring work without an internet connection or additional vehicle hardware. Maps, weather, route planning, platform synchronization or backup, and Fleet uploads use connected services.

### 3.6 Reconcile pricing and correct the calls to action

**Confirmed inconsistency:**

- The hero says **“Limited Time Offer – Free!”**, while the base plan says **“Free forever.”** The team should choose one consistent message.

**Messaging clarification:**

- **“Free for every driver”** is not necessarily inconsistent with a commercial Fleet offering. However, it may give the impression that every product offering is free. If the personal app is free while Fleet is commercial, **“Free for personal use”** would be clearer.

**Other corrections:**

- The page says **“Efficiver Pro adds depth”** although Pro is marked **“Coming soon.”**
- The pricing-card buttons do not currently perform their intended actions.

Recommended structure:

| Plan            | Recommended message                   | Button action                            |
| --------------- | ------------------------------------- | ---------------------------------------- |
| Efficiver       | Free for personal use                 | Open the appropriate app-store page      |
| Efficiver Pro   | Coming soon - pricing being finalised | Show “Coming soon” or open a waitlist    |
| Efficiver Fleet | Contact us                            | Open or scroll to the Fleet enquiry form |

Consider changing **“Efficiver Pro adds depth”** to **“Efficiver Pro will add deeper insights and history.”**

### 3.7 Confirm whether metadata describes available features

The social-sharing metadata presents AI pattern narration, Year Recap and forecasts as available. The Pricing section and FAQ indicate that some forecast and deeper-insight features belong to the forthcoming Pro plan.

**Required action:** Confirm which features are currently available. Remove unavailable features from the metadata or label them as coming soon.

## 4. Technical confirmations

Before final publication, the technical team needs to confirm the following:

1. The actual iCloud synchronization behaviour and user controls.
2. Weak, stale, invalid and recovered GPS states, including their effect on recording, scoring and event detection.
3. Background recording and Low Power Mode or Battery Saver behaviour on supported iPhone and Android versions.
4. The current availability of AI insights, Year Recap, forecasts and Pro features.
5. That the privacy wording matches the current iPhone, Android, Fleet and website data flows.

## 5. Final recommendation

The current website is significantly clearer and more credible than the earlier version. After completing the privacy and iCloud corrections, removing the remaining broad claims, and fixing the pricing messages and buttons, the content can proceed to final team approval.

### Final checklist

- [ ] Privacy statements consistently include the Fleet and connected-service boundaries.
- [ ] iCloud behaviour is described consistently across all pages.
- [ ] Fuel, cost and CO₂ outputs are consistently identified as estimates.
- [ ] Residual safety positioning is removed from metadata and alternative text.
- [ ] Offline wording distinguishes core and connected features.
- [ ] Pricing messages and buttons are consistent and functional.
- [ ] Metadata lists only available features or clearly labels forthcoming ones.
- [ ] GPS, background and low-power behaviour have technical sign-off.

---
