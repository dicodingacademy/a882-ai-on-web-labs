import {
  APP_CONFIG,
  UI_CONFIG,
  CAMERA_CONFIG,
  TENSORFLOW_CONFIG,
  TRANSFORMERS_CONFIG,
  PERFORMANCE_CONFIG
} from './config.js';

export const isMobileDevice = () => {
  return navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const getCameraConfig = () => {
  const mobile = isMobileDevice();
  return {
    defaultFPS: CAMERA_CONFIG.defaultFPS,
    fpsRange: CAMERA_CONFIG.fpsRange,
    resolution: mobile
      ? CAMERA_CONFIG.mobileResolution
      : CAMERA_CONFIG.desktopResolution,
    facingMode: mobile
      ? CAMERA_CONFIG.mobileFacingMode
      : CAMERA_CONFIG.desktopFacingMode
  };
};

export const createDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const isValidDetection = (result) => {
  const { detectionConfidenceThreshold } = APP_CONFIG;
  return result && result.isValid && result.confidence >= detectionConfidenceThreshold;
};

export const validateModelMetadata = (metadata) => {
  return metadata && metadata.labels && Array.isArray(metadata.labels);
};

export const getConfidenceTheme = (confidence) => {
  const { excellent, good } = UI_CONFIG.confidenceThresholds;
  if (confidence >= excellent) return 'green';
  if (confidence >= good) return 'yellow';
  return 'red';
};

export const getConfidenceTextClass = (confidence) => {
  const theme = getConfidenceTheme(confidence);
  return `text-${theme}`;
};

export const getConfidenceCardClass = (confidence) => {
  const theme = getConfidenceTheme(confidence);
  return `theme-${theme}`;
};

export const getCameraConstraints = (selectedCameraId) => {
  const config = getCameraConfig();
  return {
    video: {
      deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
      width: { ideal: config.resolution.width },
      height: { ideal: config.resolution.height },
      facingMode: config.facingMode,
      frameRate: { ideal: config.defaultFPS }
    }
  };
};

export const getCameraErrorMessage = (error) => {
  if (error.name === 'NotAllowedError') {
    return 'Izin kamera ditolak. Harap izinkan akses kamera.';
  } else if (error.name === 'NotFoundError') {
    return 'Tidak ada kamera ditemukan pada perangkat ini.';
  } else if (error.name === 'NotReadableError') {
    return 'Kamera sedang digunakan oleh aplikasi lain.';
  }
  return 'Gagal memulai kamera';
};

export const addFadeInAnimation = (element) => {
  if (!element) return;

  const { fadeAnimation } = UI_CONFIG;
  element.style.animation = 'none';
  void element.offsetWidth; // trigger reflow
  element.style.animation = fadeAnimation;
};

export const addScaleAnimation = (element, callback) => {
  if (!element) return;

  const { animationDuration } = UI_CONFIG;
  element.style.transform = 'scale(1.02)';
  element.style.transition = `transform ${animationDuration}ms ease`;

  setTimeout(() => {
    if (element) {
      element.style.transform = 'scale(1)';
    }
    if (callback) {
      callback();
    }
  }, animationDuration);
};

export const isWebGPUSupported = () => {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
};

export const getOptimalBackend = (preferredBackend) => {
  if (preferredBackend === 'webgpu' && !isWebGPUSupported()) {
    console.warn('WebGPU tidak didukung, beralih ke fallback');
    return 'webgl';
  }
  return preferredBackend;
};

export const configureTransformersBackend = (env, backend) => {
  try {
    if (backend === 'webgpu' && 'gpu' in navigator) {
      env.backends.onnx.webgpu = true;
      console.log('WebGPU backend untuk Transformers.js');
      return 'WebGPU';
    } else {
      env.backends.onnx.webgpu = false;
      env.backends.onnx.wasm.numThreads = navigator.hardwareConcurrency || 4;
      console.log('WebAssembly backend untuk Transformers.js');
      return 'WebAssembly';
    }
  } catch (error) {
    console.warn('Menggunakan backend default Transformers.js');
    return 'Default';
  }
};

export const updatePerformanceStats = (stats, operationTime) => {
  stats.operations++;
  stats.totalTime += operationTime;
  stats.averageTime = stats.totalTime / stats.operations;
  return stats;
};

export const logPerformance = (backend, operationTime, averageTime) => {
  console.log(`⚡ ${backend.toUpperCase()}: ${Math.round(operationTime)}ms (avg: ${Math.round(averageTime)}ms)`);
};

export const createPerformanceResult = (operationTime, backend, averageTime, totalOperations) => ({
  operationTime: Math.round(operationTime),
  backend: backend,
  averageTime: Math.round(averageTime),
  totalOperations: totalOperations
});

export const hideElement = (element) => {
  if (element) element.classList.add('hidden');
};

export const showElement = (element) => {
  if (element) element.classList.remove('hidden');
};

export const setElementOpacity = (element, opacity) => {
  if (element) element.style.opacity = opacity;
};

export const setElementText = (element, text) => {
  if (element) element.textContent = text;
};

export const setElementHTML = (element, html) => {
  if (element) element.innerHTML = html;
};

export const logError = (context, error) => {
  console.error(`❌ ${context}:`, error);
};

export {
  APP_CONFIG,
  TENSORFLOW_CONFIG,
  TRANSFORMERS_CONFIG,
  UI_CONFIG,
  PERFORMANCE_CONFIG
};