import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  Split,
  BarChart3,
  Terminal,
  Server,
  Upload,
  Sparkles,
  ShieldCheck,
  Code2,
  Download,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Flame,
  ArrowRight,
  Eye,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  PLANTVILLAGE_TOMATO_CLASSES,
  CNN_EPOCHS_TRAINING_DATA,
  CNN_CONFUSION_MATRIX,
  generateGoogleColabCode,
  FLASK_APP_CODE,
  FLASK_REQUIREMENTS
} from '../data/cnnPipelineData';
import { SAMPLE_LEAVES } from '../data/sampleLeaves';

interface CnnPipelineExplorerProps {
  onNavigateToScan: () => void;
  onSelectSampleForScan: (sampleId: string) => void;
}

export const CnnPipelineExplorer: React.FC<CnnPipelineExplorerProps> = ({
  onNavigateToScan,
  onSelectSampleForScan,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [colabFramework, setColabFramework] = useState<'tensorflow' | 'pytorch'>('tensorflow');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('Tomato___Early_blight');
  const [selectedArch, setSelectedArch] = useState<'mobilenet' | 'resnet' | 'custom'>('mobilenet');
  const [preprocessFilter, setPreprocessFilter] = useState<'raw' | 'resized' | 'normalized' | 'augmented'>('raw');
  const [classFilter, setClassFilter] = useState<'All' | 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Healthy'>('All');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const downloadColabNotebook = () => {
    const code = generateGoogleColabCode(colabFramework);
    // Create standard Jupyter Notebook structure (.ipynb)
    const notebook = {
      cells: [
        {
          cell_type: 'markdown',
          metadata: {},
          source: [
            '# Tomato Leaf Disease Classification using PlantVillage Dataset & CNN\\n',
            'This notebook trains a deep learning transfer learning model on 10 tomato leaf classes from the PlantVillage dataset.\\n',
            'Exported from **TomatoGuard AI**.'
          ]
        },
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: code.split('\n').map(line => line + '\n')
        }
      ],
      metadata: {
        accelerator: 'GPU',
        colab: {
          gpuType: 'T4',
          provenance: []
        },
        language_info: {
          name: 'python',
          version: '3.10'
        }
      },
      nbformat: 4,
      nbformat_minor: 0
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tomatoguard_plantvillage_cnn_${colabFramework}.ipynb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const steps = [
    { num: 1, title: 'PlantVillage Dataset', icon: Database, desc: '10 Solanum classes, 18,160+ images' },
    { num: 2, title: 'Data Preprocessing', icon: RefreshCw, desc: '224x224 RGB, normalization, augmentations' },
    { num: 3, title: 'Train / Val / Test Split', icon: Split, desc: '70% / 15% / 15% stratified split' },
    { num: 4, title: 'CNN Architecture', icon: Layers, desc: 'Transfer learning with MobileNetV2 / ResNet-50' },
    { num: 5, title: 'Colab Training', icon: Terminal, desc: 'Google Colab GPU pipeline & notebook' },
    { num: 6, title: 'Model Evaluation', icon: BarChart3, desc: 'Confusion matrix & 97.4% test accuracy' },
    { num: 7, title: 'Flask Web App', icon: Server, desc: 'Python REST API & inference server' },
    { num: 8, title: 'Upload Leaf Image', icon: Upload, desc: 'Field capture & image preprocessing' },
    { num: 9, title: 'Disease Prediction', icon: Sparkles, desc: 'Softmax probabilities & Grad-CAM mapping' },
    { num: 10, title: 'Cure & Agronomy', icon: ShieldCheck, desc: 'Integrated pest management & remedies' },
  ];

  const filteredClasses = classFilter === 'All'
    ? PLANTVILLAGE_TOMATO_CLASSES
    : PLANTVILLAGE_TOMATO_CLASSES.filter(c => c.category === classFilter);

  const selectedClassInfo = PLANTVILLAGE_TOMATO_CLASSES.find(c => c.id === selectedClassId) || PLANTVILLAGE_TOMATO_CLASSES[1];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Deep Learning Methodology & End-to-End Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              PlantVillage CNN Disease Classification Architecture
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore the exact academic and production pipeline: from raw PlantVillage leaf images,
              preprocessing, and Google Colab GPU training, to CNN Transfer Learning, evaluation metrics,
              and full Flask web app deployment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={downloadColabNotebook}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Colab .ipynb</span>
            </button>
            <button
              onClick={onNavigateToScan}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Test Live Inference</span>
            </button>
          </div>
        </div>

        {/* 10-Step Interactive Flowchart Ribbon */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-3">
            Click any step to inspect technical details:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{s.num}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block truncate leading-tight ${
                      isActive ? 'text-emerald-950' : 'text-slate-800'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Detailed Step View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Step 1: PlantVillage Dataset */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>STEP 1 OF 10: BENCHMARK DATASET</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  PlantVillage Tomato Dataset (18,160+ Images)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  The internationally recognized open-access agricultural benchmark for computer vision leaf pathology
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                {(['All', 'Fungal', 'Bacterial', 'Viral', 'Pest', 'Healthy'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setClassFilter(cat)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      classFilter === cat ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((item) => {
                const isSelected = selectedClassId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedClassId(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 block truncate">
                          {item.className}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.displayName}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        item.category === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.category === 'Viral'
                          ? 'bg-purple-100 text-purple-800'
                          : item.category === 'Bacterial'
                          ? 'bg-amber-100 text-amber-800'
                          : item.category === 'Pest'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-600 py-2 border-y border-slate-100 my-2">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Samples:</span>
                        <span className="font-bold text-slate-900">{item.imageCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">CNN Test Acc:</span>
                        <span className="font-bold text-emerald-700">{item.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">F1-Score:</span>
                        <span className="font-bold text-slate-900">{item.f1Score}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.symptoms[0]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Class Deep Dive */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Selected Class Details: {selectedClassInfo.displayName} ({selectedClassInfo.scientificName})
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  PlantVillage Folder: {selectedClassInfo.className}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wide block font-mono text-[11px]">
                    Morphological Hallmarks:
                  </span>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {selectedClassInfo.symptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-800 uppercase tracking-wide block font-mono text-[11px]">
                    Prescribed Cures in Dataset Protocol:
                  </span>
                  <p className="text-emerald-800">
                    <strong className="text-slate-700">Organic: </strong>{selectedClassInfo.organicCure}
                  </p>
                  <p className="text-amber-800">
                    <strong className="text-slate-700">Chemical: </strong>{selectedClassInfo.chemicalCure}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Data Preprocessing */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                <RefreshCw className="w-4 h-4" />
                <span>STEP 2 OF 10: DATA PREPROCESSING & AUGMENTATION</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Image Normalization & Tensor Resizing Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardizing heterogeneous agricultural field captures into uniform 224x224x3 RGB tensors with data augmentation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Visualizer */}
              <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Interactive Tensor Preprocessing Preview
                  </span>
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-mono">
                    <button
                      onClick={() => setPreprocessFilter('raw')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${preprocessFilter === 'raw' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Raw Input
                    </button>
                    <button
                      onClick={() => setPreprocessFilter('resized')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${preprocessFilter === 'resized' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      224x224 Resized
                    </button>
                    <button
                      onClick={() => setPreprocessFilter('normalized')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${preprocessFilter === 'normalized' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Normalized Tensor
                    </button>
                    <button
                      onClick={() => setPreprocessFilter('augmented')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${preprocessFilter === 'augmented' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Augmentation
                    </button>
                  </div>
                </div>

                <div className="relative aspect-square max-w-sm mx-auto rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                  <img
                    src={SAMPLE_LEAVES[0].imageUrl}
                    alt="Sample leaf for preprocessing"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      preprocessFilter === 'resized'
                        ? 'pixelated scale-95'
                        : preprocessFilter === 'normalized'
                        ? 'contrast-150 saturate-150 hue-rotate-15'
                        : preprocessFilter === 'augmented'
                        ? 'scale-110 -rotate-12 brightness-110 contrast-125'
                        : ''
                    }`}
                  />
                  {preprocessFilter === 'normalized' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-emerald-900/20 to-purple-900/30 mix-blend-color-dodge pointer-events-none" />
                  )}
                  {preprocessFilter === 'augmented' && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      Flip + Rot 15° + Jitter
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-emerald-300">
                    Shape: (224, 224, 3) | Dtype: float32
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {preprocessFilter === 'raw' && 'Original image dimensions variable (e.g. 256x256 or 4000x3000 from mobile cameras). Standardized before CNN entry.'}
                  {preprocessFilter === 'resized' && 'Bilinear interpolation to 224x224 pixels matching MobileNetV2 / ResNet50 receptive field dimensions.'}
                  {preprocessFilter === 'normalized' && 'Zero-centered normalization: (pixel - mean) / std for ImageNet weights: mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225].'}
                  {preprocessFilter === 'augmented' && 'Stochastic augmentations applied per epoch: RandomHorizontalFlip, RandomRotation(15°), ColorJitter(brightness=0.1, contrast=0.1) to suppress overfitting.'}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="lg:col-span-5 space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
                    Preprocessing Checklist:
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Input Tensor:</strong> Fixed 224 × 224 × 3 dimensions</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Color Space:</strong> sRGB (3 channels) normalized to [-1.0, 1.0]</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Data Augmentation:</strong> Random 90° flip, rotation, random zoom, brightness jitter</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Batch Pipeline:</strong> tf.data.AUTOTUNE with prefetch buffer to maximize GPU saturation</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-[11px] overflow-x-auto">
                  <span className="text-slate-400 block mb-1"># Python Preprocessing Code</span>
                  <code>{`data_augmentation = tf.keras.Sequential([
  layers.RandomFlip("horizontal_and_vertical"),
  layers.RandomRotation(0.15),
  layers.RandomZoom(0.1),
  layers.RandomContrast(0.1),
])`}</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Train / Val / Test Split */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                <Split className="w-4 h-4" />
                <span>STEP 3 OF 10: TRAIN / VALIDATION / TEST SPLIT</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Stratified Partitioning (70% Train / 15% Val / 15% Test)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Guaranteeing balanced class distributions across subsets to eliminate data leakage and model bias
              </p>
            </div>

            {/* Split Visualization Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-800">Total Dataset: 18,160 Images</span>
                <span className="text-slate-500">Seed: 42 (Reproducible Split)</span>
              </div>

              <div className="h-8 rounded-xl overflow-hidden flex text-xs font-bold font-mono text-white">
                <div style={{ width: '70%' }} className="bg-emerald-600 flex items-center justify-center px-2">
                  Training Set: 70% (~12,712 images)
                </div>
                <div style={{ width: '15%' }} className="bg-blue-600 flex items-center justify-center px-2">
                  Val: 15% (~2,724)
                </div>
                <div style={{ width: '15%' }} className="bg-amber-600 flex items-center justify-center px-2">
                  Test: 15% (~2,724)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-900 uppercase font-mono">Training Set (70%)</span>
                    <span className="text-xs font-mono font-bold text-emerald-700">12,712</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Used to optimize CNN convolutional kernel weights and dense classification layers via backpropagation.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-900 uppercase font-mono">Validation Set (15%)</span>
                    <span className="text-xs font-mono font-bold text-blue-700">2,724</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Used after every training epoch to monitor validation loss, trigger EarlyStopping, and adjust learning rate.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-900 uppercase font-mono">Holdout Test Set (15%)</span>
                    <span className="text-xs font-mono font-bold text-amber-700">2,724</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Strictly untouched during training. Evaluated only once to compute final confusion matrix and precision/recall.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: CNN / Transfer Learning Architecture */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>STEP 4 OF 10: DEEP LEARNING MODEL ARCHITECTURE</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  CNN Transfer Learning Backbone Comparison
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Leveraging ImageNet pre-trained feature extractors with custom classification heads for tomato foliar diseases
                </p>
              </div>

              {/* Architecture Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setSelectedArch('mobilenet')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${selectedArch === 'mobilenet' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : 'text-slate-600'}`}
                >
                  MobileNetV2 (Recommended)
                </button>
                <button
                  onClick={() => setSelectedArch('resnet')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${selectedArch === 'resnet' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'}`}
                >
                  ResNet-50
                </button>
                <button
                  onClick={() => setSelectedArch('custom')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${selectedArch === 'custom' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'}`}
                >
                  Custom Conv2D CNN
                </button>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {selectedArch === 'mobilenet' && 'MobileNetV2: Depthwise Separable Convolutions & Inverted Residuals'}
                    {selectedArch === 'resnet' && 'ResNet-50: Deep Residual Networks with Identity Skip Connections'}
                    {selectedArch === 'custom' && 'Custom 5-Layer Conv2D CNN: Baseline Sequential Architecture'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedArch === 'mobilenet' && 'Ideal for mobile and web deployment. Drastically cuts computation (only 3.5M parameters) while retaining 97.4% test accuracy on PlantVillage leaf spots.'}
                    {selectedArch === 'resnet' && 'Deeper 50-layer architecture solving vanishing gradients with skip connections. Exceptional feature representations for subtle fungal lesions.'}
                    {selectedArch === 'custom' && 'Standard sequential convolutional network built from scratch (Conv2D -> BatchNorm -> ReLU -> MaxPool -> Dropout -> Dense). Good baseline for educational exploration.'}
                  </p>
                </div>

                {/* Layer Pipeline Diagram */}
                <div className="space-y-2 text-xs font-mono">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                    Forward Pass Layer Stack:
                  </span>
                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">1. InputLayer</span>
                      <span className="text-slate-500">Shape: (None, 224, 224, 3)</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-emerald-900">
                      <span className="font-bold">2. Pretrained Feature Extractor ({selectedArch === 'mobilenet' ? 'MobileNetV2' : selectedArch === 'resnet' ? 'ResNet50' : 'Conv2D Stack'})</span>
                      <span className="text-emerald-700">Weights: ImageNet (Frozen Phase 1)</span>
                    </div>
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">3. GlobalAveragePooling2D</span>
                      <span className="text-slate-500">Output: (None, 1280)</span>
                    </div>
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">4. Dense(256, activation='relu') + BatchNorm</span>
                      <span className="text-slate-500">Latent Feature Space</span>
                    </div>
                    <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">5. Dropout(0.4)</span>
                      <span className="text-slate-500">Regularization (Prevents Overfitting)</span>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-amber-900 font-bold">
                      <span>6. Dense(10, activation='softmax')</span>
                      <span>Output: 10 PlantVillage Class Probabilities</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
                <span className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wide block">
                  Model Architecture Metrics
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">Parameters</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      {selectedArch === 'mobilenet' ? '3.5 Million' : selectedArch === 'resnet' ? '25.6 Million' : '4.2 Million'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">Inference Latency</span>
                    <span className="text-lg font-bold text-emerald-700 font-mono">
                      {selectedArch === 'mobilenet' ? '~38 ms' : selectedArch === 'resnet' ? '~92 ms' : '~45 ms'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">PlantVillage Acc</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      {selectedArch === 'mobilenet' ? '97.4%' : selectedArch === 'resnet' ? '98.1%' : '92.3%'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px]">Model File Size</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      {selectedArch === 'mobilenet' ? '14.2 MB' : selectedArch === 'resnet' ? '98.4 MB' : '16.8 MB'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
                  <strong>Recommendation: </strong> MobileNetV2 provides optimal trade-off for agricultural web applications, delivering instant edge diagnostics in under 50ms without server GPU strain.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Model Training on Google Colab */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                  <Terminal className="w-4 h-4" />
                  <span>STEP 5 OF 10: MODEL TRAINING ON GOOGLE COLAB</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Ready-to-Run Google Colab Python Training Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete Python script with Kaggle dataset downloader, GPU acceleration, Adam optimizer, and model export
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setColabFramework(colabFramework === 'tensorflow' ? 'pytorch' : 'tensorflow')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono font-semibold text-slate-700 cursor-pointer"
                >
                  Framework: {colabFramework === 'tensorflow' ? 'TensorFlow/Keras' : 'PyTorch'}
                </button>
                <button
                  onClick={() => copyToClipboard(generateGoogleColabCode(colabFramework), 'colab')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedCode === 'colab' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'colab' ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={downloadColabNotebook}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ipynb</span>
                </button>
              </div>
            </div>

            {/* Code Viewer Box */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  plantvillage_tomato_cnn_training.py ({colabFramework})
                </span>
                <span>Hardware: Google Colab T4 GPU</span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {generateGoogleColabCode(colabFramework)}
              </pre>
            </div>
          </div>
        )}

        {/* Step 6: Model Evaluation */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                <BarChart3 className="w-4 h-4" />
                <span>STEP 6 OF 10: MODEL EVALUATION & BENCHMARKS</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                97.4% Test Accuracy & 10x10 Confusion Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation across the holdout PlantVillage test set (2,724 images) with training vs validation loss curves
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Training Epoch Curve */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Epoch Loss & Accuracy Progression (20 Epochs)</span>
                  <span className="text-xs font-mono text-emerald-700">Val Acc: 97.4%</span>
                </h3>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-1">
                    <span>Epoch</span>
                    <span>Train Loss</span>
                    <span>Val Loss</span>
                    <span>Train Acc</span>
                    <span>Val Acc</span>
                  </div>
                  {CNN_EPOCHS_TRAINING_DATA.slice(0, 10).map((ep) => (
                    <div key={ep.epoch} className="flex items-center justify-between py-0.5 text-slate-700">
                      <span className="font-bold text-slate-900">Epoch {ep.epoch}</span>
                      <span>{ep.trainLoss.toFixed(2)}</span>
                      <span className="text-blue-600">{ep.valLoss.toFixed(2)}</span>
                      <span>{ep.trainAcc.toFixed(1)}%</span>
                      <span className="font-bold text-emerald-700">{ep.valAcc.toFixed(1)}%</span>
                    </div>
                  ))}
                  <div className="pt-2 text-[10px] text-slate-500 text-center border-t border-slate-200">
                    ...Epochs 11-20 converged with EarlyStopping restoration
                  </div>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Confusion Matrix (Normalized True vs Predicted %)
                </h3>

                <div className="overflow-x-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <table className="w-full text-[10px] font-mono border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200">
                        <th className="p-1 text-left">Class</th>
                        {CNN_CONFUSION_MATRIX.classes.map((c, i) => (
                          <th key={i} className="p-1 text-center" title={c}>{c.slice(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CNN_CONFUSION_MATRIX.classes.map((rowName, rIdx) => (
                        <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-100/50">
                          <td className="p-1 font-bold text-slate-800 whitespace-nowrap">{rowName}</td>
                          {CNN_CONFUSION_MATRIX.matrix[rIdx].map((val, cIdx) => {
                            const isDiagonal = rIdx === cIdx;
                            return (
                              <td
                                key={cIdx}
                                className={`p-1 text-center ${
                                  isDiagonal
                                    ? 'bg-emerald-600 text-white font-bold rounded'
                                    : val > 1
                                    ? 'bg-rose-100 text-rose-800 font-semibold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {val.toFixed(1)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <span className="text-[10px] text-slate-500 block mt-2 text-right">
                    *Diagonal represents correct classifications (Recall)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Flask Web Application */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                  <Server className="w-4 h-4" />
                  <span>STEP 7 OF 10: FLASK WEB APPLICATION & INFERENCE SERVER</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Python Flask REST API Server (app.py)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hosts the trained <code className="bg-slate-100 px-1 rounded">tomato_model.h5</code> model with POST /api/predict inference endpoint
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(FLASK_APP_CODE, 'flask')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedCode === 'flask' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'flask' ? 'Copied app.py!' : 'Copy app.py'}</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  app.py (Flask Web Application)
                </span>
                <span>Port 5000 / Gunicorn Ready</span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {FLASK_APP_CODE}
              </pre>
            </div>
          </div>
        )}

        {/* Step 8, 9, 10: Upload, Prediction & Cure Linkage */}
        {(activeStep === 8 || activeStep === 9 || activeStep === 10) && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>STEP {activeStep} OF 10: {activeStep === 8 ? 'IMAGE UPLOAD' : activeStep === 9 ? 'CNN DISEASE PREDICTION' : 'CURE & TREATMENT PROTOCOL'}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activeStep === 8 && 'Leaf Specimen Capture & Input Processing'}
                {activeStep === 9 && 'CNN Feature Activation & Top-K Softmax Inference'}
                {activeStep === 10 && 'Prescribed Organic & Chemical Treatment Delivery'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeStep === 8 && 'Directly connected to our live camera module and file upload interface.'}
                {activeStep === 9 && 'Model runs forward pass yielding class probability vector and Grad-CAM attention heatmap.'}
                {activeStep === 10 && 'Direct linkage to dosage calculations, active ingredients, and IPM sanitation.'}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Execute This Methodology On Real Leaf Images
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can test this exact 10-step methodology right now in the <strong>Scan & Diagnose</strong> tab!
                Upload your leaf or select any PlantVillage benchmark specimen to view the CNN classification distribution,
                interactive Grad-CAM activation heatmap, and custom cure protocols.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onNavigateToScan}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Go to Scan & Diagnose Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
