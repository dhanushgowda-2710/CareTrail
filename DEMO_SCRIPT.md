# CareTrail: Judge Demonstration Script
**Continuous Fictional Patient Journey (3 to 5 Minutes)**
*Standardized Hackathon Demonstration Guide based on Prompt 14 Specification*

---

## Overview & Demo Principles
This demonstration script walks through one continuous, uninterrupted journey for fictional patient **Rajesh Kumar (PAT-RAJESH-KUMAR)** and attending clinicians **Dr. Anand Sharma (Apollo Hospital Bengaluru)** and **Dr. Vikram Sengupta (Manipal Hospital Old Airport Rd)**.

### Non-Negotiable Demonstration Rules
1. **Fictional Data Only**: All patient demographics, medical history, lab values, and doctor notes are fictional.
2. **Honest Boundary Enforcement**: No fabricated government gateway connections (ABDM Gateway returns truthful `NOT_CONFIGURED / HTTP 503`).
3. **No Unearned Clinical Claims**: AI summarizes and extracts for human review; it never diagnoses or prescribes.
4. **Observable Proof**: Every step produces visible changes on screen, network inspector responses, and immutable audit logs.

---

## 8-Step Continuous Demo Journey

### Step 1: Patient View & Data Isolation (Rajesh Kumar)
- **Role / Actor**: Fictional Patient (`PAT-RAJESH-KUMAR`).
- **Screen**: Patient Profile & Unified Timeline (`/` -> Patient Consent & My Records).
- **Setup**: Open the CareTrail workspace. The default patient Rajesh Kumar is loaded with his institutional records from Apollo Hospital.
- **Action**:
  1. Observe the Patient Header: Rajesh Kumar, Age 54, Type 2 Diabetes & Hypertension.
  2. Notice that **only Rajesh's records are displayed**. There is no global patient directory or count exposed to patient views.
  3. Attempting to access another patient's records (e.g. `PAT-ARVIND-SWAMY`) via URL or API returns **HTTP 403 Forbidden** with audit reason `CROSS_PATIENT_ACCESS_DENIED`.
- **Observable Result**:
  - UI displays Apollo Hospital encounters and baseline timeline.
  - API Inspector confirms scoped query: `GET /api/patient/pat-rajesh-kumar/timeline -> 200 OK`.
  - Horizontal cross-patient access to `pat-arvind-swamy` returns `403 Forbidden`.

---

### Step 2: Add Remembered Event with Patient-Reported Provenance
- **Role / Actor**: Fictional Patient / Caregiver (`PAT-RAJESH-KUMAR`).
- **Screen**: "Add Remembered Event" Modal.
- **Action**:
  1. Click **"Add Remembered Event"** in the top action bar.
  2. Fill in the recollection form:
     - Event Date: `12 Oct 2024` (Marked checkbox: **"Date is approximate / patient recall"**).
     - Facility: *Neighborhood Pharmacy Clinic (Jayanagar)*.
     - Symptoms / Reason: *"Severe dizziness after morning tea, felt lightheaded for 20 minutes"*.
     - Treatment remembered: *"Took half glass ORS and sat under fan"*.
     - Notes: Leave prescription dosage blank (unknown fields stay blank).
  3. Submit the event.
- **Observable Result**:
  - Timeline instantly updates with a new card tagged with a distinctive amber **PATIENT_REPORTED** badge and **AWAITING_REVIEW** verification pill.
  - The card clearly differentiates **Event Date (12 Oct 2024, Approximate)** from **System Ingestion Date (Today)**.
  - Unknown fields display *"Not recorded"*, never invented negative facts ("No medications").
  - API Inspector: `POST /api/patient/pat-rajesh-kumar/events -> 201 Created` with provenance metadata.

---

### Step 3: Document Upload & Human-in-the-Loop Extraction Draft
- **Role / Actor**: Patient / Attending Clinician.
- **Screen**: "Upload Document & OCR Review" Modal (`UploadDocumentModal`).
- **Action**:
  1. Click **"Upload Document"** in the timeline header.
  2. Select the sample file: `Discharge_Summary_Apollo_Cardiology.pdf` (or click *"Use Preloaded Fictional Discharge Summary"*).
  3. Observe upload progress bar and MIME verification (`application/pdf`, < 15MB).
  4. The screen presents a split view:
     - **Left Pane**: Original document preview / raw text representation.
     - **Right Pane**: Structured Candidate Extraction Draft parsed by server-side Gemini/OCR.
  5. Point out that all extracted candidate fields (Discharge Diagnosis: *Unstable Angina*, Statin Dose: *Atorvastatin 40mg*) are clearly marked **DRAFT / AWAITING_REVIEW**.
  6. Edit one candidate field (e.g., adjust follow-up date from draft `2024-11-15` to confirmed `2024-11-20`).
  7. Click **"Approve & Commit to Chart"**.
