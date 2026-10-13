# CareTrail - Unified Patient View
> **An integration-aware clinical history workspace with source-linked provenance, consent gatekeeper, and offline survivability.**

CareTrail bridges the gap between modern digital record exchange (ABDM FHIR R4) and everyday paper-based clinical reality. When digital health records are genuinely available, it ingests and harmonizes them; when they are not, it provides low-effort document scanning, voice intake (in Kannada, Hindi, and Indian English), and manual recollection capture—all with visible source provenance, strict tenant isolation, and patient-controlled consent.

---

## Quick Links for Hackathon Judges & Evaluators
- **Judge Demonstration Script**: [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) — 8-step continuous 3-to-5 minute patient journey.
- **Judge Evidence Pack**: [`JUDGE_EVIDENCE.md`](./JUDGE_EVIDENCE.md) — Technical verification matrix and automated test evidence.
- **Acceptance Checklist**: [`ACCEPTANCE_CHECKLIST.md`](./ACCEPTANCE_CHECKLIST.md) — Pass/fail matrix across all 14 prompts.
- **Implementation Status**: [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) — Feature status and honest connector disclosures.
- **System Architecture**: [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Multi-tier ingestion and regulatory firewall design.

---

## 1. Project Overview & Core Philosophy

### Non-Negotiable Product Rules
1. **Fictional Data Only**: All demographic details, medical histories, lab investigations, and doctor notes are fictional.
2. **Authorization on the Server**: Hiding a UI button is not security. Horizontal cross-patient access (Patient A reading Patient B) returns **HTTP 403 Forbidden**. Ungranted or revoked clinician access returns **HTTP 403 Forbidden**.
3. **No Fake Hospital Connectivity**: External connectors (ABDM Gateway, NIC e-Hospital, PM-JAY) truthfully return `NOT_CONFIGURED (HTTP 503)` unless live credentials are verified. CareTrail never fabricates synthetic retrieved records.
4. **AI Organizes; It Does Not Diagnose**: Gemini clinical summaries and OCR extractions remain drafts (`AWAITING_REVIEW`) until reviewed and signed by a clinician. All claims link to permitted primary source record IDs.
5. **Unknown is Not Negative**: Missing information displays as *"Not recorded"*, never invented negative assertions like *"No allergies"*.
6. **Lossless Multilingual History**: Verbatim native regional scripts (ಕನ್ನಡ, हिन्दी, English) are preserved in audit trail metadata alongside clinical English drafts.

---

## 2. Prerequisites & Local Development Setup

### System Prerequisites
- **Node.js**: Version 20.x or 22.x LTS
- **npm**: Version 10.x or higher
- **Modern Browser**: Chrome, Edge, or Safari with Web Speech API support for live voice capture

### Installation & Run Commands
```bash
# 1. Clone or export repository
git clone https://github.com/your-org/caretrail.git
cd caretrail

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server (runs on port 3000)
npm run dev

# 5. Run automated acceptance test suite (14 of 14 checks)
npm test

# 6. Type-check & lint
npm run lint

# 7. Production build
npm run build
```

---

## 3. Environment Configuration & Secrets Management

Review `.env.example` for the full list of configuration variables:

| Variable | Description | Safe Default / Placement |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-side Gemini API key for clinical summaries & OCR | Inject via Google AI Studio Secrets Panel |
| `APP_URL` | Public origin URL for CORS validation & redirects | `http://localhost:3000` or Cloud Run URL |
| `PORT` | Node.js runtime port | `3000` |
| `SESSION_SECRET` | 32-character random string for session signature | `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection string for durable storage | `postgresql://user:pass@host:5432/db` (Optional in preview) |
| `STORAGE_PROVIDER` | Private storage driver (`local` \| `gcs` \| `s3`) | `local` |
| `STORAGE_BUCKET` | Encrypted bucket name for clinical scans | `caretrail-private-medical-records` |
| `ABDM_SANDBOX_CLIENT_ID` | National Health Authority ABDM M1-M3 client ID | Unconfigured in prototype (returns 503) |
| `ABDM_SANDBOX_CLIENT_SECRET` | National Health Authority ABDM secret | Unconfigured in prototype (returns 503) |

---

## 4. Database Setup & PostgreSQL Migration Instructions

CareTrail is engineered with a strict **repository interface boundary** (`intraHospitalStore`). In the preview environment, it runs in-memory fixtures. For durable PostgreSQL deployment:

```bash
# 1. Provision PostgreSQL instance (e.g., Supabase, Neon, or Cloud SQL)
# 2. Set DATABASE_URL in your hosting environment:
export DATABASE_URL="postgresql://postgres:password@db.example.com:5432/caretrail?sslmode=require"

# 3. Apply schema migrations (when using Prisma ORM adapter):
npx prisma migrate deploy

# 4. Seed fictional demo accounts:
npm run seed  # (or execute src/data/seed.ts)
```

### Connection Pooling Note
When deploying to serverless environments (Google Cloud Run), configure a connection pool limit (`DATABASE_POOL_MAX=10`) or use PgBouncer / Prisma Accelerate to avoid exhausting database connections during peak concurrency.

---

## 5. Fictional Demo Accounts & Roles

CareTrail includes pre-seeded fictional accounts for immediate demonstration:

### Patients
- **Rajesh Kumar (`PAT-RAJESH-KUMAR`)**: 54 yo male, Type 2 Diabetes, Hypertension, CAD, beta-lactam allergy. Registered at Apollo Hospital.
- **Arvind Swamy (`PAT-ARVIND-SWAMY`)**: 47 yo male, CKD Stage 3, Metformin contraindication. Registered at Apollo Hospital.
- **Sunita Reddy (`PAT-SUNITA-REDDY`)**: 62 yo female, Dyslipidemia, recent nocturnal dyspnea. Registered at Manipal Hospital.

### Clinicians
- **Dr. Anand Sharma (`STAFF-ANAND`)**: Senior Consultant Cardiologist, Apollo Hospital Bengaluru. Has natural organizational access to Rajesh Kumar.
- **Dr. Vikram Sengupta (`STAFF-VIKRAM`)**: Chief Interventional Cardiologist, Manipal Hospital Old Airport Rd. **Cross-hospital clinician**: requires ABDM consent grant from Rajesh Kumar to view chart.
- **Sister Priya Nair (`STAFF-PRIYA`)**: Triage & OPD Nurse, Apollo Hospital Bengaluru. Limited write permissions; cannot author physician addenda.

---

## 6. Three-to-Five-Minute Demo Flow

Follow [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) for detailed step-by-step instructions:
1. **Patient Isolation**: View Rajesh Kumar's scoped records; show cross-patient URL query is blocked (403).
2. **Remembered Event**: Add a patient recollection with approximate date and `PATIENT_REPORTED` provenance badge.
3. **Document Ingestion**: Upload discharge PDF; view split-pane draft extraction; edit field and commit.
4. **Timeline Source Linkage**: Click `[View Original Source]` on timeline to trace back to file checksum.
5. **Cross-Facility Consent**: Switch to Dr. Vikram (Manipal); request access; approve in Patient Consent Portal; unlock chart.
6. **AI Clinical Synthesis**: Generate Gemini brief with clickable citations `[REC-APOLLO-001]`; test zero-record empty state.
7. **Immediate Revocation**: Revoke consent in Patient Portal; verify Dr. Vikram's subsequent read returns HTTP 403 Forbidden.
8. **Truthful Boundary Failures**: Attempt executable upload (rejected with 415); probe unconfigured ABDM Gateway (truthful 503).

---

## 7. Exporting to GitHub & Deployment Plan

### Sync / Export to GitHub
1. In the **Google AI Studio** top bar, click **"Export"** or **"Push to GitHub"**.
2. Select your repository destination (e.g. `github.com/my-org/caretrail`).
3. If GitHub integration is not configured, click **"Download ZIP"**, extract locally, initialize git, and push:
   ```bash
   git init
   git add .
   git commit -m "CareTrail: Complete 14-prompt implementation"
   git remote add origin https://github.com/my-org/caretrail.git
   git push -u origin main
   ```

### Google Cloud Run Deployment
CareTrail is container-ready. To deploy to Cloud Run:
```bash
# 1. Build and submit container image via Google Cloud Build
gcloud builds submit --tag gcr.io/PROJECT_ID/caretrail

# 2. Deploy container to Cloud Run
gcloud run deploy caretrail \
  --image gcr.io/PROJECT_ID/caretrail \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=3000 \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### Post-Deployment Smoke Test Checklist
- [ ] Sign-in: Fictional patient logs in and views only their records.
- [ ] Tenant Isolation: Attempting cross-patient access returns 403.
- [ ] File Upload: Uploading a valid PDF succeeds; uploading an `.exe` returns 415.
- [ ] Cross-Hospital Access: Ungranted clinician receives 403 until consent is granted.
- [ ] Revocation: Patient revoking consent immediately blocks subsequent clinician reads.
- [ ] AI Summary: Citations resolve to permitted source record IDs.
- [ ] Truthful Integrations: ABDM probe returns 503 Not Configured without errors or fake data.

---

## 8. Manual Steps for the User in Google AI Studio
1. **Secrets Configuration**: Open the **Secrets** drawer in the Google AI Studio UI and ensure `GEMINI_API_KEY` is set to an active Gemini API key.
2. **Microphone Permissions**: When testing the Voice Intake engine (Prompt 13), permit browser microphone access in your browser prompt.
3. **Acceptance Verification**: Click **"Verification Rubric"** in the top navigation bar to inspect interactive test proofs for any of the 14 build stages.
4. **Offline Mode**: Toggle the **"Online / Offline"** indicator in the navbar to test offline queueing and synchronization.
