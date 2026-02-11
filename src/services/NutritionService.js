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
          progress_callback: (() => {
            const state = { encoder: 0, decoder: 0 };
            return (progress) => {
              if (progress.status === 'progress' && progress.file) {
                state.encoder = progress.file.includes('encoder') 
                  ? Math.round(progress.progress || 0) 
                  : state.encoder;
                state.decoder = progress.file.includes('decoder') 
                  ? Math.round(progress.progress || 0) 
                  : state.decoder;
                
                // Panggil callback jika ada
                if (this.onProgress && typeof this.onProgress === 'function') {
                  this.onProgress({
                    status: 'downloading',
                    encoder: state.encoder,
                    decoder: state.decoder,
                    message: `Mengunduh model AI... Encoder: ${state.encoder}% | Decoder: ${state.decoder}%`
                  });
                }
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
