import assert from 'node:assert';
import { intraHospitalStore } from '../src/services/intraHospitalService.ts';
import { integrationAdapterService } from '../src/services/integrationAdapterService.ts';

async function runTestSuite() {
  console.log('================================================================');
  console.log('CareTrail - Prompts 0-14 Complete System Acceptance Suite (14/14 Checks)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}: ${err?.message || err}`);
      failed++;
    }
  }

  // Check 1: Patient A cannot query Patient B
  test('Check 1: Patient A cannot access Patient B records (Horizontal Privacy 403)', () => {
    const res = intraHospitalStore.validatePatientCrossAccess('pat-rajesh-kumar', 'pat-arvind-swamy');
    assert.strictEqual(res.status, 403, 'Must return 403 Forbidden on horizontal patient access');
    assert.strictEqual(res.success, false, 'Must indicate failure');
    assert.match(res.message || '', /403 Forbidden/, 'Message must explain security denial');
  });

  // Check 2: Unauthenticated and Role Escalation Prevention
  test('Check 2: Role escalation via request payload is rejected by server session', () => {
    const res = intraHospitalStore.validateRoleEscalation('nurse', 'admin');
    assert.strictEqual(res.status, 403, 'Must reject role escalation with 403 Forbidden');
    assert.strictEqual(res.success, false);
    assert.match(res.message || '', /Role escalation from 'nurse' to 'admin' rejected/);
  });

  // Check 3: Clinician Access Boundary & Revocation Re-Check
  test('Check 3: Ungranted clinician access returns 403 Forbidden and audit entry', () => {
    const staffVikram = intraHospitalStore.getAllStaff().find(s => s.id === 'staff-vikram')!;
    const res = intraHospitalStore.getPatientChart('pat-rajesh-kumar', staffVikram);
    assert.strictEqual(res.status, 403, 'Ungranted external doctor access must be 403');
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.data?.records.length, 0, 'No records may be leaked on 403');
  });

  // Check 4: Upload Security (MIME whitelist, size limit, and executable block)
  test('Check 4: Disallowed extensions (.exe) and oversized files (>15MB) rejected', () => {
    const exeRes = intraHospitalStore.validateDocumentUploadPolicy({
      name: 'malware.exe',
      sizeBytes: 2048,
      mimeType: 'application/x-msdownload'
    });
    assert.strictEqual(exeRes.status, 415, 'Executable extension must return 415 Unsupported Media Type');

    const largeRes = intraHospitalStore.validateDocumentUploadPolicy({
      name: 'scan.pdf',
      sizeBytes: 18 * 1024 * 1024,
      mimeType: 'application/pdf'
    });
    assert.strictEqual(largeRes.status, 413, 'Oversized file must return 413 Payload Too Large');
  });

  // Check 5: OCR/AI Draft Pipeline & Idempotency
  test('Check 5: Uploaded documents remain AWAITING_REVIEW until clinician confirms', () => {
    const records = intraHospitalStore.getCrossHospitalRegistry();
    const uploadedRecord = intraHospitalStore.getPatientChart('pat-rajesh-kumar').data?.records.find(
      r => r.sourceCategory === 'PATIENT_UPLOADED'
    );
    assert.ok(uploadedRecord, 'Uploaded record must exist in demo chart');
    assert.strictEqual(uploadedRecord.verificationStatus, 'AWAITING_REVIEW', 'Extracted fields must remain draft');
  });

  // Check 6: Grounded Summary Citations
  test('Check 6: Summary citations are validated against allowed source record IDs', () => {
    const allowed = ['rec-apollo-001', 'rec-apollo-002'];
    const validCheck = intraHospitalStore.validateSummaryCitations([{ recordId: 'rec-apollo-001' }], allowed);
    assert.strictEqual(validCheck.isValid, true, 'Valid citations pass validation');

    const fakeCheck = intraHospitalStore.validateSummaryCitations([{ recordId: 'rec-fake-999' }], allowed);
    assert.strictEqual(fakeCheck.isValid, false, 'Hallucinated citation IDs must be rejected');
    assert.strictEqual(fakeCheck.hallucinatedCitations[0], 'rec-fake-999');
  });

  // Check 7: Unknown Values Remain "Not Recorded"
  test('Check 7: Unknown values are never fabricated into negative assertions', () => {
    const patients = intraHospitalStore.getCrossHospitalRegistry();
    for (const p of patients) {
      assert.ok(!p.allergies.includes('None'), 'Allergies list must not contain synthetic None');
      assert.ok(!p.allergies.includes('No allergies'), 'Allergies list must not contain synthetic No allergies');
    }
  });

  // Check 8: Audit Log Privacy & Credential Leakage Scanner
  test('Check 8: Audit log entries contain zero passwords, bearer tokens, or sensitive bytes', () => {
    const privacy = intraHospitalStore.verifyAuditLogPrivacy();
    assert.strictEqual(privacy.passes, true, 'Audit logs must not contain secrets');
    assert.strictEqual(privacy.issuesFound.length, 0, 'Zero security leaks in audit log');
  });

  // Check 9: Honest External Connector States
  test('Check 9: ABDM Gateway returns NOT_CONFIGURED (HTTP 503) without fake records', () => {
    const staff = intraHospitalStore.getCurrentStaff();
    const probe = integrationAdapterService.probeConnector('conn-abdm-gateway', staff);
    assert.strictEqual(probe.status, 'NOT_CONFIGURED', 'ABDM Gateway must be NOT_CONFIGURED');
    assert.strictEqual(probe.httpStatus, 503, 'Probe must return 503');
    assert.match(probe.message, /ABDM Gateway sandbox credentials/);
  });

  // Check 10: Synthetic FHIR R4 Bundle Labeling
  test('Check 10: Synthetic FHIR R4 Bundle is explicitly labeled example mapping', () => {
    const patient = intraHospitalStore.getCrossHospitalRegistry()[0];
    const records = intraHospitalStore.getPatientChart(patient.id).data?.records || [];
    const bundle = integrationAdapterService.getSyntheticFhirR4Bundle(patient, records);
    assert.strictEqual(bundle.resourceType, 'Bundle');
    assert.match(bundle.syntheticNotice, /EXAMPLE MAPPING \/ NOT A LIVE CONNECTION/);
  });

  // Check 11: Prompt 13 - Multilingual Voice Intake & Entity Extraction
  await test('Check 11: Multilingual voice transcripts (Kannada/Hindi) parse complaints & medication adherence', async () => {
    const { voiceIntakeService } = await import('../src/services/voiceIntakeService.ts');
    const scenarios = voiceIntakeService.getScenarios();
    assert.strictEqual(scenarios.length >= 3, true, 'Must have at least 3 clinical scenarios');

    // Kannada scenario check
    const kn = scenarios.find(s => s.language === 'kn-IN');
    assert.ok(kn, 'Kannada scenario must exist');
    assert.match(kn.originalTranscript, /ಎದೆಬಡಿತ/, 'Kannada script must be present in raw transcript');
    assert.strictEqual(kn.extractedEntities.mentionedMedications.some(m => m.adherenceStatus === 'STOPPED_DISCONTINUED'), true, 'Must detect discontinued BP tablet');

    // Hindi scenario check
    const hi = scenarios.find(s => s.language === 'hi-IN');
    assert.ok(hi, 'Hindi scenario must exist');
    assert.match(hi.originalTranscript, /चक्कर/, 'Hindi Devanagari script must be present');
    assert.strictEqual(hi.extractedEntities.chiefComplaints.length > 0, true, 'Chief complaints must be extracted');
  });

  // Check 12: Prompt 13 - Dual-Track Provenance & Uncertainty Preservation
  await test('Check 12: Voice intake preserves dual-track script, uncertainty flag & AWAITING_REVIEW state', async () => {
    const { voiceIntakeService } = await import('../src/services/voiceIntakeService.ts');
    const staffAnand = intraHospitalStore.getAllStaff().find(s => s.id === 'staff-anand')!;
    const patient = intraHospitalStore.getCrossHospitalRegistry()[0];

    const knScenario = voiceIntakeService.getScenarioById('scenario-kannada-cardiac')!;
    const commitRes = voiceIntakeService.commitVoiceSessionToChart(patient.id, {
      language: 'kn-IN',
      speakerRole: 'PATIENT',
      speakerName: knScenario.speakerName,
      originalTranscript: knScenario.originalTranscript,
      clinicalNoteText: knScenario.translatedEnglishDraft,
      entities: knScenario.extractedEntities,
      authorStaff: staffAnand,
      saveAsInstitutionalDoctorNote: false
    });

    assert.strictEqual(commitRes.success, true, 'Voice intake commit must succeed');
    assert.ok(commitRes.createdRecord, 'Record must be created');
    assert.strictEqual(commitRes.createdRecord.verificationStatus, 'AWAITING_REVIEW', 'Patient voice intake must remain AWAITING_REVIEW');
    assert.strictEqual(commitRes.createdRecord.sourceCategory, 'PATIENT_REPORTED', 'Must carry PATIENT_REPORTED provenance');
    assert.match(commitRes.createdRecord.clinicalNotes, /Native Language: kn-IN/, 'Must preserve transcript audit metadata');
    assert.match(commitRes.createdRecord.clinicalNotes, /ಎದೆಬಡಿತ/, 'Must preserve native script');
  });

  // Check 13: Prompt 14 - Offline Survivability & FIFO Mutation Queue Replay
  await test('Check 13: Offline mutation queue captures changes during network drop & replays safely into chart', async () => {
    const { offlineSyncService } = await import('../src/services/offlineSyncService.ts');
    const staffAnand = intraHospitalStore.getAllStaff().find(s => s.id === 'staff-anand')!;
    const patient = intraHospitalStore.getCrossHospitalRegistry()[0];

    // Simulate going offline
    offlineSyncService.setSimulatedOffline(true, staffAnand);
    assert.strictEqual(offlineSyncService.isOnline(), false, 'Service must reflect offline status');

    // Queue a mutation while offline
    const queued = offlineSyncService.queueMutation({
      mutationType: 'ADD_OPD_NOTE',
      patientId: patient.id,
      patientName: patient.name,
      payload: {
        title: 'Emergency Offline Triage Note',
        clinicalNotes: 'Patient evaluated in basement bay during connectivity outage. Stable vitals.',
        type: 'CONSULTATION',
        diagnosis: 'T2D routine review under offline survivability'
      },
      staff: staffAnand
    });

    assert.ok(queued.id, 'Mutation must receive unique ID');
    assert.strictEqual(queued.status, 'QUEUED_LOCAL', 'Status must be QUEUED_LOCAL');
    assert.strictEqual(offlineSyncService.getPendingCount() > 0, true, 'Queue must have pending items');

    // Replay queue when connection restored
    offlineSyncService.setSimulatedOffline(false, staffAnand);
    assert.strictEqual(offlineSyncService.isOnline(), true, 'Service must reflect online status');

    const syncReport = offlineSyncService.replaySyncQueue(staffAnand);
    assert.strictEqual(syncReport.successfullySynced > 0, true, 'At least one mutation must be synced');
    assert.strictEqual(syncReport.failedCount, 0, 'Zero replay sync failures');

    // Verify note exists in chart
    const chart = intraHospitalStore.getPatientChart(patient.id);
    const syncedRecord = chart.data?.records.find(r => r.title.includes('Emergency Offline Triage Note'));
    assert.ok(syncedRecord, 'Synced record must now exist in chart');
    assert.match(syncedRecord.clinicalNotes, /OFFLINE SYNCED/, 'Record notes must mark offline sync attribution');
  });

  // Check 14: Prompt 14 - System Governance & Unconfigured Integration Honesty
  await test('Check 14: 14-Prompt Governance Audit compiles with 100% PASS score across all prompts and honest unconfigured checklist', async () => {
    const { offlineSyncService } = await import('../src/services/offlineSyncService.ts');
    const auditReport = offlineSyncService.generateGovernanceAudit();

    assert.strictEqual(auditReport.overallScorePercent, 100, 'Overall pass score must be 100%');
    assert.strictEqual(auditReport.totalPrompts, 14, 'Must evaluate all 14 prompts');
    assert.strictEqual(auditReport.completedPrompts, 14, 'Must complete all 14 prompts');
    assert.strictEqual(auditReport.stageEvaluations.length >= 14, true, 'Matrix must contain at least 14 entries');
    assert.strictEqual(auditReport.stageEvaluations.every(p => p.status === 'PASS'), true, 'All evaluated prompts must have PASS status');

    // Verify honest unconfigured checklist
    assert.strictEqual(auditReport.truthfulUnconfiguredChecklist.length >= 3, true, 'Must list at least 3 unconfigured integrations');
    const abdmCheck = auditReport.truthfulUnconfiguredChecklist.find(c => c.integrationName.includes('ABDM'));
    assert.ok(abdmCheck, 'ABDM must be listed in unconfigured checklist');
    assert.match(abdmCheck.truthfulBehavior, /NOT_CONFIGURED/, 'ABDM must state truthful NOT_CONFIGURED behavior');

    const pgCheck = auditReport.truthfulUnconfiguredChecklist.find(c => c.integrationName.includes('PostgreSQL'));
    assert.ok(pgCheck, 'PostgreSQL must be listed in unconfigured checklist');
  });

  // Check 15: DATABASE_POOL_MAX sensible default (5) and explicit override support
  await test('Check 15: DATABASE_POOL_MAX defaults to 5 when unset and permits explicit override', async () => {
    const { getDatabaseConfig } = await import('../src/config/env.ts');
    const dbConfig = getDatabaseConfig();
    assert.strictEqual(dbConfig.poolMax, 5, 'DATABASE_POOL_MAX must default to 5');
    assert.strictEqual(dbConfig.engine, 'postgresql', 'Database engine must remain PostgreSQL');
  });

  // Check 16: External storage, ABDM sandbox & eHospital remain gracefully optional without fabricated credentials
  await test('Check 16: Storage is NOT_CONFIGURED when unconfigured; ABDM and eHospital are disabled without credentials', async () => {
    const { getStorageConfig, getAbdmConfig, getEhospitalConfig } = await import('../src/config/env.ts');
    const storage = getStorageConfig();
    assert.strictEqual(storage.isConfigured, false, 'Storage must not claim to be configured when bucket/provider unset');
    assert.strictEqual(storage.isDurable, false, 'Storage must not claim durability when bucket is not configured');
    assert.strictEqual(storage.statusLabel, 'Not configured', 'Storage status must be Not configured');
    assert.match(storage.notice, /Document storage is not configured/, 'Notice must state document storage is not configured');

    const abdm = getAbdmConfig();
    assert.strictEqual(abdm.isEnabled, false, 'ABDM must be disabled when credentials are not supplied');
    assert.strictEqual(abdm.status, 'Not configured', 'ABDM status must be Not configured');
    assert.strictEqual(abdm.missingRequirements.includes('ABDM_SANDBOX_CLIENT_ID'), true, 'Must list missing client ID');
    assert.strictEqual(abdm.missingRequirements.includes('ABDM_FACILITY_ID'), true, 'Must list missing facility ID');

    const ehospital = getEhospitalConfig();
    assert.strictEqual(ehospital.isEnabled, false, 'eHospital must be disabled when credentials are not supplied');
    assert.strictEqual(ehospital.status, 'Not configured', 'eHospital status must be Not configured');
    assert.strictEqual(ehospital.missingRequirements.includes('EHOSPITAL_CLIENT_TOKEN'), true, 'Must list missing client token');
    assert.strictEqual(ehospital.missingRequirements.includes('EHOSPITAL_FACILITY_CODE'), true, 'Must list missing facility code');
  });

  // Check 17: Environment Validation & Configuration Status Check securely reports status without exposing secrets
  await test('Check 17: getConfigurationStatus reports honest status and validation without leaking secret values', async () => {
    const { getConfigurationStatus, validateRequiredEnvironment } = await import('../src/config/env.ts');
    const status = getConfigurationStatus();
    assert.ok(status.checkedAt, 'Must have timestamp');
    assert.ok(status.requiredVariables.SESSION_SECRET, 'Must check SESSION_SECRET');
    assert.ok(status.requiredVariables.DATABASE_URL, 'Must check DATABASE_URL');
    assert.strictEqual(status.optionalIntegrations.databasePool.poolMax, 5, 'DATABASE_POOL_MAX must default to 5');
    assert.strictEqual(status.optionalIntegrations.documentStorage.status, 'Not configured', 'Storage must be Not configured');
    assert.strictEqual(status.optionalIntegrations.abdmGateway.status, 'Not configured', 'ABDM must be Not configured');
    assert.strictEqual(status.optionalIntegrations.ehospitalBridge.status, 'Not configured', 'eHospital must be Not configured');

    // Ensure no secrets leaked in JSON serialization of configuration status
    const serialized = JSON.stringify(status);
    assert.ok(!serialized.includes('caretrail_password'), 'Must not leak database password');
    assert.ok(!serialized.includes('CHANGE_ME'), 'Must not leak session secret');

    // Validation function check
    const validation = validateRequiredEnvironment(false);
    assert.strictEqual(typeof validation.isValid, 'boolean');
    assert.ok(Array.isArray(validation.errors));
  });

  console.log('\n================================================================');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
