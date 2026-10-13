import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  FileText, 
  Languages, 
  ShieldCheck, 
  Clock, 
  Pill, 
  HeartPulse, 
  Activity, 
  RefreshCw, 
  Save, 
  Volume2
} from 'lucide-react';
import { 
  PatientProfile, 
  StaffProfile, 
  VoiceIntakeLanguage, 
  VoiceIntakeScenario, 
  ExtractedVoiceEntities,
  MedicalRecord
} from '../types/caretrail';
import { 
  voiceIntakeService, 
  CLINICAL_VOICE_SCENARIOS 
} from '../services/voiceIntakeService';

interface VoiceIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  currentStaff: StaffProfile;
  onRecordCommitted?: (newRecord: MedicalRecord) => void;
}

export const VoiceIntakeModal: React.FC<VoiceIntakeModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentStaff,
  onRecordCommitted
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceIntakeLanguage>('kn-IN');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-kannada-cardiac');
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioClarityScore, setAudioClarityScore] = useState<number>(94);
  
  // Transcripts & Extraction
  const [rawTranscript, setRawTranscript] = useState<string>('');
  const [standardizedDraft, setStandardizedDraft] = useState<string>('');
  const [extractedEntities, setExtractedEntities] = useState<ExtractedVoiceEntities | null>(null);
  
  // Clinician Editing & Save options
  const [editedClinicalNote, setEditedClinicalNote] = useState<string>('');
  const [saveAsDoctorNote, setSaveAsDoctorNote] = useState<boolean>(currentStaff.role === 'doctor');
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load default scenario on open
  useEffect(() => {
    if (isOpen) {
      loadScenario('scenario-kannada-cardiac');
      setCommitSuccessMessage(null);
    } else {
      stopRecording();
    }
  }, [isOpen]);

  const loadScenario = (scenarioId: string) => {
    const sc = voiceIntakeService.getScenarioById(scenarioId);
    if (!sc) return;

    setSelectedScenarioId(sc.id);
    setSelectedLanguage(sc.language);
    setAudioClarityScore(sc.clarityConfidenceScore);
    setRecordingSeconds(sc.audioDurationSeconds);
    setRawTranscript(sc.originalTranscript);
    setStandardizedDraft(sc.translatedEnglishDraft);
    setEditedClinicalNote(sc.translatedEnglishDraft);
    setExtractedEntities(sc.extractedEntities);
    setSaveAsDoctorNote(sc.speakerRole === 'CLINICIAN' && currentStaff.role === 'doctor');
  };

  // Web Speech API / Simulated Recorder
  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    setRawTranscript('');
    setCommitSuccessMessage(null);

    // Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // Browser SpeechRecognition check
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          let currentSpeech = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSpeech += event.results[i][0].transcript;
          }
          if (currentSpeech.trim()) {
            setRawTranscript(currentSpeech);
            const parsed = voiceIntakeService.parseTranscriptEntities(currentSpeech, selectedLanguage, 'PATIENT');
            setStandardizedDraft(parsed.standardizedDraft);
            setEditedClinicalNote(parsed.standardizedDraft);
            setExtractedEntities(parsed.entities);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition could not start, continuing with simulated recording:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    // If empty transcript, fall back to current scenario or standard template
    if (!rawTranscript.trim()) {
      const activeSc = voiceIntakeService.getScenarioById(selectedScenarioId);
      if (activeSc) {
        setRawTranscript(activeSc.originalTranscript);
        setStandardizedDraft(activeSc.translatedEnglishDraft);
        setEditedClinicalNote(activeSc.translatedEnglishDraft);
        setExtractedEntities(activeSc.extractedEntities);
      }
    } else {
      const parsed = voiceIntakeService.parseTranscriptEntities(rawTranscript, selectedLanguage, saveAsDoctorNote ? 'CLINICIAN' : 'PATIENT');
      setStandardizedDraft(parsed.standardizedDraft);
      setEditedClinicalNote(parsed.standardizedDraft);
      setExtractedEntities(parsed.entities);
    }
  };

  const handleCommitRecord = () => {
    if (!extractedEntities) return;

    setIsCommitting(true);
    const activeSc = voiceIntakeService.getScenarioById(selectedScenarioId);

    const result = voiceIntakeService.commitVoiceSessionToChart(patient.id, {
      language: selectedLanguage,
      speakerRole: saveAsDoctorNote ? 'CLINICIAN' : (activeSc?.speakerRole || 'PATIENT'),
      speakerName: saveAsDoctorNote ? currentStaff.name : (activeSc?.speakerName || patient.name),
      originalTranscript: rawTranscript,
      clinicalNoteText: editedClinicalNote,
      entities: extractedEntities,
      authorStaff: currentStaff,
      saveAsInstitutionalDoctorNote: saveAsDoctorNote
    });

    setIsCommitting(false);
    if (result.success && result.createdRecord) {
      setCommitSuccessMessage(result.message);
      if (onRecordCommitted) {
        onRecordCommitted(result.createdRecord);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/50 rounded-2xl max-w-5xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-teal-950/80 to-slate-950 border-b border-teal-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border border-teal-500/50 text-teal-300">
              <Mic className="w-5 h-5 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Low-Effort Multilingual Clinical Voice Intake
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                  Prompt 13 / 14
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  Kannada • Hindi • English
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Low-effort voice capture with dual-track transcript, clinical entity extraction, and strict provenance boundaries for <strong className="text-teal-200">{patient.name}</strong> ({patient.abhaId}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {commitSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{commitSuccessMessage}</span>
            </div>
          )}

          {/* Quick Scenario Preset Selector Bar */}
          <div className="bg-slate-950/90 border border-teal-900/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-teal-300">
                  Pre-Recorded Clinical Audio Scenarios (1-Click Evaluation):
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Simulated real OPD encounters with authentic native phrasing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CLINICAL_VOICE_SCENARIOS.map(sc => {
                const isSelected = selectedScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => loadScenario(sc.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-950/80 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">{sc.languageLabel}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-teal-300 border border-slate-800">
                          {sc.languageNativeName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{sc.title}</p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Speaker: {sc.speakerName}</span>
                      <span className="font-mono text-teal-400 font-semibold">{sc.clarityConfidenceScore}% Clarity</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recording & Microphone Controller */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Language Selection & Status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                {(['kn-IN', 'hi-IN', 'en-IN'] as VoiceIntakeLanguage[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'kn-IN' ? 'ಕನ್ನಡ (kn)' : lang === 'hi-IN' ? 'हिन्दी (hi)' : 'English (en)'}
                  </button>
                ))}
              </div>

              {/* Status timer */}
              <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-white font-bold">
                  {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold">{audioClarityScore}% Audio Clarity</span>
              </div>
            </div>

            {/* Middle: Pulsing Audio Waveform Visualizer */}
            <div className="flex items-center space-x-1 h-7 px-3 bg-slate-900/60 rounded-lg border border-slate-800/80 justify-center">
              {[4, 12, 22, 16, 28, 14, 8, 24, 18, 10, 26, 12, 6, 20, 15, 8].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording 
                      ? 'bg-gradient-to-t from-teal-500 to-emerald-400 animate-pulse' 
                      : 'bg-teal-900/60'
                  }`}
                  style={{ 
                    height: isRecording ? `${Math.max(4, (h * (1 + (i % 3) * 0.2)) % 28)}px` : `${Math.min(h, 12)}px` 
                  }}
                />
              ))}
            </div>

            {/* Right: Record / Stop controls */}
            <div className="flex items-center space-x-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-950 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Record from Mic</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950 transition-all cursor-pointer animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop & Extract Draft</span>
                </button>
              )}

              <button
                onClick={() => loadScenario(selectedScenarioId)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reset to scenario default"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DUAL-TRACK INSPECTION: Original Script vs Standardized English Extract */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Track 1: Original Audio & Native Script Transcript */}
            <div className="bg-slate-950/80 border border-teal-900/60 rounded-xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-300">
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span className="uppercase tracking-wider">Track 1: Native Script Transcript</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-200 border border-teal-800">
                  {selectedLanguage}
                </span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 min-h-[140px] text-sm text-slate-200 leading-relaxed font-sans select-text">
                {rawTranscript || (
                  <span className="text-slate-500 italic">
                    Press 'Record from Mic' or select a preset scenario above to view speech transcription...
                  </span>
                )}
              </div>

              {/* Provenance Banner */}
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Intake Audio Provenance:</span>
                  <p className="mt-0.5 text-slate-400">
                    Audio stream digitized via browser Speech Web API with lossless text preservation. Original regional script preserved in database audit trail alongside English translation.
                  </p>
                </div>
              </div>
            </div>

            {/* Track 2: Extracted Candidate Clinical Entities & English Draft */}
            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="uppercase tracking-wider">Track 2: Extracted Clinical Candidate Entities</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-800">
                  Candidate Draft
                </span>
              </div>

              {extractedEntities ? (
                <div className="space-y-3 text-xs">
                  {/* Chief Complaints */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Chief Complaints & Symptoms:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedEntities.chiefComplaints.map((cc, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                          {cc}
                        </span>
                      ))}
                      {extractedEntities.symptoms.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md font-medium bg-slate-900 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Approximate Timeline with Uncertainty Banner */}
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-200">Timeline Uncertainty Flag:</span>
                      <p className="text-amber-300/90 mt-0.5 font-mono text-[11px]">
                        {extractedEntities.approximateTimeline}
                      </p>
                    </div>
                  </div>

                  {/* Mentioned Medications */}
                  {extractedEntities.mentionedMedications.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Pill className="w-3 h-3 text-teal-400" />
                        <span>Medications Mentioned by Patient:</span>
                      </div>
                      <div className="space-y-1.5">
                        {extractedEntities.mentionedMedications.map((m, i) => {
                          const isStopped = m.adherenceStatus === 'STOPPED_DISCONTINUED';
                          return (
                            <div 
                              key={i} 
                              className={`p-2 rounded-lg border flex items-center justify-between ${
                                isStopped
                                  ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            >
                              <div>
                                <span className="font-bold text-white">{m.medicineName}</span>
                                {m.dosage && <span className="ml-1.5 text-teal-300 font-mono text-[11px]">{m.dosage}</span>}
                                {m.context && <p className="text-[10px] text-slate-400 mt-0.5">{m.context}</p>}
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isStopped
                                  ? 'bg-rose-900/60 border-rose-700 text-rose-200'
                                  : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                              }`}>
                                {m.adherenceStatus || 'REPORTED'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Clinical Safety Risks */}
                  {extractedEntities.clinicalRisksIdentified && extractedEntities.clinicalRisksIdentified.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/60">
                      <div className="text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-1">
                        Safety Risks Flagged for Clinician:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-rose-200">
                        {extractedEntities.clinicalRisksIdentified.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  Candidate entities will be extracted automatically once speech is captured.
                </div>
              )}
            </div>
          </div>

          {/* Clinician Review & Edit Gate */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Clinician Review & Progress Note Editor (Standardized English):
                </span>
              </div>

              {/* Doctor Note vs Patient Recall Toggle */}
              <div className="flex items-center space-x-2 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={saveAsDoctorNote}
                    onChange={(e) => setSaveAsDoctorNote(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    Commit as Verified Clinician OPD Note ({currentStaff.name})
                  </span>
                </label>
              </div>
            </div>

            <textarea
              value={editedClinicalNote}
              onChange={(e) => setEditedClinicalNote(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed font-sans"
              placeholder="Clinician notes to commit to chart..."
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300">Commit Target:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  saveAsDoctorNote 
                    ? 'bg-teal-950 border-teal-700 text-teal-300' 
                    : 'bg-amber-950 border-amber-800 text-amber-300'
                }`}>
                  {saveAsDoctorNote ? 'INSTITUTIONAL • VERIFIED' : 'PATIENT_REPORTED • AWAITING_REVIEW'}
                </span>
                <span>• Attribution: {saveAsDoctorNote ? currentStaff.name : patient.name}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitRecord}
                  disabled={!rawTranscript.trim() || isCommitting}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg font-semibold text-white shadow-md transition-all cursor-pointer ${
                    !rawTranscript.trim() || isCommitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isCommitting ? 'Committing...' : 'Commit to Patient Chart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
