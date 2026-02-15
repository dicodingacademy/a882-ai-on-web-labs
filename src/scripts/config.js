const APP_CONFIG = {
  detectionConfidenceThreshold: 70,
  analyzingDelay: 2000,
  nutritionGenerationDelay: 2000,
  detectionRetryInterval: 100,
};

const TENSORFLOW_CONFIG = {
  modelPath: '../model/model.json',
  metadataPath: '../model/metadata.json',
  inputSize: [224, 224],
  normalizationFactor: 255.0,
  confidenceThreshold: 0.7,
};

const TRANSFORMERS_CONFIG = {
  modelName: 'Xenova/LaMini-Flan-T5-77M',
  maxTokens: 80,
  temperature: 0.3,
  topP: 0.8,
  generationDelay: 500,
};

const UI_CONFIG = {
  animationDuration: 300,
  fadeAnimation: 'fadeIn 0.5s ease-out forwards',
  confidenceThresholds: {
    excellent: 90,
    good: 80,
  },
  nutritionCardOpacity: {
    loading: 0.6,
    normal: 1.0,
  },
};

const CAMERA_CONFIG = {
  defaultFPS: 30,
  fpsRange: { min: 15, max: 60 },
  desktopResolution: { width: 640, height: 480 },
  mobileResolution: { width: 480, height: 640 },
  desktopFacingMode: 'user',
  mobileFacingMode: 'environment',
};

/**
 * @review
 * ENDPOINTS ini tidak digunakan di mana pun dalam codebase.
 * NutritionService menggunakan pipeline dari @huggingface/transformers yang berjalan lokal,
 * tidak memanggil API endpoint.
 *
 * Dead code seperti ini bisa membingungkan siswa dan sebaiknya dihapus.
 */
const ENDPOINTS = {
  NUTRITION_API: 'https://api.example.com/nutrition',
};

export { APP_CONFIG, TENSORFLOW_CONFIG, TRANSFORMERS_CONFIG, UI_CONFIG, CAMERA_CONFIG, ENDPOINTS };

export default {
  APP_CONFIG,
  TENSORFLOW_CONFIG,
  TRANSFORMERS_CONFIG,
  UI_CONFIG,
  CAMERA_CONFIG,
  ENDPOINTS,
};
