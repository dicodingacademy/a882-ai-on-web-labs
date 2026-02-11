import { pipeline } from '@huggingface/transformers';
import { TRANSFORMERS_CONFIG, createDelay, isWebGPUSupported, logError } from '../utils/index.js';

class NutritionService {
  constructor(onProgress = null) {
    this.generator = null;
    this.isModelLoaded = false;
    this.isGenerating = false;
    this.config = TRANSFORMERS_CONFIG;
    this.currentBackend = null;
    this.onProgress = onProgress; // Callback untuk update progress di React state
  }

  async loadModel() {
    try {
      const device = isWebGPUSupported() ? 'webgpu' : 'wasm';

      this.generator = await pipeline('text2text-generation', this.config.modelName, {
        dtype: "q4",
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
      });

      await createDelay(1000);

      this.isModelLoaded = true;
      this.currentBackend = device;

      return {
        success: true,
        model: this.config.modelName,
        backend: this.currentBackend,
      };
    } catch (error) {
      logError('Kesalahan memuat model Transformers.js', error);

      this.isModelLoaded = false;

      return {
        success: false,
        model: this.config.modelName,
        backend: null,
        error: error.message,
      };
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

      await createDelay(this.config.generationDelay);

      const prompt = `Write a simple nutrition fact about ${fruitName}. Include key nutritional benefits in 1-2 sentences.`;

      const result = await this.generator(prompt, {
        max_new_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        do_sample: true,
        top_p: this.config.topP,
      });

      const generatedText = result[0].generated_text;

      return {
        nutritionFact: generatedText.trim(),
        generated: true,
        source: 'Dihasilkan AI',
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

export default NutritionService;
