import { TRANSFORMERS_CONFIG } from '../utils/config.js';
import {
  createDelay,
  isWebGPUSupported,
  logError,
  updatePerformanceStats,
  logPerformance,
  createPerformanceResult,
  createPerformanceStats
} from '../utils/common.js';
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

export class NutritionService {
  constructor(onProgress = null) {
    this.generator = null;
    this.isModelLoaded = false;
    this.isGenerating = false;
    this.config = TRANSFORMERS_CONFIG;
    this.currentBackend = null;
    this.performanceStats = createPerformanceStats();
    this.onProgress = onProgress; // Callback untuk update progress download
  }

  async loadModel() {
    try {
      const device = isWebGPUSupported() ? 'webgpu' : 'wasm';

      this.generator = await pipeline(
        'text2text-generation',
        this.config.modelName,
        {
          dtype: 'q4',
          device,
          /**
           * @review
           * Di sini aku coba untuk memperbaiki glitch pada persentase encoder dan decorder saat progress_callback berjalan.
           *
           * Ada 3 issue sebelumnya:
           * 1. this.onProgress masih dijalankan walau tidak ada perubahan pada file encoder/decoder. Memicu re-render yang tidak perlu.
           * 2. Track progress per file, bukan per per-kategori. Hal ini memicu glitch kalo modelnya punya multiple file per kategori encoder/decoder.
           * 3. Belum ada semacam throttle untuk meminimalkan jumlah call this.onProgress.
           *
           * Kodenya jadi lebih kompleks, gimana kalo dibuat fungsi terpisah saja?
           */
          progress_callback: (() => {
            const fileProgress = {};
            let lastMessage = '';
            let lastCallTime = 0;
            const THROTTLE_MS = 200;

            return (progress) => {
              if (progress.status !== 'progress' || !progress.file) return;

              const isEncoder = progress.file.includes('encoder');
              const isDecoder = progress.file.includes('decoder');
              if (!isEncoder && !isDecoder) return;

              fileProgress[progress.file] = Math.round(progress.progress);

              const encoderFiles = Object.entries(fileProgress)
                .filter(([file]) => file.includes('encoder'));
              const decoderFiles = Object.entries(fileProgress)
                .filter(([file]) => file.includes('decoder'));

              const average = (entries) => {
                if (entries.length === 0) return 0;
                const sum = entries.reduce((acc, [, val]) => acc + val, 0);
                return Math.round(sum / entries.length);
              };

              const encoder = average(encoderFiles);
              const decoder = average(decoderFiles);
              const message = `Mengunduh model AI... Encoder: ${encoder}% | Decoder: ${decoder}%`;

              if (message === lastMessage) return;

              const now = Date.now();
              if (now - lastCallTime < THROTTLE_MS) return;
              lastCallTime = now;
              lastMessage = message;

              if (this.onProgress && typeof this.onProgress === 'function') {
                this.onProgress({ status: 'downloading', encoder, decoder, message });
              }
            };
          })(),
        }
      );

      this.isModelLoaded = true;
      this.currentBackend = device;

      return {
        success: true,
        model: this.config.modelName,
        backend: this.currentBackend
      };

    } catch (error) {
      logError('Kesalahan memuat model Transformers.js', error);
      throw new Error(`Gagal memuat model generasi konten: ${error.message}`);
    }
  }

  async generateNutrition(fruitName) {
    if (!this.isModelLoaded || this.isGenerating) {
      throw new Error('Model belum siap atau sedang menghasilkan konten');
    }

    if (!fruitName || typeof fruitName !== 'string') {
      throw new Error('Nama buah yang valid diperlukan');
    }

    try {
      this.isGenerating = true;
      const startTime = performance.now();

      await createDelay(this.config.generationDelay);

      const prompt = `Write a simple nutrition fact about ${fruitName}. Include key nutritional benefits in 1-2 sentences.`;

      const result = await this.generator(prompt, {
        max_new_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        do_sample: true,
        top_p: this.config.topP
      });

      const endTime = performance.now();
      const generationTime = endTime - startTime;

      updatePerformanceStats(this.performanceStats, generationTime);

      const generatedText = result[0].generated_text;

      logPerformance(this.currentBackend, generationTime, this.performanceStats.averageTime);

      return {
        nutritionFact: generatedText.trim(),
        generated: true,
        source: 'Dihasilkan AI',
        performance: createPerformanceResult(
          generationTime,
          this.currentBackend,
          this.performanceStats.averageTime,
          this.performanceStats.operations
        )
      };

    } catch (error) {
      logError('Kesalahan menghasilkan konten nutrisi', error);
      throw new Error(`Gagal menghasilkan informasi nutrisi: ${error.message}`);
    } finally {
      this.isGenerating = false;
    }
  }

  isReady() {
    return this.isModelLoaded && !this.isGenerating;
  }
}
