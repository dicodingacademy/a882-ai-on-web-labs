export const APP_CONFIG = {
  detectionConfidenceThreshold: 70,
  analyzingDelay: 2000,
  nutritionGenerationDelay: 2000,
  detectionRetryInterval: 100
};

export const TENSORFLOW_CONFIG = {
  modelPath: '/model/model.json',
  metadataPath: '/model/metadata.json',
  inputSize: [224, 224],
  normalizationFactor: 255.0,
  confidenceThreshold: 0.7,
};

export const TRANSFORMERS_CONFIG = {
  modelName: 'Xenova/LaMini-Flan-T5-77M',
  maxTokens: 80,
  temperature: 0.3,
  topP: 0.8,
  generationDelay: 500,
};

/**
 * @review
 * UI_CONFIG dan CAMERA_CONFIG diekspor di sini tapi tidak di-import di mana pun.
 *
 * - UI_CONFIG.confidenceThresholds: tidak dipakai oleh ui.js (yang justru hardcode threshold sendiri)
 * - UI_CONFIG.animationDuration, fadeAnimation, nutritionCardOpacity: tidak dipakai sama sekali
 * - CAMERA_CONFIG: tidak dipakai. common.js punya getCameraConfig() yang hardcode nilai yang sama
 *
 * Ini dead code. Keberadaannya menyesatkan karena memberi kesan bahwa
 * ada satu sumber konfigurasi yang terpusat, padahal kenyataannya
 * masing-masing file mendefinisikan nilainya sendiri.
 *
 * Sebaiknya: hapus yang tidak dipakai, atau refactor agar common.js dan ui.js
 * benar-benar import dan gunakan nilai dari config ini.
 */
export const UI_CONFIG = {
  animationDuration: 300,
  fadeAnimation: 'fadeIn 0.5s ease-out forwards',
  confidenceThresholds: {
    excellent: 90,
    good: 80
  },
  nutritionCardOpacity: {
    loading: 0.6,
    normal: 1.0
  }
};

export const CAMERA_CONFIG = {
  defaultFPS: 30,
  fpsRange: { min: 15, max: 60 },
  desktopResolution: { width: 640, height: 480 },
  mobileResolution: { width: 480, height: 640 },
  desktopFacingMode: 'user',
  mobileFacingMode: 'environment'
};

export const isValidDetection = (result) => {
  const { detectionConfidenceThreshold } = APP_CONFIG;
  return result && result.isValid && result.confidence >= detectionConfidenceThreshold;
};