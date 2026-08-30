# Efficiver Development Website - Latest Review After Two Implementation Rounds

| Field            | Details                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Website reviewed | [Efficiver development website](https://www-dev.efficiver.com/) following implementation of the earlier review feedback |
| Review scope     | Product claims, cross-page content consistency, metadata, privacy, pricing, calls to action and technical clarity       |

## 1. Overall assessment

The website has improved substantially. The main homepage content is clearer, more credible and better aligned with the product boundary. Most high-priority feedback has been implemented correctly, including the main estimate wording, safety positioning, pricing consistency and primary pricing actions.

A small number of cross-page inconsistencies remain. The most important involve privacy metadata, Privacy Policy wording, one historical iCloud description, estimate language in Help and Releases, current-versus-future Pro features, and the Fleet-interest action.

## 2. Required changes

### 2.1 Correct the social-sharing privacy metadata

The Open Graph and Twitter descriptions currently say:

> No data leaves your phone unless you join a fleet.

This is too absolute because iCloud synchronization, Android backup, maps, weather and route services involve data leaving the phone for the user's platform account or the relevant service provider.

Replace the privacy portion of both descriptions with:

> No ads or third-party analytics. Drive records are not sent to Efficiver unless you opt into Fleet. Platform synchronization, backup, maps and weather data flows are explained in the Privacy Policy.

The remaining feature description in the social metadata may stay, subject to the Pro-feature decision in Section 2.5.

### 2.2 Correct the remaining Privacy Policy contradictions

#### A. Off-duty drive wording

Current wording:

> Off-duty drives never leave your phone.

This conflicts with iCloud synchronization and Android backup.

Replace it with:

> Off-duty drives are never uploaded to or shared with your fleet. Depending on your platform settings, they may synchronize or be backed up through your own Apple or Google account.

Use the same distinction wherever the Privacy Policy currently says that off-duty drives “stay on your phone.”

#### B. Fleet-mode boundary

The Privacy Policy describes Fleet as the only situation in which driving data leaves the phone and becomes visible to someone else. This is too broad because map, weather, platform synchronization and backup services also process or store some data.

Suggested replacement:

> Fleet is the only situation in which completed drive records are uploaded to Efficiver Fleet and made visible to your employer. Maps, weather, platform synchronization and backup data flows are described separately in this policy.

#### C. Android vehicle-setting contradiction

The Android section says that vehicle settings are stored locally and never transmitted, but a later paragraph says settings are included in Android backup.

Suggested replacement:

> Vehicle settings are not sent to Efficiver. If Android backup is enabled, they may be included in the backup stored in your Google account.

### 2.3 Resolve the final iCloud inconsistency

The FAQ, Features section and most of Help now consistently state that iCloud synchronization occurs automatically while the user is signed into iCloud and that there is no separate Efficiver switch.

Two items still need correction.

#### A. Help - Data Deletion

The Help page currently makes a definite claim about what happens to previously synchronized sessions after iCloud synchronization is disabled. The Privacy Policy correctly says that this behaviour should not be claimed without confirmation from Apple.

Replace the Help instruction with:

> On iPhone, manage Efficiver's iCloud access through iOS Settings. Disabling access stops future synchronization. For help with data already stored in iCloud, use Apple's iCloud controls or contact Efficiver support.

#### B. v1.2 release entry

The detailed v1.2 release note still says that iCloud synchronization was optional, off by default and controlled by an in-app toggle.

The technical expert should confirm which of the following applies:

- If this description was never correct, replace it with the current automatic-synchronization explanation.
- If it accurately describes the historical v1.2 implementation, keep it as release history but add:

> Current behaviour: iCloud synchronization now occurs automatically while the user is signed into iCloud. There is no separate synchronization switch in Efficiver.

### 2.4 Make Help and Release estimate language consistent

The homepage is now appropriately qualified, but Help and the v1.4 release entry still use outcome wording such as “real savings,” “yearly savings” and fuel or CO₂ “savings” calculated from driving physics.

Efficiver's own Help content says that its scoring has not been validated against measured fuel use. Therefore, related fuel, cost and CO₂ outputs must consistently be presented as estimates.

Consider the following changes:

| Current wording or meaning          | Recommended wording                                                   |
| ----------------------------------- | --------------------------------------------------------------------- |
| Give instant feedback to save fuel  | Give feedback intended to support smoother and more efficient driving |
| Real savings so far this year       | Estimated fuel, cost and CO₂ impact so far this year                  |
| More accurate savings               | Refined fuel and CO₂ estimates                                        |
| Fuel and CO₂ savings are calculated | Estimated fuel and CO₂ impact is calculated                           |
| Yearly savings                      | Estimated yearly fuel, cost and CO₂ impact                            |
| See your fuel and CO₂ savings       | View estimated fuel or energy use, cost and CO₂ impact                |
| Fuel savings                        | Estimated fuel or energy impact                                       |
| CO₂ emissions avoided               | Estimated CO₂ impact                                                  |

Search the Help and Releases content for `save`, `saved`, `savings`, `real savings` and `emissions avoided`. Retain such wording only when it is clearly described as estimated or when it refers generally to established efficient-driving techniques rather than an Efficiver result.

### 2.5 Clarify current and future Pro-feature availability

The current pages give different impressions:

- The v1.5 release content presents forecasts, patterns and related insights as available.
- Social metadata presents AI insights and a scrubbable forecast as available.
- The FAQ and Help say that forecasts, patterns, idle-time insights and the annual projection are reserved for the forthcoming Pro plan.

The team should confirm which situation is correct and apply one explanation consistently across the homepage, Pricing, FAQ, Help, Releases, Open Graph and Twitter metadata.

#### If the features are currently free

> Forecasts and pattern insights are available in the current Efficiver app. Efficiver Pro will add deeper history, explanations and other advanced capabilities.

#### If the features are currently available as a preview

> Forecasts and pattern insights are currently available as a preview and are planned to become part of Efficiver Pro when the plan launches.

#### If the features are not currently available

Remove them from current-feature descriptions and social metadata until they are released. They may remain under clearly labelled “Coming soon” content.

### 2.6 Connect the Fleet-interest action

The primary pricing actions are now correctly configured. However, the **Register your interest** button in the Fleet section does not visibly open a form, change the URL or move the user to the contact section.

Connect it to one of the following:

1. Scroll to the contact form and preselect a new **Fleet enquiry** subject.
2. Open a dedicated Fleet-interest form.
3. Open a Fleet enquiry email link.

Recommended implementation:

> Scroll to the contact form and preselect **Fleet enquiry**, while leaving the user to complete and submit the form.

## 3. Recommended clarity improvement

The hero still describes Efficiver as **“The Offline Eco-Driving Assistant”** and as an “offline” app. The Features section and FAQ now explain the connected-service boundaries, but the hero may still suggest that every feature works offline.

Consider replacing the hero label with:

> The phone-based driving efficiency coach.

## 4. Technical confirmations

Before final publication, the technical team should confirm:

1. The current iCloud implementation and the treatment of previously synchronized data.
2. The exact current availability of forecasts, pattern insights, Year Recap, idle insights and other Pro-related features.
3. Weak, stale, invalid and recovered GPS states and their effect on recording, scoring and event detection.
4. Background recording and Low Power Mode or Battery Saver behaviour on supported iPhone and Android versions.
5. That the final privacy wording matches current iPhone, Android, Fleet, maps, weather, platform-backup and website-form data flows.

## 5. Implementation priorities

| Priority     | Item                                              | Suggested owner                                   |
| ------------ | ------------------------------------------------- | ------------------------------------------------- |
| **High**     | Social metadata and Privacy Policy contradictions | Product/content owner with technical confirmation |
| **High**     | Final iCloud consistency                          | iOS technical owner and content owner             |
| **High**     | Current-versus-future Pro-feature decision        | Product owner                                     |
| **Medium**   | Estimate language in Help and Releases            | Product/content owner                             |
| **Medium**   | Fleet-interest button                             | Website owner                                     |
| **Medium**   | GPS, background and low-power sign-off            | iOS and Android technical owners                  |
| **Optional** | Narrow the hero's offline label                   | Product/marketing owner                           |

## 6. Final approval checklist

- [ ] Social metadata no longer says that no data leaves the phone except for Fleet.
- [ ] Off-duty-drive wording distinguishes Fleet sharing from personal platform synchronization and backup.
- [ ] Android vehicle-setting wording accounts for Google backup.
- [ ] Help and Releases use one accurate iCloud explanation or clearly distinguish historical behaviour.
- [ ] Help and Releases consistently identify fuel, cost and CO₂ outputs as estimates.
- [ ] Forecast, pattern, Year Recap, idle-insight and Pro availability are described consistently across all pages and metadata.
- [ ] The Fleet-interest action opens or reaches a usable enquiry route.
- [ ] GPS, background, low-power and privacy data-flow descriptions have technical sign-off.
- [ ] The team has completed a final cross-page consistency check before production publication.

## 7. Final recommendation

The latest website is substantially stronger and the main public-facing content is close to approval. Complete the high-priority privacy, iCloud and Pro-availability corrections first. Then complete the estimate-language pass, connect the Fleet-interest action and obtain technical sign-off. After those actions, the website content can proceed.
