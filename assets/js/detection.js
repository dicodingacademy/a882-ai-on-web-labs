class ObjectDetector {
    constructor() {
        this.model = null;
        this.labels = [];
    }

    /**
     * TODO:
     * Lengkapi metode untuk memuat model:
     * [✓] Muat model dari './model/model.json'
     * [✓] Muat metadata dari './model/metadata.json'
    */
    async loadModel() {
        try {
            const [metadata, model] = await Promise.all([
                fetch('./model/metadata.json').then(r => r.json()),
                tf.loadLayersModel('./model/model.json')
            ]);

            this.labels = metadata.labels;
            this.model = model;

            return { success: true, labels: this.labels };
        } catch (error) {
            throw new Error('Gagal memuat model. Periksa file model.');
        }
    }

    /**
     * TODO:
     * Lengkapi metode untuk prediksi:
     * [✓] Logika preprosesing gambar
     * [✓] Lakukan prediksi menggunakan model yang dimuat
     * [✓] Kembalikan hasil prediksi dengan className dan confidence
    */
    async predict(imageElement) {
        if (!this.model) throw new Error('Model tidak dapat dimuat');

        const tensor = tf.tidy(() => 
            tf.browser.fromPixels(imageElement)
                .resizeBilinear([224, 224])
                .div(255.0)
                .expandDims(0)
        );

        const predictions = this.model.predict(tensor);
        const values = await predictions.data();
        
        const maxIndex = values.indexOf(Math.max(...values));
        const result = {
            className: this.labels[maxIndex],
            confidence: Math.round(values[maxIndex] * 100)
        };

        // Cleanup
        tensor.dispose();
        predictions.dispose();

        return result;
    }

    isLoaded() {
        return !!this.model;
    }

    /**
     * TODO:
     * [✓] Lengkapi metode untuk menonaktifkan model menggunakan dispose
    */
    dispose() {
        if (this.model) {
            this.model.dispose();
            this.model = null;
        }
    }
}

export default ObjectDetector;