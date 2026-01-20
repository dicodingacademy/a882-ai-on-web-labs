import {
  TRANSFORMERS_CONFIG,
  createDelay,
  logError
} from '../core/utils.js';

class NutritionService {
  constructor() {
    this.generator = null;
    this.isModelLoaded = false;
    this.isGenerating = false;
    this.config = TRANSFORMERS_CONFIG;
  }

  async loadModel() {
    try {
      const { pipeline } = await import(this.config.cdnUrl);

      this.generator = await pipeline(
        'text2text-generation',
        this.config.modelName
      );

      this.isModelLoaded = true;

      return { success: true, model: this.config.modelName };

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

      await createDelay(this.config.generationDelay);

      const prompt = `Tulis fakta nutrisi sederhana tentang ${fruitName}. Sertakan manfaat nutrisi utama dalam 1-2 kalimat.`;

      const result = await this.generator(prompt, {
        max_new_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        do_sample: true,
        top_p: this.config.topP
      });

      const generatedText = result[0].generated_text;

      return {
        nutritionFact: generatedText.trim(),
        generated: true,
        source: 'Dihasilkan AI'
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