- **Observable Result**:
  - The candidate changes from draft to committed status.
  - Reprocessing the exact same document displays an idempotency warning: *"Document hash already processed. Duplicate event avoided."*
  - Original file is retained privately with server-side authorization check.

---

### Step 4: Source-Linked Timeline & Provenance Verification Badge
- **Role / Actor**: Attending Clinician / Reviewer.
- **Screen**: Patient Unified Timeline.
- **Action**:
  1. Scroll down to the newly committed timeline event.
  2. Observe the metadata header:
     - Provenance: **PATIENT_UPLOADED / CLINICIAN_REVIEWED**.
     - Source Document Link: `[View Original PDF (Discharge_Summary_Apollo_Cardiology.pdf)]`.
     - Timestamp: Dual display showing Event Date vs Upload Date.
  3. Click **"View Original Source"**.
- **Observable Result**:
  - A side drawer opens displaying the exact source excerpt and file hash without exposing a public static URL.
  - Proves that AI extractions never become anonymous verified facts without audit lineage.

---

### Step 5: Cross-Facility Access Request & Patient Consent Approval
- **Role / Actor**: Dr. Vikram Sengupta (Manipal Hospital) + Patient Rajesh Kumar.
- **Screen**: Clinician Workspace -> Scoped Access Request -> Patient Consent Portal.
- **Action**:
  1. Switch active clinician persona in the navbar dropdown from **Dr. Anand Sharma (Apollo)** to **Dr. Vikram Sengupta (Manipal Hospital)**.
  2. Notice that Rajesh Kumar is **not in Dr. Vikram's local patient directory**.
  3. In the patient search, search for `PAT-RAJESH-KUMAR`. A locator match is found with a locked badge: *"Cross-Facility Access Required (Manipal -> Apollo)"*.
  4. Click **"Request Access"**:
     - Purpose: *Emergency Cardiology OPD Consultation*.
     - Requested Scope: *Comprehensive Clinical Chart (Past 12 Months)*.
     - Requested Duration: *48 Hours*.
  5. Click **"Submit ABDM Access Request"**.
  6. Open the **"Patient Consent Portal"** (`UserCheck` icon in navbar).
  7. Patient Rajesh sees Dr. Vikram's pending request with facility identity, verified purpose, and proposed expiry.
  8. Click **"Approve Access Grant"**.
  9. Return to Dr. Vikram's clinician workspace: Rajesh Kumar's full chart is now unlocked.
- **Observable Result**:
  - Dr. Vikram can now view Rajesh's Apollo records with a green **"Consent Granted (ABDM-GRANT-7821)"** indicator.
  - Audit log records: `CONSENT_REQUEST_CREATED`, `CONSENT_GRANT_APPROVED`, and `CROSS_HOSPITAL_CHART_ACCESSED`.

---

### Step 6: Source-Linked AI Clinical Summary & Clickable Citations
- **Role / Actor**: Dr. Vikram Sengupta (Manipal Hospital).
- **Screen**: "AI Clinical Synthesis" Card (`AiClinicalSynthesisCard`).
- **Action**:
  1. Select Date Range: `Past 6 Months (May 2024 - Oct 2024)`.
  2. Click **"Generate Clinical Synthesis"**.
  3. Server invokes Gemini proxy with permitted evidence only.
  4. Review the generated brief:
     - Longitudinal Overview: T2D with diabetic nephropathy, recent troponin elevation, beta-lactam allergy.
     - Key Clinical Events with bracketed citation chips: e.g. `[REC-APOLLO-001]`, `[REC-APOLLO-003]`.
  5. **Click on citation chip `[REC-APOLLO-001]`**.
  6. Test the **True Empty State**: Change the date range to a historical period with zero records (e.g., `Jan 2010 - Dec 2010`).
