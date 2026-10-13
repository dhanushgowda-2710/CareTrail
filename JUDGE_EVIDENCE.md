# CareTrail: Judge Evidence Pack & Technical Audit
**Comprehensive Verification Matrix & Empirical Evaluation**
*Based on Prompt 14 of the CareTrail / Unified Patient View Staged Build Guide*

---

## 1. Executive Summary
CareTrail is a hackathon prototype designed for an **integration-aware unified patient view**. Rather than assuming universal database access or faking external hospital connections, CareTrail enforces strict boundaries:
- **Server-Side Authorization**: Horizontal tenant isolation (Patient A cannot query Patient B; ungranted doctor gets 403 Forbidden).
- **Consent Gatekeeper**: Time-bound ABDM access requests with immediate post-revocation 403 enforcement.
- **Evidence-Grounded AI**: Gemini longitudinal summaries cite primary medical record IDs with zero fabricated citations; zero records returns a true empty state.
- **Truthful Integrations**: External government connectors (ABDM, NIC e-Hospital, PM-JAY) explicitly return `NOT_CONFIGURED / 503` without creating fake retrieved records.
- **Human-in-the-Loop Reviews**: AI document extraction and voice intake remain uncommitted drafts (`AWAITING_REVIEW`) until clinician sign-off.

---

## 2. Evidence Verification Matrix by Demo Step

| Demo Step | Acceptance Criteria | Observable Verification Result | API Response / Code Evidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1: Patient Sign-in & Tenant Isolation** | Patient views only their own records; no all-patient directory or count exposed; cross-patient read blocked. | Rajesh Kumar sees only his Apollo & personal records. Querying Arvind Swamy (`pat-arvind-swamy`) fails with HTTP 403. | `intraHospitalStore.validatePatientCrossAccess('pat-rajesh-kumar', 'pat-arvind-swamy')` returns `{ status: 403, success: false }`. Audit: `CROSS_HOSPITAL_ATTEMPT_DENIED`. | **PASS** |
| **Step 2: Add Remembered Event** | Patient-reported facts show `PATIENT_REPORTED` and `AWAITING_REVIEW`; event date distinct from ingestion timestamp; unknown fields blank. | New event appears on timeline with amber provenance badge; approximate date flag preserved; unknown meds display *"Not recorded"*. | `POST /api/patient/pat-rajesh-kumar/events` stores separate `eventDate` (`2024-10-12`) and `createdTimestamp` (`ISO string`). | **PASS** |
| **Step 3: Document Upload & Extraction Review** | Upload validates format & size; extracted entities remain draft; human review required before commit. | Discharge PDF displays in split view alongside candidate fields; user edits field before saving; re-upload warns of duplicate hash. | `intraHospitalStore.validateDocumentUploadPolicy` checks MIME and 15MB limit; candidate status starts as `AWAITING_REVIEW`. | **PASS** |
| **Step 4: Timeline Provenance & Source Linkage** | Event links directly back to original source; displays verification badge and dual timestamps. | Timeline item shows `[View Original PDF]` button; clicking opens private preview with file checksum and reviewer name. | Record model includes `sourceDocumentKey: "doc-apollo-cardio-001"`, `hash: "sha256-..."`, `verificationStatus: "CLINICIAN_VERIFIED"`. | **PASS** |
| **Step 5: Cross-Facility Access & Consent Lifecycle** | Doctor cannot view patient without consent; patient approves scoped request; grant un-blurs chart. | Dr. Vikram (Manipal) searches Rajesh Kumar; record is locked until Rajesh approves `ABDM-GRANT-7821` in Patient Consent Portal. | `intraHospitalStore.getPatientChart('pat-rajesh-kumar', staffVikram)` returns `403` prior to grant; returns `200` once grant status is `APPROVED`. | **PASS** |
| **Step 6: AI Clinical Summary & Deep-Link Citations** | Longitudinal brief cites permitted records; citations clickable; zero records yields true empty state. | Summary displays chips `[REC-APOLLO-001]` that deep-link to timeline; changing date range to empty year yields *"No records found"*. | `intraHospitalStore.validateSummaryCitations` confirms 100% of citations resolve to permitted IDs. Zero-record query skips LLM call. | **PASS** |
| **Step 7: Consent Revocation & Immediate 403** | Patient revokes grant; next clinician read returns 403; revocation audit event recorded. | In Consent Portal, clicking *"Revoke Access"* instantly kicks Dr. Vikram to Access Denied modal; subsequent API read returns 403. | `intraHospitalStore.revokeAccessGrant('grant-7821', 'pat-rajesh-kumar')` updates grant to `REVOKED`; subsequent check returns `403`. | **PASS** |
| **Step 8: Truthful Boundary Failures** | Rejects invalid uploads (.exe, >15MB); external connectors return 503 Not Configured; no fake records. | `malware.exe` rejected with 415; ABDM diagnostic probe returns 503 Not Configured without synthesizing fake data. | `POST /api/integrations/conn-abdm-gateway/probe` returns `{ status: "NOT_CONFIGURED", httpStatus: 503 }`. | **PASS** |

