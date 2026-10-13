# CareTrail Architecture Document

## System Overview
CareTrail is an integration-aware clinical history workspace. It combines records available through authorized systems with scanned documents and patient-reported events, providing clinicians with a concise, source-linked view of available patient history while maintaining strict provenance and access boundaries.

## Architecture Principles
1. **Availability Over Magic**: Retrieve only from sources with an authorized, functioning connection. External hospital systems return explicit `NOT_CONFIGURED` or `REQUIRES_AUTHORIZATION` statuses; never fake a network fetch.
2. **Provenance by Default**: Every clinical fact retains its origin, author, event date, and review state (`INSTITUTIONAL`, `PATIENT_UPLOADED`, `PATIENT_REPORTED`, `EXTERNAL_EXCHANGE`).
3. **Server-Enforced Scope**: Patient views access only their own records. Clinician views are strictly bounded by organization/branch privileges, verified staff identity, and active time-bound consent grants.
4. **No AI Authority**: AI organizes and extracts candidate facts for human clinician confirmation; it does not diagnose or prescribe.
5. **Separation of Ecosystem Concerns**: ABHA 14-digit identifier is an account for consent-based health record linking. PM-JAY is a government health-financing scheme. An Ayushman card is never treated as a medical-record API key.
6. **Horizontal & Vertical Tenant Boundaries**: Server derives tenant context strictly from authenticated session token. Client JSON bodies can never escalate staff roles, bypass tenancy filters, or overwrite doctor clinical notes.

## Component Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS.
- **Backend**: Node.js Express API.
- **Durable Storage Target**: PostgreSQL 18 with Prisma ORM (`DATABASE_URL`). Fictional in-memory repository boundary active in local preview mode.
- **AI & Extraction Engine**: Google Gemini API via server-side proxy route.
- **Standards & Profiles**: HL7 FHIR R4 based on National Resource Center for EHR Standards (NRCeS) ABDM Implementation Guide.
- **Acceptance & Security Harness**: `securityAcceptanceService` running automated 10-point test runner, privacy leak scanner, and MIME validator.

## Integration & Connector Boundaries
- **ABDM Gateway Connector** (`conn-abdm-gateway`): `NOT_CONFIGURED` (Requires NHA Sandbox M1-M3 Certification & Server Secrets `ABDM_SANDBOX_CLIENT_ID`, `ABDM_SANDBOX_CLIENT_SECRET`).
- **NIC e-Hospital Suite Bridge** (`conn-ehospital-nic`): `NOT_CONFIGURED` (Requires Institutional MoU & IP VPN Whitelisting).
- **PM-JAY Beneficiary Scheme Adapter** (`conn-pmjay-beneficiary`): `NOT_CONFIGURED` (Restricted to claims/insurance eligibility verification; clinical record extraction blocked by policy firewall).
- **Internal Institutional Store** (`conn-tier2-internal`): `CONNECTED` (PostgreSQL / Express API scoped to active hospital ID).
- **Document & Voice Ingestion Engine** (`conn-tier4-pipeline`): `CONNECTED` (Server-side Gemini extraction + draft candidate review).

## Security & Acceptance Architecture (Prompt 12)
- **Horizontal Access Boundary**: Patient A querying Patient B returns `403 Forbidden` and appends an immutable violation record.
- **Server-Authoritative RBAC**: Staff role is locked to the authenticated session; request body role properties are stripped and discarded.
- **Ingestion Protection**: Allowed MIME types: PDF, PNG, JPEG. Dangerous executables (.exe, .sh, .bat) return `415 Unsupported Media Type`; payloads exceeding 15MB return `413 Payload Too Large`.
- **Audit Sanitization**: Audit logs record actors, actions, and outcomes; regex filters block cleartext passwords, bearer tokens, or binary dumps.
- **Accessibility & Contrast**: Conforms to WCAG 2.1 AA standards with 4.5:1 text contrast ratios, visible keyboard focus rings, and ARIA landmarks.

## Emergency Summary Export Architecture
- **Scope**: Minimal essentials only (Blood Group, Emergency Contact, Verified Allergies/ADRs, Chronic Conditions, Essential Daily Medications). Full longitudinal encounter text is excluded by default.
- **Provenance & Watermark**: Every item displays recording facility and date. Header is stamped with `"Emergency summary - source records may be incomplete"`.
- **Non-Revocable Privacy Notice**: Unlike online ABDM consent grants which can be revoked in real time, downloaded or printed copies cannot be remotely revoked.

## Multilingual Voice Intake Architecture (Prompt 13)
- **Speech Recognition Engine**: Web Speech API (`webkitSpeechRecognition`) with language tags (`kn-IN` Kannada, `hi-IN` Hindi, `en-IN` Indian English), accompanied by real-time animated waveform feedback and clarity confidence scores.
- **Dual-Track Script Preservation**: Lossless native script (ಕನ್ನಡ, हिन्दी, English) is preserved in immutable audit metadata and clinical notes alongside standardized English medical translations.
- **Uncertainty & Memory Gaps**: Patient-recalled timelines are explicitly flagged with uncertainty badges (`Date is approximate per patient recollection`). Unknown medication dosages remain unrecorded without hallucinated assertions.
- **Human-in-the-Loop Clinician Gate**: Transcribed speech outputs remain candidate drafts (`AWAITING_REVIEW`) until attending clinician confirmation; commits as either verified institutional OPD notes (`INSTITUTIONAL`) or patient intake recalls (`PATIENT_REPORTED`).