- **Observable Result**:
  - Clicking `[REC-APOLLO-001]` automatically scrolls the timeline to the exact source encounter and highlights it with a glowing border.
  - Citation Inspector modal opens with deep-link evidence text and verified author details.
  - Zero-record query returns a true empty state: *"No medical records found for the selected period (2010-01-01 to 2010-12-31). AI summary generation skipped."* (No fabricated generic health claims).

---

### Step 7: Patient Consent Revocation & Immediate 403 API Block
- **Role / Actor**: Patient Rajesh Kumar -> Dr. Vikram Sengupta.
- **Screen**: Patient Consent Portal -> Clinician Workspace.
- **Action**:
  1. Open the **"Patient Consent Portal"**.
  2. Find Dr. Vikram's active grant (`ABDM-GRANT-7821`).
  3. Click **"Revoke Access Now"**. Confirm the revocation notice: *"Revocation takes effect immediately on server API routes."*
  4. Return to Dr. Vikram's workspace and refresh or attempt to view Rajesh's record.
- **Observable Result**:
  - Access is **immediately blocked with HTTP 403 Forbidden**.
  - UI displays an **Access Denied Modal** with message: *"Access Revoked by Patient. Consent grant ABDM-GRANT-7821 is no longer active."*
  - Open the **Audit Trail**: Shows `CONSENT_GRANT_REVOKED` and `CROSS_HOSPITAL_ATTEMPT_DENIED`.

---

### Step 8: Truthful Boundary Failure Cases
- **Role / Actor**: System Security Evaluator / Clinician.
- **Screen**: Document Upload Modal & External Integration Status Modal.
- **Action**:
  1. **Upload Validation Failure**: In the upload drawer, attempt to upload `exploit.exe` or a simulated file >15MB.
     - *Result*: Immediately rejected with **HTTP 415 Unsupported Media Type** ("Executables are strictly prohibited") or **HTTP 413 Payload Too Large**.
  2. **Truthful External Connector Probe**: Open the **"Integration Status"** modal (`Workflow` icon in navbar).
     - Inspect connector `ABDM Gateway (NHA SandBox)`.
     - Click **"Run Diagnostic Probe"**.
     - *Result*: Returns truthful **HTTP 503 Not Configured** with message: *"Missing ABDM_SANDBOX_CLIENT_ID and ABDM_SANDBOX_CLIENT_SECRET. Live ABDM M1-M3 certification required."* Zero fake records are fabricated.
- **Observable Result**:
  - Rejection is clean, transparent, and logged in the immutable audit log.
  - Proves the application respects real-world security and regulatory boundaries.

---

## Known Limitations & Environment Boundaries
1. **Durable Database Persistence**: Currently running in-memory repository fixtures. Production durability requires configuring `DATABASE_URL` for PostgreSQL.
2. **Private Cloud Storage**: Original uploaded files are held in session buffer; production deployment requires S3/GCS bucket configuration (`STORAGE_BUCKET`).
3. **ABDM Sandbox Gateway**: Requires official NHA Sandbox client credentials and M1-M3 sandbox onboarding.
4. **Speech Recognition**: Uses browser Web Speech API (`webkitSpeechRecognition`); offline fallback uses pre-recorded clinical presets for Kannada, Hindi, and Indian English.

---

## Demo Script Acceptance Checklist Mapping

| Demo Step | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Step 1** | Patient Sign-in & Horizontal Isolation | **PASS** | `pat-rajesh-kumar` scoped; cross-query returns 403. |
| **Step 2** | Add Remembered Event (PATIENT_REPORTED) | **PASS** | Uncertainty preserved; distinct from upload time. |
| **Step 3** | Document Upload & Extraction Draft | **PASS** | Original PDF beside candidate draft; review required. |
| **Step 4** | Timeline Source Linkage & Provenance | **PASS** | Clickable link to original source excerpt with hash. |
| **Step 5** | Cross-Facility Access Request & Consent | **PASS** | Scoped request approved via Patient Consent Portal. |
| **Step 6** | Source-Linked AI Summary & Empty State | **PASS** | Bracketed citation chips deep-link; 0 records = empty state. |
| **Step 7** | Consent Revocation & Immediate 403 | **PASS** | Revocation instantly blocks API reads; audit event logged. |
| **Step 8** | Truthful Security & Connector Failures | **PASS** | .exe rejected with 415; ABDM probe returns truthful 503. |
