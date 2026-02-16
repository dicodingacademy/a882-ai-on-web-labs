export const logError = (context, error) => {
  console.error(`❌ ${context}:`, error);
};

export const createPerformanceStats = () => ({
  operations: 0,
  totalTime: 0,
  averageTime: 0
});

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

export const isWebGPUSupported = () => {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
};

export const isMobileDevice = () => {
  return navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const createDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const validateModelMetadata = (metadata) => {
  return metadata && metadata.labels && Array.isArray(metadata.labels);
};

export const getCameraErrorMessage = (error) => {
  const errorMessages = {
    'NotAllowedError': 'Izin kamera ditolak. Harap izinkan akses kamera.',
    'NotFoundError': 'Tidak ada kamera ditemukan pada perangkat ini.',
    'NotReadableError': 'Kamera sedang digunakan oleh aplikasi lain.'
  };

  return errorMessages[error.name] || 'Gagal memulai kamera';
};

/**
 * @review
 * Semua nilai di sini di-hardcode, padahal di config.js
 * sudah ada CAMERA_CONFIG yang mendefinisikan hal yang sama:
 *   defaultFPS: 30, fpsRange: { min: 15, max: 60 },
 *   desktopResolution/mobileResolution, desktopFacingMode/mobileFacingMode.
 *
 * Dua sumber kebenaran untuk konfigurasi yang sama.
 * Jika siswa ingin mengubah resolusi kamera, mereka mungkin mengubah
 * di CAMERA_CONFIG (yang terlihat seperti "pusat konfigurasi")
 * tanpa sadar bahwa getCameraConfig() hardcode nilainya sendiri.
 *
 * Sebaiknya import CAMERA_CONFIG dan gunakan nilainya di sini.
 */
export const getCameraConfig = () => {
  const mobile = isMobileDevice();
  return {
    defaultFPS: 30,
    fpsRange: { min: 15, max: 60 },
    resolution: mobile
      ? { width: 480, height: 640 }
      : { width: 640, height: 480 },
    facingMode: mobile ? 'environment' : 'user'
  };
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
