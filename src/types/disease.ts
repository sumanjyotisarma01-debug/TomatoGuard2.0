export type SeverityLevel = 'Healthy' | 'Low' | 'Moderate' | 'Severe' | 'Critical';
export type PathogenCategory = 'Fungal' | 'Bacterial' | 'Viral' | 'Physiological/Abiotic' | 'Pest' | 'None';

export interface OrganicTreatment {
  name: string;
  recipeOrDosage: string;
  applicationFrequency: string;
  instructions: string;
  mechanism: string;
}

export interface ChemicalTreatment {
  activeIngredient: string;
  productExamples: string;
  dosage: string;
  applicationFrequency: string;
  preHarvestIntervalDays: string;
  safetyPrecautions: string;
}

export interface CnnClassProbability {
  classId: string;
  className: string;
  probability: number; // 0 to 100
  isTopMatch: boolean;
}

export interface GradCamHotspot {
  x: number; // 0 to 1 percentage
  y: number; // 0 to 1 percentage
  radius: number; // 0 to 1 percentage
  intensity: number; // 0 to 1
  label?: string;
}

export interface CnnInferenceMetadata {
  modelArchitecture: 'MobileNetV2' | 'ResNet50' | 'Custom Conv2D CNN';
  inputResolution: string;
  datasetName: string;
  plantVillageClass: string;
  inferenceLatencyMs: number;
  topProbabilities: CnnClassProbability[];
  gradCamHotspots: GradCamHotspot[];
  featureActivationStrength: 'High' | 'Very High' | 'Moderate';
}

export interface TomatoDiagnosis {
  isTomatoPlant: boolean;
  plantPart: string;
  condition: string;
  scientificName: string;
  confidence: number;
  severity: SeverityLevel;
  urgency: string;
  pathogenType: PathogenCategory;
  summary: string;
  visualSymptomsObserved: string[];
  organicTreatments: OrganicTreatment[];
  chemicalTreatments: ChemicalTreatment[];
  culturalPractices: string[];
  preventiveMeasures: string[];
  favorableConditions: string;
  spreadRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  // CNN & PlantVillage telemetry
  plantVillageClass?: string;
  cnnMetadata?: CnnInferenceMetadata;
}

export interface DiagnosisRecord {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  diagnosis: TomatoDiagnosis;
  notes?: string;
  treatmentStatus: 'monitoring' | 'in_progress' | 'resolved';
  checkedRemedies?: string[];
}

export interface EncyclopediaDisease {
  id: string;
  name: string;
  scientificName: string;
  category: PathogenCategory;
  commonSymptoms: string[];
  causes: string;
  typicalOnset: string;
  organicRemedy: string;
  chemicalOption: string;
  prevention: string;
  severityGrade: SeverityLevel;
  sampleImageUrl?: string;
}
