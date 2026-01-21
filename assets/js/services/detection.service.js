import {
  TENSORFLOW_CONFIG,
  validateModelMetadata,
  logError,
} from '../core/utils.js';

class DetectionService {
  constructor() {
    this.model = null;
    this.labels = [];
    this.config = TENSORFLOW_CONFIG;
    this.performanceStats = {
      predictions: 0,
      totalTime: 0,
      averageTime: 0
    };
  }

  /**
  * TODO:
  * Konfigurasi backend TensorFlow.js:
  * [] Cek ketersediaan WebGPU.
  * [] Set backend yang optimal.
  */
  async loadModel() {
    try {
      await tf.ready();

      const [metadata, model] = await Promise.all([
        fetch(this.config.metadataPath).then(r => r.json()),
        tf.loadLayersModel(this.config.modelPath)
      ]);

      if (!validateModelMetadata(metadata)) {
        throw new Error('Metadata tidak valid: array label tidak ditemukan');
      }

      this.labels = metadata.labels;
      this.model = model;

      return {
        success: true,
        labels: this.labels,
        modelName: metadata.modelName || 'Unknown',
        version: metadata.version || '1.0.0',
      };

    } catch (error) {
      logError('Gagal memuat model', error);
      throw new Error(`Gagal memuat model: ${error.message}`);
    }
  }

  /**
  * TODO:
  * Meninjau performa prediksi model TensorFlow.js.
  * [] Hitung waktu prediksi menggunakan performance.now().
  * [] Perbarui statistik performa di this.performanceStats.
  * [] Log hasil prediksi dan waktu yang dibutuhkan ke konsol.
  */
  async predict(imageElement) {
    if (!this.model) {
      throw new Error('Model belum dimuat. Panggil loadModel() terlebih dahulu.');
    }

    if (!imageElement) {
      throw new Error('Elemen gambar diperlukan untuk prediksi');
    }

    let tensor = null;
    let predictions = null;

    try {
      tensor = tf.tidy(() => {
        return tf.browser.fromPixels(imageElement)
          .resizeBilinear(this.config.inputSize)
          .div(this.config.normalizationFactor)
          .expandDims(0);
      });

      predictions = this.model.predict(tensor);
      const values = await predictions.data();

      const maxIndex = values.indexOf(Math.max(...values));
      const confidence = Math.round(values[maxIndex] * 100);
      const className = this.labels[maxIndex];
      const isValid = confidence >= (this.config.confidenceThreshold * 100);

      const result = {
        className: className,
        confidence: confidence,
        isValid: isValid,
      };

      return result;

    } catch (error) {
      logError('Kesalahan prediksi', error);
      throw new Error(`Prediksi gagal: ${error.message}`);
    } finally {
      if (tensor) tensor.dispose();
      if (predictions) predictions.dispose();
    }
  }

  isLoaded() {
    return !!this.model && this.labels.length > 0;
  }
}

export default DetectionService;