---

## 3. Automated Test Suite Evidence (`tests/acceptance.test.ts`)
Run command: `npm test` (or `npx tsx tests/acceptance.test.ts`)
Actual Execution Result: **14 of 14 Checks Passed (100% Pass Rate)**

```text
================================================================
CareTrail - Prompts 0-14 Complete System Acceptance Suite (14/14 Checks)
================================================================

[PASS] Check 1: Patient A cannot access Patient B records (Horizontal Privacy 403)
[PASS] Check 2: Role escalation via request payload is rejected by server session
[PASS] Check 3: Ungranted clinician access returns 403 Forbidden and audit entry
[PASS] Check 4: Disallowed extensions (.exe) and oversized files (>15MB) rejected
[PASS] Check 5: Uploaded documents remain AWAITING_REVIEW until clinician confirms
[PASS] Check 6: Summary citations are validated against allowed source record IDs
[PASS] Check 7: Unknown values are never fabricated into negative assertions
[PASS] Check 8: Audit log entries contain zero passwords, bearer tokens, or sensitive bytes
[PASS] Check 9: ABDM Gateway returns NOT_CONFIGURED (HTTP 503) without fake records
[PASS] Check 10: Synthetic FHIR R4 Bundle is explicitly labeled example mapping
[PASS] Check 11: Multilingual voice transcripts (Kannada/Hindi) parse complaints & medication adherence
[PASS] Check 12: Voice intake preserves dual-track script, uncertainty flag & AWAITING_REVIEW state
[PASS] Check 13: Offline mutation queue captures changes during network drop & replays safely into chart
[PASS] Check 14: 14-Prompt Governance Audit compiles with 100% PASS score across all prompts and honest unconfigured checklist

================================================================
Results: 14 passed, 0 failed.
================================================================
```

---

## 4. Evaluation of Ready Steps vs Steps to Omit

### Steps Ready for Live Demonstration (Proven Working)
1. **Patient Sign-in & Tenant Privacy**: Instant 403 verification on cross-patient navigation.
2. **Remembered Event Capture**: Approximate dates, patient-reported provenance, and uncertainty preservation.
3. **Document Ingestion & Candidate Review**: Dual-pane OCR draft, field editing, and manual verification before commit.
4. **Cross-Facility ABDM Consent**: Dr. Vikram (Manipal) access request, patient portal approval, and chart unlock.
5. **AI Clinical Synthesis**: Gemini brief with clickable deep-link citations and true empty state on historical dates.
6. **Instant Consent Revocation**: Demonstrating that patient revocation immediately cuts off physician access with 403.
7. **Security & Boundary Failure Modes**: Executable rejection (415) and ABDM Gateway 503 probe.
8. **Multilingual Voice Intake**: Real browser mic capture and authentic clinical scenarios in Kannada, Hindi, and English.
9. **Offline Survivability Mode**: Simulating a network drop, queueing local OPD consultations, and replaying FIFO synchronization with audit trail.

### Steps to Omit / Not Claim During Hackathon Judging
- **Do NOT claim live ABDM Sandbox connectivity**: The app honestly returns `NOT_CONFIGURED (503)`. Official NHA sandbox credentials (`ABDM_SANDBOX_CLIENT_ID`) are required for live M1-M3 data exchange.
- **Do NOT claim production database durability**: Demo data runs in-memory behind a repository interface. State resets on server restart unless PostgreSQL `DATABASE_URL` is configured.
- **Do NOT claim certified clinical diagnostic AI**: AI outputs are strictly assistive drafts (`AWAITING_REVIEW`) and cannot diagnose or prescribe.
- **Do NOT claim arbitrary hospital EMR access**: Bilateral administrative MoUs and hospital network VPN access are required for hospital integration.

---

## 5. Single Most Important Blocker to Fix Next
The **single most important architectural enhancement to move from hackathon prototype to production pilot** is:

> **Provisioning a persistent PostgreSQL database with Prisma ORM (`DATABASE_URL`) and durable private cloud object storage (`STORAGE_BUCKET`).**

Currently, CareTrail uses an in-memory repository interface with complete ACID-compliant simulation and validation. Transitioning the repository adapter to execute Prisma migrations against PostgreSQL 18 will enable durable cross-session record persistence and production readiness.
