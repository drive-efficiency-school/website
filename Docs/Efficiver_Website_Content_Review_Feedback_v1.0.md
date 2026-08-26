# Efficiver Website — Content Review and Recommendations

| Field        | Details                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| Website      | [Efficiver development website](https://www-dev.efficiver.com/)                |
| Reference    | Phase 1 Problem Framing Document                                               |
| Review scope | Product messaging, claim consistency, technical clarity and business decisions |

## 1. Purpose and review boundary

This document reviews whether the development website explains Efficiver clearly and consistently with the current Phase 1 Problem Framing decisions.

The findings are classified as:

- **Verified correction:** The relevant wording was found on the current development website and requires alignment.
- **Business decision:** The website contains conflicting or commercially sensitive wording that requires a business decision.
- **Technical confirmation:** The wording should not be changed to a specific alternative until the implemented behaviour is confirmed.
- **Optional recommendation:** A messaging, information-architecture or publishing improvement rather than a factual error.
- **Evidence confirmation**: The claim exists on the website, but its source or supporting evidence is not shown publicly. Internal evidence may exist and must be confirmed.

## 2. Overall assessment

The website has a strong information base and communicates the phone-only, no-required-OBD approach clearly. However, several customer-facing statements are broader or more certain than the current Phase 1 Problem Framing boundaries.

The highest-priority matters are:

1. Fuel-savings and measurement language.
2. Safety-improvement wording.
3. Absolute privacy and offline statements.
4. Pricing consistency.
5. GPS and calibration behaviour.
6. Competitor-comparison evidence.
7. Investor and traction figures.
8. Background-operation and battery claims.

## 3. What is already communicated well

- iPhone and Android download options are easy to locate.
- The phone-only and no-required-OBD approach is clear.
- Features, setup, FAQ, support, accessibility and releases are covered.
- The Privacy Policy page provides useful detail about iCloud, Google backup, maps, weather, website forms and Fleet data flows.
- The Terms of Use page state that Efficiver is not a navigation, collision-avoidance or safety-critical system.
- Contact and support routes are visible.
- CarPlay, Apple Watch, Wear OS, background use and device requirements are mentioned.

## 4. Findings and required decisions

| No. | Classification                                 | Finding                                                                                                                                                                                                                                                   | Why it matters                                                                                                                                           | Required action                                                                                                                                                                                                                                                 |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Verified correction                            | The **8–22%** fuel-savings range appears in page metadata, social-sharing descriptions, structured data and the FAQ. It was not found in the visible homepage body. Other visible sections use broader language about saving fuel and reducing emissions. | A general eco-driving range does not establish Efficiver-specific performance. Product-level wording may be interpreted as an app outcome claim.         | Remove the percentage from product-level metadata and marketing unless Efficiver-specific validation supports it. If retained as general industry context in the FAQ, cite the exact research and clearly state that it is not an Efficiver performance result. |
| 2   | Verified correction                            | Features and How It Works use language such as quantifying fuel savings or CO₂ reduction.                                                                                                                                                                 | Phase 1 Problem Framing treats fuel, cost and CO₂ outputs as estimates based on theoretical calculations and available inputs.                           | Use **estimated fuel, cost and CO₂ impact** until the model, baseline, accuracy measure and ground truth are validated.                                                                                                                                         |
| 3   | Verified correction                            | The website uses wording such as **promote safer driving**, **drive safer** and improving driving safety.                                                                                                                                                 | Phase 1 Problem Framing does not include safety improvement as a current customer-benefit claim.                                                         | Replace safety-benefit claims with smoother or more efficient driving language. Place a concise safety boundary near live-coaching content.                                                                                                                     |
| 4   | Verified correction and technical confirmation | Statements such as **No Data Collection**, **No tracking, ever**, **nothing leaves your device** and **your data never leaves your phone** are broader than the data flows described in the Privacy Policy.                                               | Maps, weather, platform backup, opted-in Fleet use and website forms involve disclosed external processing or transfer.                                  | Replace absolute wording with precise statements about what Efficiver receives, stores or does not receive. Verify all statements against the current iPhone, Android, website and Fleet implementations.                                                       |
| 5   | Verified correction and technical confirmation | The app is described as **completely offline** and as requiring no internet connection.                                                                                                                                                                   | Core recording may work offline, but maps, weather, route planning, backup and Fleet capabilities involve platform or external services.                 | Confirm exactly what works without connectivity and describe the core offline capability separately from connected features.                                                                                                                                    |
| 6   | Business decision                              | Pricing shows **Free Forever**, a launch offer or future paid option, Enterprise pricing and a 30-day trial, while the FAQ says future pricing is undecided.                                                                                              | Customers and prospective partners receive conflicting commercial information.                                                                           | The team should approve one source of truth. Retain only plans, prices and trials that are approved and actually available; then align the Pricing page and FAQ.                                                                                                |
| 7   | Technical confirmation                         | The FAQ says scoring continues during a weak GPS signal. The meeting record says recording stops when a GPS error is detected.                                                                                                                            | Weak, invalid and error GPS states may be different; this is not yet a confirmed contradiction.                                                          | Define each GPS state, its threshold and the behaviour of recording, scoring, event detection and recovery. Then use the same definitions in the app, website, FAQ and technical record.                                                                        |
| 8   | Verified correction and technical confirmation | The website describes Smart Detection setup as a **one-time calibration**, while the Phase 1 Problem Framing record says recalibration is required when phone placement changes.                                                                          | “One-time” can create an incorrect setup expectation.                                                                                                    | Replace it with **initial calibration** and explain the confirmed conditions requiring recalibration.                                                                                                                                                           |
| 9   | Internal evidence confirmation                 | The comparison table makes broad claims about OBD-app cost, setup time, offline use, privacy and battery drain. No comparison set, date, source or test conditions are shown on the page.                                                                 | OBD products differ, and broad comparisons can reduce credibility if their scope is unclear.                                                             | Provide the products reviewed, market, date, sources and comparison conditions. Otherwise, use a narrower comparison based on Efficiver’s directly verifiable architecture.                                                                                     |
| 10  | Team evidence confirmation                     | The Investor page presents a **$5B market**, **1,000+ users**, rapid organic growth and a projection of **100,000 active users by year-end**. The page does not show dates, definitions, sources or methods.                                              | The figures may have internal support, but readers cannot understand or verify them from the page.                                                       | Record the source, date, metric definition and method for each figure. Label each as actual, estimate, projection or target. Specify the relevant year for “year-end.” The team should also decide whether the Investor page should be publicly accessible.     |
| 11  | Team evidence confirmation                     | The homepage says **Join thousands**, while the Investor page reports **1,000+ users**.                                                                                                                                                                   | Both statements may be accurate, but they should refer to the same current metric and reporting date.                                                    | Confirm the current number, definition of “user” and as-of date; then align both pages.                                                                                                                                                                         |
| 12  | Technical confirmation                         | The website uses **Background Ready** and **Minimal** battery-drain wording.                                                                                                                                                                              | Phase 1 Problem Framing records the low-power implementation approach but says recording reliability and measured battery impact still require evidence. | Provide supported-device test results or replace the claims with narrower, technically approved wording.                                                                                                                                                        |

## 5. Recommended wording

The following wording is proposed for review. The team should approve statements describing implementation or data flow before publication.

### 5.1 Main product description

> Efficiver is a phone-only driving coach that provides post-trip insights, driving trends and optional hands-free feedback. Fuel, cost and CO₂ impacts are estimates. No OBD hardware is required.

### 5.2 Fuel, cost and CO₂

> Efficiver estimates fuel, cost and CO₂ impact using available trip and configured vehicle information. Results can vary with the vehicle, road, traffic, route, weather, driving conditions and the completeness of the information provided.

Based on the meeting record, the model uses theoretical calculations. The team to approve the exact description of inputs, baseline and limitations.

### 5.3 Safety

> Efficiver provides feedback intended to support smoother and more efficient driving. It is not a navigation, collision-avoidance or safety-critical system.

This boundary should appear near live-coaching descriptions, not only in the Terms of Use.

### 5.4 Privacy

Proposed wording, subject to a technical data-flow check:

> For personal use, core driving analysis and session storage take place on the device. Maps, weather, platform backup, opted-in Fleet features and website forms may involve the external data flows explained in our Privacy Policy.

Suggested trust indicators:

- Core personal driving analysis takes place on the device.
- No required OBD hardware.
- Optional hands-free feedback.
- External data flows are disclosed in the Privacy Policy.

Avoid absolute wording unless a technical audit supports it in every relevant feature and operating mode.

### 5.5 Offline use

Proposed wording, subject to technical confirmation:

> Core trip recording and analysis can work without an internet connection. Maps, weather, route planning, platform backup and Fleet capabilities may use platform or external services.

### 5.6 Pricing

If future pricing remains undecided, use:

> Efficiver is currently free. Future pricing and plan structure are under evaluation.

If Enterprise or trial offers have been approved and are available, retain them and update the FAQ instead of removing them.

### 5.7 GPS

The published explanation should distinguish:

- GPS warming-up state.
- Weak but usable GPS.
- Invalid or error state.
- Recovery after signal improvement.
- Effect on recording, distance, scoring and event detection.
- Suppression or uncertainty treatment for low-confidence events.

Do not publish a more specific behaviour until implementation, tests and documentation agree.

### 5.8 Calibration

> An initial Smart Detection calibration is required. Recalibration may be required when phone placement or other confirmed operating conditions change.

The technical team should confirm whether any additional recalibration triggers exist.

### 5.9 Competitor comparison

If a sourced comparison is not available, use neutral wording such as:

> Efficiver does not require an OBD connection for its core phone-based coaching. Hardware, cost, setup, connectivity and data practices vary across other products.

## 6. Business decisions required

1. Approve the website positioning - Approve the primary target user, customer problem, main benefit and product differentiation communicated on the website.
2. Decide whether any numerical fuel-savings claim should remain.
3. Approve the single current pricing statement.
4. Decide which future plans or trials are ready to be shown publicly.
5. Approve the evidence and definitions behind market, traction and projection figures.
6. Decide whether the investors page should be available to the public
7. Decide whether the comparison table should be evidenced, narrowed or removed.

## 7. Technical confirmations required

1. Confirm how fuel, cost and CO₂ estimates are calculated and labelled.
2. Define GPS states, thresholds and recording/scoring behaviour.
3. Confirm calibration inputs and every recalibration trigger.
4. Verify current iPhone, Android, website and Fleet data flows.
5. Confirm the exact offline feature boundary.
6. Provide background-recording reliability and battery-impact evidence.
7. Confirm the tested device, operating-system, vehicle and powertrain support envelope.
8. Confirm whether users can currently correct or exclude passenger, vehicle or trip misclassification before describing that capability publicly.

## 8. Information to consolidate or clarify

Some of the following information already appears across Features, FAQ, Privacy and Terms. It should be consolidated in the most appropriate location rather than repeated everywhere.

### Homepage

- Primary user problem and desired outcome.
- Phone-only approach and no required OBD hardware.
- Clear indication that fuel, cost and CO₂ outputs are estimates.
- Concise privacy, offline and live-feedback boundaries.
- Current pricing status.

### FAQ or support content

- Observed inputs, inferred events and estimated outputs.
- Tested device, OS, vehicle and powertrain support.
- Phone placement and recalibration requirements.
- Weak GPS, missing vehicle information and other degraded conditions.
- Connected features and their external-service requirements.
- User correction options, only if implemented.

### Privacy Policy and Terms

- Detailed data flows, purposes, retention and control.
- Fleet consent and employer responsibilities.
- Safety and usage limitations.

## 9. Optional messaging direction for review

### Heading

> Understand how your driving affects trip efficiency.

### Supporting text

> Efficiver provides post-trip insights, driving trends and optional hands-free feedback using your phone. Fuel, cost and CO₂ impacts are estimates, and no OBD hardware is required.

### Suggested homepage sequence

1. Customer problem and product outcome.
2. How Efficiver works.
3. Main features and evidence-backed differentiators.
4. Privacy and offline summary.
5. Supported devices and operating conditions.
6. Current pricing.
7. FAQ, download and contact.

Detailed limitations can be linked from the relevant sections rather than occupying the main conversion path.

## 10. Page-by-page actions

### Homepage and metadata

- Align visible wording with search, social-sharing and structured-data descriptions.
- Remove or properly qualify numerical savings and safety-benefit claims.
- Replace absolute privacy and offline wording.
- Verify and align the “Join thousands” statement.

### Features and How It Works

- Distinguish observed inputs, inferred events and estimated outcomes where the difference matters to users.
- Replace measurement or outcome promises with estimated wording where applicable.
- Correct the one-time calibration wording.
- Identify features that use maps, weather, backup or other services.

### Comparison and pricing

- Evidence, narrow or remove broad comparison claims.
- Use one approved pricing statement across the site.
- Show only approved and available plans, trials and Enterprise offers.

### FAQ

- Remove the 8-22% product implication or clearly attribute it as general research rather than Efficiver performance.
- Align offline and privacy answers with the Privacy Policy.
- Explain weak, invalid and error GPS states with technical confirmation.
- Correct the calibration description.
- State the tested support environment rather than only intended support.

### Privacy Policy

- Retain the useful feature-level explanations.
- Verify every statement against current implementations.
- Correct any broad “never share” wording that does not account for disclosed service-provider or Fleet flows.
- Confirm retention, deletion, backup and Fleet responsibilities with the appropriate privacy review.

### Investor page

- Add evidence, definitions and dates for market, traction and projection figures, or revise them.
- Specify the year and basis of projections.
- Ensure iPhone and Android descriptions are current.
- Separate actual performance from projections and internal targets.

### Development environment

1. The development homepage currently contains:
<meta name="robots" content="index, follow" />

This allows search engines to index the development site. Decide whether the development site should appear in search results. If not, apply noindex.

2.

Hash-based URLs such as /#investors are functional for users. However, search engines generally do not treat hash-routed views as separate indexable pages. If Privacy, Terms, Help or Releases require independent search visibility and easier sharing, consider path-based URLs such as /privacy and /terms. Otherwise, the existing hash URLs may remain.

## 11. Pre-publication assurance checklist

- [ ] Fuel, cost and CO₂ wording matches the validated estimation method.
- [ ] Numerical savings claims are removed or supported and accurately attributed.
- [ ] Safety-benefit wording matches the Phase 1 Problem Framing claim boundary.
- [ ] Privacy wording matches actual iPhone, Android, website and Fleet data flows.
- [ ] Offline wording distinguishes core operation from connected features.
- [ ] GPS and calibration behaviour are technically confirmed and consistently described.
- [ ] Pricing information is approved and consistent across all pages.
- [ ] Vehicle, powertrain, device and OS statements match tested support.
- [ ] Comparison claims have a defined scope and evidence.
- [ ] Investor figures have dates, definitions, sources and clear labels.
- [ ] Traction wording is consistent across the homepage and Investor page.
- [ ] Metadata and structured data match the approved visible message.
- [ ] The indexing policy for the development environment is confirmed.

The following are assurance activities, not findings that a defect currently exists:

- [ ] Mobile, tablet and desktop layout testing.
- [ ] Keyboard, screen-reader, contrast and text-scaling testing.
- [ ] Separate review of app-store copy and screenshots.
- [ ] Appropriate review of privacy, legal and safety-sensitive wording.

## 12. Action tracker

| Action                                   | Decision owner         | Evidence or approval required                               | Status |
| ---------------------------------------- | ---------------------- | ----------------------------------------------------------- | ------ |
| Revise fuel, CO₂ and safety wording      | Team/Product           | Approved claim wording and technical model description      | [ ]    |
| Reconcile privacy and offline statements | Technical/Product      | Current data-flow confirmation                              | [ ]    |
| Define GPS states and behaviour          | Technical              | Specification and test evidence                             | [ ]    |
| Correct calibration wording              | Technical/Product      | Confirmed recalibration rules                               | [ ]    |
| Align pricing                            | Team                   | Approved commercial statement                               | [ ]    |
| Review comparison claims                 | Team/Product           | Sources and comparison method, or approved narrower wording | [ ]    |
| Verify investor and traction figures     | Team                   | Dated evidence and metric definitions                       | [ ]    |
| Review background and battery claims     | Technical              | Supported-device test results                               | [ ]    |
| Confirm development indexing policy      | Team/Technical         | Publishing decision                                         | [ ]    |
| Complete final content approval          | Team/Product/Technical | Recorded sign-off                                           | [ ]    |

---
