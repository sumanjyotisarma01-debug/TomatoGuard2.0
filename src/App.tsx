import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CameraModal } from './components/CameraModal';
import { ImageUploader } from './components/ImageUploader';
import { DiagnosisResult } from './components/DiagnosisResult';
import { DosageCalculator, PreselectedTreatment } from './components/DosageCalculator';
import { DiseaseEncyclopedia } from './components/DiseaseEncyclopedia';
import { ScanHistory } from './components/ScanHistory';
import { CnnPipelineExplorer } from './components/CnnPipelineExplorer';
import { TomatoDiagnosis, DiagnosisRecord } from './types/disease';
import { AlertCircle, Sprout, ArrowLeft, Layers } from 'lucide-react';
import { SAMPLE_LEAVES } from './data/sampleLeaves';

const STORAGE_KEY = 'tomatoguard_diagnoses_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'pipeline' | 'encyclopedia' | 'calculator' | 'history'>('scan');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<TomatoDiagnosis | null>(null);
  const [activeImageForDiagnosis, setActiveImageForDiagnosis] = useState<string | null>(null);
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [calculatorTreatment, setCalculatorTreatment] = useState<PreselectedTreatment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load records from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse localStorage history:', e);
    }
  }, []);

  // Save records to local storage
  const saveRecordsToStorage = (updated: DiagnosisRecord[]) => {
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const [lastPayload, setLastPayload] = useState<{
    imageBase64: string;
    notes?: string;
    growthEnvironment?: string;
    sampleId?: string;
  } | null>(null);

  const handleAnalyze = async (payload: {
    imageBase64: string;
    notes?: string;
    growthEnvironment?: string;
    sampleId?: string;
  }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setLastPayload(payload);

    try {
      const response = await fetch('/api/analyze-leaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: payload.imageBase64,
          notes: payload.notes,
          growthEnvironment: payload.growthEnvironment,
          sampleId: payload.sampleId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server returned an error during analysis.');
      }

      setCurrentDiagnosis(data.diagnosis);
      setActiveImageForDiagnosis(payload.imageBase64);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(
        err.message || 'Unable to complete diagnosis. Please ensure the image is clear and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!currentDiagnosis || !activeImageForDiagnosis) return;

    const newRecord: DiagnosisRecord = {
      id: `record_${Date.now()}`,
      timestamp: Date.now(),
      imageDataUrl: activeImageForDiagnosis,
      diagnosis: currentDiagnosis,
      treatmentStatus: 'monitoring',
    };

    const updated = [newRecord, ...records];
    saveRecordsToStorage(updated);
  };

  const isCurrentDiagnosisSaved = records.some(
    (r) =>
      r.diagnosis.condition === currentDiagnosis?.condition &&
      r.imageDataUrl === activeImageForDiagnosis
  );

  const handleSelectRecordFromHistory = (rec: DiagnosisRecord) => {
    setCurrentDiagnosis(rec.diagnosis);
    setActiveImageForDiagnosis(rec.imageDataUrl);
    setSelectedImage(rec.imageDataUrl);
    setActiveTab('scan');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecordsToStorage(updated);
  };

  const handleUpdateRecordStatus = (
    id: string,
    status: 'monitoring' | 'in_progress' | 'resolved'
  ) => {
    const updated = records.map((r) =>
      r.id === id ? { ...r, treatmentStatus: status } : r
    );
    saveRecordsToStorage(updated);
  };

  const handleClearAllRecords = () => {
    if (window.confirm('Are you sure you want to delete all saved plant diagnosis records?')) {
      saveRecordsToStorage([]);
    }
  };

  const handleNavigateToCalculator = (treatment: {
    name: string;
    dosageText?: string;
    frequency?: string;
  }) => {
    setCalculatorTreatment({
      name: treatment.name,
      dosageText: treatment.dosageText,
      frequency: treatment.frequency,
    });
    setActiveTab('calculator');
  };

  const handleSelectSampleFromEncyclopedia = async (imageUrl: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCurrentDiagnosis(null);
        setActiveTab('scan');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setSelectedImage(imageUrl);
      setCurrentDiagnosis(null);
      setActiveTab('scan');
    }
  };

  const handleSelectSampleForScan = async (sampleId: string) => {
    const sample = SAMPLE_LEAVES.find((s) => s.id === sampleId) || SAMPLE_LEAVES[0];
    try {
      const res = await fetch(sample.imageUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCurrentDiagnosis(null);
        setActiveTab('scan');
      };
      reader.readAsDataURL(blob);
    } catch {
      setSelectedImage(sample.imageUrl);
      setCurrentDiagnosis(null);
      setActiveTab('scan');
    }
  };

  const handleCameraCapture = (dataUrl: string) => {
    setSelectedImage(dataUrl);
    setCurrentDiagnosis(null);
    setActiveTab('scan');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveCamera={() => setIsCameraModalOpen(true)}
        historyCount={records.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {lastPayload && (
                <button
                  onClick={() => handleAnalyze(lastPayload)}
                  disabled={isAnalyzing}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Retry Analysis
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 hover:text-rose-900 font-bold px-2 py-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Scan & Diagnose */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            {currentDiagnosis && activeImageForDiagnosis ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setCurrentDiagnosis(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Diagnose Another Tomato Leaf</span>
                </button>

                <DiagnosisResult
                  diagnosis={currentDiagnosis}
                  specimenImage={activeImageForDiagnosis}
                  onNavigateToCalculator={handleNavigateToCalculator}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={isCurrentDiagnosisSaved}
                  onNavigateToPipeline={() => setActiveTab('pipeline')}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Methodology Banner */}
                <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5 text-emerald-200" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-tight">
                        Powered by PlantVillage CNN Methodology (MobileNetV2 / ResNet)
                      </h2>
                      <p className="text-xs text-emerald-100/90 mt-0.5">
                        Trained on 18,160+ leaf images across 10 tomato classes with Grad-CAM feature attention maps.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    View ML Pipeline & Colab Code →
                  </button>
                </div>

                <ImageUploader
                  onAnalyze={handleAnalyze}
                  isLoading={isAnalyzing}
                  onOpenLiveCamera={() => setIsCameraModalOpen(true)}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: CNN & Colab Pipeline Explorer */}
        {activeTab === 'pipeline' && (
          <CnnPipelineExplorer
            onNavigateToScan={() => setActiveTab('scan')}
            onSelectSampleForScan={handleSelectSampleForScan}
          />
        )}

        {/* Tab 3: Field Encyclopedia */}
        {activeTab === 'encyclopedia' && (
          <DiseaseEncyclopedia
            onSelectSampleForTest={handleSelectSampleFromEncyclopedia}
          />
        )}

        {/* Tab 4: Dosage Calculator */}
        {activeTab === 'calculator' && (
          <DosageCalculator initialTreatment={calculatorTreatment} />
        )}

        {/* Tab 5: Scan History */}
        {activeTab === 'history' && (
          <ScanHistory
            records={records}
            onSelectRecord={handleSelectRecordFromHistory}
            onDeleteRecord={handleDeleteRecord}
            onUpdateStatus={handleUpdateRecordStatus}
            onClearAll={handleClearAllRecords}
          />
        )}
      </main>

      {/* Live Camera Viewfinder Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">TomatoGuard</span>
            <span aria-hidden="true">·</span>
            <span>PlantVillage CNN Pathology & IPM Treatment System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>PlantVillage Benchmark Dataset</span>
            <span aria-hidden="true">·</span>
            <span>Google Colab GPU Ready</span>
            <span aria-hidden="true">·</span>
            <span>Flask REST API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
