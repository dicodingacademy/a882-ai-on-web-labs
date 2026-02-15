import { useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import CameraSection from './components/CameraSection';
import InfoPanel from './components/InfoPanel';
import { DetectionService } from './services/DetectionService';
import { CameraService } from './services/CameraService';
import { NutritionService } from './services/NutritionService';
import { APP_CONFIG, isValidDetection } from './utils/config';
import { createDelay } from './utils/common';
import { commonStyles } from './utils/ui';
import { useAppState } from './hooks/useAppState';

function App() {
  const { state, actions } = useAppState();
  const detectionCleanupRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        actions.setModelStatus('Memuat model AI...');
        actions.setError(null);

        const detector = new DetectionService();
        await detector.loadModel();

        const camera = new CameraService();

        let generator = null;
        try {
          // Callback untuk update progress download model
          generator = new NutritionService((progress) => {
            actions.setModelStatus(progress.message);
          });
          await generator.loadModel();
        } catch (error) {
          console.warn('⚠️ Layanan nutrisi gagal dimuat (mode offline?)', error);
        }

        if (isMounted) {
          actions.setServices({ detector, camera, generator });
          actions.setModelStatus('Model AI Siap');
        }

      } catch (error) {
        if (isMounted) {
          console.error('❌ Gagal menginisialisasi aplikasi', error);
          actions.setModelStatus('Model gagal dimuat');
          actions.setError(`Gagal menginisialisasi: ${error.message}`);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [actions]);

  useEffect(() => {
    return () => {
      if (detectionCleanupRef.current) {
        detectionCleanupRef.current();
      }
      if (state.services.camera) {
        state.services.camera.stopCamera();
      }
    };
  }, [state.services.camera]);

  const startDetection = useCallback(() => {
    let animationId = null;
    let isActive = true;

    const detectLoop = async () => {
      /**
       * @review
       * Ada dead code di sini.
       *
       * Kondisi luar: `!isActive || !isRunningRef.current`
       *   → artinya minimal salah satu bernilai false.
       *
       * Kondisi dalam: `isActive && isRunningRef.current`
       *   → artinya KEDUANYA harus true.
       *
       * Jika sudah masuk blok luar (minimal satu false),
       * maka kondisi dalam (keduanya true) TIDAK MUNGKIN tercapai.
       * Blok setTimeout di dalamnya tidak akan pernah dieksekusi.
       *
       * Kemungkinan yang dimaksud adalah:
       *   if (!isActive) return;           // benar-benar berhenti
       *   if (!isRunningRef.current) {     // belum siap, tapi retry
       *     setTimeout(() => { ... }, retryInterval);
       *     return;
       *   }
       */
      if (!isActive || !isRunningRef.current) {
        if (isActive && isRunningRef.current) {
          setTimeout(() => {
            if (isActive) {
              animationId = requestAnimationFrame(detectLoop);
            }
          }, APP_CONFIG.detectionRetryInterval);
        }
        return;
      }

      try {
        const canvas = state.services.camera.captureFrame();
        if (!canvas) {
          if (isActive && isRunningRef.current) {
            animationId = requestAnimationFrame(detectLoop);
          }
          return;
        }

        const result = await state.services.detector.predict(canvas);

        if (isValidDetection(result)) {
          isActive = false;
          isRunningRef.current = false;
          actions.setRunning(false);
          actions.setAppState('analyzing');
          state.services.camera?.stopCamera();

          await createDelay(APP_CONFIG.analyzingDelay);

          actions.setDetectionResult(result);
          actions.setAppState('result');
          actions.setNutritionData(null);

          if (state.services.generator?.isReady()) {
            await createDelay(APP_CONFIG.nutritionGenerationDelay);
            try {
              const nutritionResult = await state.services.generator.generateNutrition(result.className);
              actions.setNutritionData(nutritionResult.nutritionFact);
            } catch (nutritionError) {
              console.error('❌ Gagal menghasilkan konten nutrisi', nutritionError);
              actions.setNutritionData('error');
            }
          } else {
            actions.setNutritionData('error');
          }
          return;
        }
      } catch (error) {
        console.error('❌ Error deteksi', error);
        actions.setError(`Deteksi gagal: ${error.message}`);
      }

      if (isActive && isRunningRef.current) {
        animationId = requestAnimationFrame(detectLoop);
      }
    };

    detectLoop();

    return () => {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.services, actions]);

  const startCamera = async () => {
    try {
      actions.resetResults();

      isRunningRef.current = true;
      actions.setRunning(true);
      actions.setAppState('analyzing');

      await state.services.camera?.startCamera();

      /**
       * @review
       * Menggunakan document.querySelector('video') dan document.querySelector('canvas')
       * untuk mendapatkan elemen DOM adalah anti-pattern di React.
       *
       * React menyediakan useRef untuk mengakses DOM secara deklaratif.
       * Di CameraSection.jsx sendiri sudah ada videoRef dan canvasRef.
       *
       * Masalah dengan querySelector:
       * 1. Jika ada lebih dari satu <video> atau <canvas> di halaman, akan ambil yang salah.
       * 2. Bergantung pada timing render DOM, bukan lifecycle React.
       * 3. Bypass React's declarative model.
       *
       * Sebaiknya, angkat ref ke App.jsx atau gunakan callback ref
       * yang diteruskan dari parent ke child, lalu pass ke CameraService.
       */
      if (state.services.camera) {
        const videoEl = document.querySelector('video');
        const canvasEl = document.querySelector('canvas');
        if (videoEl && !state.services.camera.video) {
          state.services.camera.setVideoElement(videoEl);
        }
        if (canvasEl && !state.services.camera.canvas) {
          state.services.camera.setCanvasElement(canvasEl);
        }
      }

      await createDelay(500);

      const cleanup = startDetection();
      detectionCleanupRef.current = cleanup;

    } catch (error) {
      console.error('❌ Gagal memulai kamera', error);
      isRunningRef.current = false;
      actions.setRunning(false);
      actions.setAppState('idle');
      throw error;
    }
  };

  const stopCamera = () => {
    if (detectionCleanupRef.current) {
      detectionCleanupRef.current();
      detectionCleanupRef.current = null;
    }

    isRunningRef.current = false;
    actions.setRunning(false);
    actions.setAppState('idle');
    state.services.camera?.stopCamera();
    actions.resetResults();
  };

  const handleToggleCamera = useCallback(async () => {
    if (!state.services.detector?.isLoaded()) {
      actions.setError('Model deteksi AI belum siap. Harap tunggu inisialisasi selesai.');
      return;
    }

    try {
      actions.setError(null);
      if (!isRunningRef.current) {
        await startCamera();
      } else {
        stopCamera();
      }
    } catch (error) {
      console.error('❌ Camera toggle error:', error);
      actions.setError(error.message);
    }
  }, [state.services.detector, actions, startCamera]);

  return (
    <div className="App">
      <Header modelStatus={state.modelStatus} />

      <main className="main-container">
        <CameraSection
          isRunning={state.isRunning}
          onToggleCamera={handleToggleCamera}
          services={state.services}
          modelStatus={state.modelStatus}
          error={state.error}
        />

        <InfoPanel
          appState={state.appState}
          detectionResult={state.detectionResult}
          nutritionData={state.nutritionData}
          error={state.error}
        />
      </main>

      {state.error && (
        <div className="error-toast" style={commonStyles.errorToast}>
          <strong>Error:</strong> {state.error}
          <button
            onClick={() => actions.setError(null)}
            style={commonStyles.closeButton}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
