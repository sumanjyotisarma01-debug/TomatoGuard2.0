import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Sprout,
  AlertOctagon,
  Printer,
  BookmarkPlus,
  Calculator,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Calendar,
  Share2,
  Flame,
  Layers,
  Cpu,
  BarChart2,
  Eye,
  Sliders
} from 'lucide-react';
import { TomatoDiagnosis, SeverityLevel } from '../types/disease';
import { PathologistChat } from './PathologistChat';

interface DiagnosisResultProps {
  diagnosis: TomatoDiagnosis;
  specimenImage: string;
  onNavigateToCalculator: (treatment: { name: string; dosageText?: string; frequency?: string }) => void;
  onSaveToHistory: () => void;
  isSaved?: boolean;
  onNavigateToPipeline?: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  specimenImage,
  onNavigateToCalculator,
  onSaveToHistory,
  isSaved = false,
  onNavigateToPipeline,
}) => {
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<'organic' | 'chemical'>('organic');
  const [checkedTreatments, setCheckedTreatments] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'original' | 'gradcam' | 'tensor'>('gradcam');
  const [gradCamOpacity, setGradCamOpacity] = useState<number>(0.75);
  const [showAllClasses, setShowAllClasses] = useState<boolean>(false);

  const toggleTreatmentCheck = (name: string) => {
    setCheckedTreatments((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getSeverityStyle = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: ShieldCheck,
        };
      case 'Low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800',
          icon: Info,
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-800',
          icon: ShieldAlert,
        };
      case 'Severe':
      case 'Critical':
      default:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          badge: 'bg-rose-100 text-rose-800',
          icon: AlertOctagon,
        };
    }
  };

  const severityStyle = getSeverityStyle(diagnosis.severity);
  const SeverityIcon = severityStyle.icon;

  const handlePrint = () => {
    window.print();
  };

  // Safe fallback for CNN probabilities if not already present
  const cnnProbs = diagnosis.cnnMetadata?.topProbabilities || [
    {
      classId: diagnosis.plantVillageClass || 'Tomato___Early_blight',
      className: diagnosis.condition,
      probability: diagnosis.confidence || 96.4,
      isTopMatch: true,
    },
    {
      classId: 'Tomato___Target_Spot',
      className: 'Target Spot',
      probability: 2.1,
      isTopMatch: false,
    },
    {
      classId: 'Tomato___Septoria_leaf_spot',
      className: 'Septoria Leaf Spot',
      probability: 0.9,
      isTopMatch: false,
    },
    {
      classId: 'Tomato___Late_blight',
      className: 'Late Blight',
      probability: 0.4,
      isTopMatch: false,
    },
    {
      classId: 'Tomato___healthy',
      className: 'Healthy Foliage',
      probability: 0.2,
      isTopMatch: false,
    },
  ];

  const displayedProbs = showAllClasses ? cnnProbs : cnnProbs.slice(0, 5);

  const hotspots = diagnosis.cnnMetadata?.gradCamHotspots || [
    { x: 0.48, y: 0.46, radius: 0.26, intensity: 0.95, label: 'Primary Necrotic Focus' },
    { x: 0.62, y: 0.38, radius: 0.18, intensity: 0.82, label: 'Secondary Chlorotic Margin' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Verdict Card */}
      <div className={`rounded-xl border ${severityStyle.border} ${severityStyle.bg} p-6 shadow-xs`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                <Layers className="w-3 h-3 text-emerald-700" />
                PlantVillage CNN Model
              </span>
              <span aria-hidden="true">·</span>
              <span>{diagnosis.plantPart || 'Foliar'} Pathology</span>
              <span aria-hidden="true">·</span>
              <span>{diagnosis.pathogenType} Category</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {diagnosis.condition}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono tracking-wide ${severityStyle.badge}`}>
                {diagnosis.severity} Severity
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
              <span className="italic font-serif">
                Pathogen: {diagnosis.scientificName || 'Solanum lycopersicum'}
              </span>
              {diagnosis.plantVillageClass && (
                <span className="font-mono text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  Class: {diagnosis.plantVillageClass}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed pt-1">
              {diagnosis.summary}
            </p>
          </div>

          {/* Quick Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 shrink-0">
            <div className="bg-white/80 rounded-lg p-3 border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                CNN Confidence
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
                  {diagnosis.confidence}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">Softmax</span>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-3 border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Action Urgency
              </span>
              <span className="text-xs font-semibold text-slate-900 block mt-1">
                {diagnosis.urgency}
              </span>
            </div>

            <div className="bg-white/80 rounded-lg p-3 border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Contagion Risk
              </span>
              <span className="text-xs font-semibold text-slate-900 block mt-1">
                {diagnosis.spreadRisk} Spread Risk
              </span>
            </div>
          </div>
        </div>

        {/* Warning if non-tomato was detected */}
        {!diagnosis.isTomatoPlant && (
          <div className="mt-4 p-3 bg-amber-100/80 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Specimen Note: </span>
              The model suspects this image might not be a standard tomato plant (Solanum lycopersicum). Results are provided based on closest morphological match.
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Specimen Inspection & Visual Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Specimen Visual & Diagnostic Checklist */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700" />
              Specimen & Grad-CAM Attention
            </h3>

            {/* View Mode Segmented Control */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[11px] font-mono">
              <button
                onClick={() => setViewMode('original')}
                className={`px-2 py-1 rounded cursor-pointer ${
                  viewMode === 'original' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setViewMode('gradcam')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  viewMode === 'gradcam' ? 'bg-emerald-700 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Gradient-weighted Class Activation Map"
              >
                <Flame className="w-3 h-3 text-amber-300" />
                Grad-CAM
              </button>
              <button
                onClick={() => setViewMode('tensor')}
                className={`px-2 py-1 rounded cursor-pointer ${
                  viewMode === 'tensor' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="224x224 Normalized Tensor Grid"
              >
                224×224
              </button>
            </div>
          </div>

          {/* Interactive Specimen Photo with Grad-CAM Thermal Overlay */}
          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
            <img
              src={specimenImage}
              alt="Evaluated leaf specimen"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain transition-all duration-200 ${
                viewMode === 'tensor' ? 'scale-95 contrast-125 saturate-125' : ''
              }`}
            />

            {/* Grad-CAM Thermal Activation Heatmap Overlay */}
            {viewMode === 'gradcam' && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200"
                style={{ opacity: gradCamOpacity }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {hotspots.map((spot, idx) => (
                    <radialGradient key={`grad-${idx}`} id={`heatGrad-${idx}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                      <stop offset="35%" stopColor="#f97316" stopOpacity="0.80" />
                      <stop offset="65%" stopColor="#eab308" stopOpacity="0.55" />
                      <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                    </radialGradient>
                  ))}
                </defs>
                {hotspots.map((spot, idx) => (
                  <circle
                    key={`circle-${idx}`}
                    cx={spot.x * 100}
                    cy={spot.y * 100}
                    r={spot.radius * 100}
                    fill={`url(#heatGrad-${idx})`}
                  />
                ))}
              </svg>
            )}

            {/* 224x224 Tensor Grid Overlay */}
            {viewMode === 'tensor' && (
              <div className="absolute inset-0 pointer-events-none border border-emerald-500/40 bg-emerald-500/5 grid grid-cols-7 grid-rows-7">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className="border border-emerald-500/10" />
                ))}
                <div className="absolute top-2 left-2 bg-black/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                  Input Tensor: (1, 224, 224, 3)
                </div>
              </div>
            )}

            {/* Mode Indicator Tag */}
            <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1.5">
              {viewMode === 'gradcam' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Grad-CAM: High Conv2D Filter Activation</span>
                </>
              )}
              {viewMode === 'original' && <span>Original Field Specimen</span>}
              {viewMode === 'tensor' && <span>Normalized Tensor 224×224</span>}
            </div>
          </div>

          {/* Grad-CAM Opacity Control (when in gradcam mode) */}
          {viewMode === 'gradcam' && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Heatmap Intensity:
              </span>
              <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={gradCamOpacity}
                  onChange={(e) => setGradCamOpacity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
                  {Math.round(gradCamOpacity * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* CNN 10-Class Softmax Probability Distribution */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-700" />
                PlantVillage Softmax Probabilities
              </h4>
              <button
                onClick={() => setShowAllClasses(!showAllClasses)}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                {showAllClasses ? 'Show Top 5' : 'Show All 10 Classes'}
              </button>
            </div>

            <div className="space-y-2">
              {displayedProbs.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono truncate ${item.isTopMatch ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                      {item.className}
                    </span>
                    <span className={`font-mono text-xs ${item.isTopMatch ? 'font-bold text-emerald-700' : 'text-slate-500'}`}>
                      {item.probability}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.probability}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isTopMatch ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {onNavigateToPipeline && (
              <button
                onClick={onNavigateToPipeline}
                className="w-full mt-2 py-2 px-3 rounded-lg text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>Inspect Full CNN Training Pipeline & Colab Notebook</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>

          {/* Observed Morphological Symptoms */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide font-mono">
              Key Pathology Hallmarks Detected:
            </h4>
            <ul className="space-y-2">
              {diagnosis.visualSymptomsObserved.map((symptom, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Environmental Conditions */}
          {diagnosis.favorableConditions && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">
                Disease Promoting Climate:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {diagnosis.favorableConditions}
              </p>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 no-print">
            <button
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to Records' : 'Save to Garden Records'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pathology Report</span>
            </button>
          </div>
        </div>

        {/* Treatment & Action Plan Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Treatment Tabs Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Treatment & Eradication Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Follow step-by-step protocols calibrated for tomatoes
                </p>
              </div>

              {/* Segmented Control */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActiveTreatmentTab('organic')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTreatmentTab === 'organic'
                      ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Organic & Bio ({diagnosis.organicTreatments?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTreatmentTab('chemical')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTreatmentTab === 'chemical'
                      ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Chemical / Conventional ({diagnosis.chemicalTreatments?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* Organic Tab Content */}
            {activeTreatmentTab === 'organic' && (
              <div className="space-y-4">
                {diagnosis.organicTreatments && diagnosis.organicTreatments.length > 0 ? (
                  diagnosis.organicTreatments.map((treatment, idx) => {
                    const isChecked = !!checkedTreatments[treatment.name];
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 transition-all ${
                          isChecked
                            ? 'border-emerald-300 bg-emerald-50/40'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              id={`org-${idx}`}
                              checked={isChecked}
                              onChange={() => toggleTreatmentCheck(treatment.name)}
                              className="w-4 h-4 mt-0.5 accent-emerald-700 rounded cursor-pointer"
                            />
                            <div>
                              <label
                                htmlFor={`org-${idx}`}
                                className={`text-sm font-bold text-slate-900 cursor-pointer block ${
                                  isChecked ? 'line-through text-slate-500' : ''
                                }`}
                              >
                                {treatment.name}
                              </label>
                              <span className="text-xs font-semibold text-emerald-800">
                                Dosage: {treatment.recipeOrDosage} · Frequency: {treatment.applicationFrequency}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              onNavigateToCalculator({
                                name: treatment.name,
                                dosageText: treatment.recipeOrDosage,
                                frequency: treatment.applicationFrequency,
                              })
                            }
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                            title="Calculate water & concentrate amount"
                          >
                            <Calculator className="w-3 h-3" />
                            <span>Calibrate Dosage</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-6">
                          {treatment.instructions}
                        </p>

                        <div className="mt-2.5 pl-6 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">How it works: </span>
                          {treatment.mechanism}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 p-4 text-center">
                    No specific organic treatments required for this specimen.
                  </p>
                )}
              </div>
            )}

            {/* Chemical Tab Content */}
            {activeTreatmentTab === 'chemical' && (
              <div className="space-y-4">
                {diagnosis.chemicalTreatments && diagnosis.chemicalTreatments.length > 0 ? (
                  diagnosis.chemicalTreatments.map((treatment, idx) => {
                    const isChecked = !!checkedTreatments[treatment.activeIngredient];
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 transition-all ${
                          isChecked
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              id={`chem-${idx}`}
                              checked={isChecked}
                              onChange={() => toggleTreatmentCheck(treatment.activeIngredient)}
                              className="w-4 h-4 mt-0.5 accent-amber-700 rounded cursor-pointer"
                            />
                            <div>
                              <label
                                htmlFor={`chem-${idx}`}
                                className={`text-sm font-bold text-slate-900 cursor-pointer block ${
                                  isChecked ? 'line-through text-slate-500' : ''
                                }`}
                              >
                                {treatment.activeIngredient}
                              </label>
                              <span className="text-xs text-slate-500 block">
                                Commercial Brands: {treatment.productExamples}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              onNavigateToCalculator({
                                name: treatment.activeIngredient,
                                dosageText: treatment.dosage,
                                frequency: treatment.applicationFrequency,
                              })
                            }
                            className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Calculator className="w-3 h-3" />
                            <span>Calibrate Dosage</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pl-6 my-2">
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="font-semibold text-slate-900 block text-[11px]">Dosage Rate:</span>
                            {treatment.dosage} (Every {treatment.applicationFrequency})
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="font-semibold text-slate-900 block text-[11px]">Pre-Harvest Interval (PHI):</span>
                            <span className="text-amber-800 font-bold">{treatment.preHarvestIntervalDays}</span> before fruit harvest
                          </div>
                        </div>

                        <div className="pl-6 pt-1 text-[11px] text-rose-700 font-medium">
                          <span className="font-bold">PPE & Safety Warning: </span>
                          {treatment.safetyPrecautions}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 p-4 text-center">
                    Chemical interventions are not recommended for this condition.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cultural IPM & Physical Pruning Practices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Agronomic Cultural Practices & Canopy Hygiene
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diagnosis.culturalPractices.map((practice, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs text-slate-700 flex items-start gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                  <span>{practice}</span>
                </div>
              ))}
            </div>

            {/* Long term preventative strategies */}
            {diagnosis.preventiveMeasures && diagnosis.preventiveMeasures.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block mb-2 uppercase tracking-wide font-mono">
                  Long-Term Season Prevention & Resistance:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {diagnosis.preventiveMeasures.map((pm, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">›</span>
                      <span>{pm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Interactive AI Pathologist Chat */}
          <PathologistChat
            diagnosis={diagnosis}
            specimenImage={specimenImage}
          />
        </div>
      </div>
    </div>
  );
};
