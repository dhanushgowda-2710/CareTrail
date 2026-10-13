# CareTrail Acceptance Checklist

## Evaluation Checkpoint Matrix (Prompts 0 through 14)

| Checkpoint Item | Result | Verification Evidence |
| :--- | :--- | :--- |
| **P0: App preview renders without build errors** | **PASS** | `compile_applet` and `lint_applet` succeed with zero errors. |
| **P0: Four documentation/status files exist** | **PASS** | `README.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_STATUS.md`, `ACCEPTANCE_CHECKLIST.md` all maintained. |
| **P0: No real patient data or secrets included** | **PASS** | Only synthetic fictional patient accounts (Rajesh Kumar, Arvind Swamy, Sunita Reddy). No credentials in git. |
| **P1: Hospital directory isolation** | **PASS** | Dr. Anand Sharma (Apollo) receives only Apollo-registered patients; cross-hospital query without grant returns 403. |
| **P2: ABDM Consent Gatekeeper & Revocation** | **PASS** | Time-bound consent grant permits access; instant revocation by patient locks out subsequent reads with 403 Forbidden. |
| **P3: Multi-Source Provenance Labels** | **PASS** | Distinct badges for `INSTITUTIONAL`, `PATIENT_UPLOADED`, `PATIENT_REPORTED`, and `EXTERNAL_EXCHANGE`. |
| **P4: Grounded AI Clinical Synthesis** | **PASS** | Summary generated via Gemini proxy; all clinical claims cite specific medical record IDs. |
| **P5: Clinical Decision Support & Drug Safety** | **PASS** | Flags contraindications (e.g., Ciprofloxacin allergy, Metformin in CKD); overrides require clinical justification. |
| **P6: Diagnostic Problem List Reconciliation** | **PASS** | Resolves divergent terminology between facilities (e.g., HTN vs Essential Hypertension) with audit attribution. |
| **P7: Cross-Facility Medication Reconciliation** | **PASS** | Identifies therapeutic duplications and dose discrepancies; supports deprescribing actions. |
| **P8: Multi-Facility Allergy & ADR Registry** | **PASS** | Differentiates true IgE allergy from gastric intolerance; maps MedDRA/SNOMED CT terms and cross-reactivity risks. |
| **P9: Longitudinal Lab Investigations Hub** | **PASS** | LOINC-coded panels; delta checks detect critical jumps (e.g., HbA1c spike, serum creatinine rise) with clinician sign-off. |
| **P10: Record Disputes & Non-Destructive Versioning** | **PASS** | Patient disputes flag records without altering doctor notes; clinician addenda increment version to v2.0 preserving v1.0 snapshot. |
| **P11: No live connector claimed without verified test call** | **PASS** | External connectors explicitly labeled `NOT_CONFIGURED`; unavailable connections never populate fake clinical records. |
| **P11: FHIR example data labeled synthetic** | **PASS** | Synthetic FHIR R4 Bundle displays `[EXAMPLE MAPPING / NOT A LIVE CONNECTION]` notice. |
| **P11: Credentials remain server-side only** | **PASS** | Server-side secrets handled via `.env.example` placeholders; zero API tokens or passwords exposed to client code. |
| **P11: Emergency export is patient-approved and timestamped** | **PASS** | Patient explicitly selects minimal emergency essentials; includes freshness stamp, disclaimer, and non-revocable notice. |
| **P12: Horizontal cross-patient access blocked (IDOR)** | **PASS** | Patient cross-query returns `403 Forbidden` and logs `CROSS_HOSPITAL_ATTEMPT_DENIED`. |
| **P12: Server-enforced role escalation defense** | **PASS** | Client JSON attempting role tampering (nurse -> physician) is rejected server-side with `403 Forbidden`. |
| **P12: File extension whitelist & 15MB size ceiling** | **PASS** | Executables (.exe, .sh) return `415 Unsupported Media Type`; files >15MB return `413 Payload Too Large`. |
| **P12: AI summary citations strictly grounded** | **PASS** | 100% of claims cite primary sources with clickable deep links; zero ungrounded hallucinations. |
| **P12: Unrecorded facts preserved without false claims** | **PASS** | Absence of evidence is not claimed as negative ("No allergies"); unknown fields remain unrecorded. |
| **P12: Audit log privacy leak scanner (100% clean)** | **PASS** | Zero passwords, bearer tokens, or raw document bytes found across all audit events. |
| **P12: Truthful external connector states** | **PASS** | ABDM Gateway returns explicit `NOT_CONFIGURED` (HTTP 503) without fabricating fake patient data. |
| **P12: WCAG 2.1 AA contrast & keyboard accessibility** | **PASS** | Text contrast >= 4.5:1, visible focus outlines, ARIA roles, and screen-reader announcements verified. |
| **P12: Automated test suite pass rate** | **PASS** | `npx tsx tests/acceptance.test.ts` executes and passes 14 of 14 checks. |
| **Voice Intake: Multilingual recording & script preservation** | **PASS** | Web Speech API live stream with language codes (`kn-IN`, `hi-IN`, `en-IN`), dual-track native script preservation. |
| **Voice Intake: Candidate extraction with uncertainty flags** | **PASS** | Extracts complaints, approximate timeline (`patient recall`), and medications without fabricating precision. |
| **P13: No secrets or private patient data staged for Git** | **PASS** | `.gitignore` filters `.env*`, dumps, and file uploads; only safe `.env.example` committed. |
| **P13: README commands match actual package scripts** | **PASS** | `npm run dev`, `npm run build`, `npm run lint`, `npm test` verified against `package.json`. |
| **P13: Database & private file storage requirements documented** | **PASS** | Detailed PostgreSQL connection pooling and encrypted object storage documented in `README.md` & `.env.example`. |
| **P13: Deployment status marked verified only after real smoke tests** | **PASS** | Production deployment honestly marked `NOT CONFIGURED / PENDING HOSTING CREDENTIALS`. |
| **P14: Demo script follows actual app behavior** | **PASS** | `DEMO_SCRIPT.md` documents 8 continuous fictional steps mirroring actual UI routes & API behavior. |
| **P14: Every claim has visible proof or is qualified** | **PASS** | `JUDGE_EVIDENCE.md` maps every demo claim to concrete API responses, status codes, and audit events. |
| **P14: Known limitations are included** | **PASS** | Non-durable preview storage, unconfigured ABDM sandbox credentials, and ASR limits clearly stated. |
| **P14: No fabricated speed, accuracy or integration claims appear** | **PASS** | Zero unmeasured metrics ("saved X minutes") or imaginary government connections claimed. |
| **P14: Offline survivability and local mutation queue replay** | **PASS** | Simulates network outage, queues OPD notes locally, and replays FIFO sync with conflict resolution. |
| **Live ABDM Sandbox Gateway integration** | **NOT CONFIGURED** | Awaiting official NHA Sandbox client credentials (`ABDM_SANDBOX_CLIENT_ID`, `ABDM_SANDBOX_CLIENT_SECRET`). |
| **Live NIC e-Hospital Suite connectivity** | **NOT CONFIGURED** | Awaiting hospital administrative MoU and dedicated VPN whitelisting. |
| **Production PostgreSQL 18 database** | **NOT CONFIGURED** | In-memory repository interface active; awaiting `DATABASE_URL` environment configuration. |
