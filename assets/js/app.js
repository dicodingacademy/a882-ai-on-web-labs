class PoemGenerator {
    constructor() {
        // State management untuk aplikasi
        this.generator = null;
        this.isModelLoaded = false;
        this.isGenerating = false;

        // Inisialisasi komponen aplikasi
        this.initializeElements();
        this.bindEvents();
        this.loadModel();
    }

    initializeElements() {
        // Mengambil referensi semua elemen DOM yang diperlukan
        this.form = document.getElementById('poem-form');
        this.themeInput = document.getElementById('theme-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.loadingSection = document.getElementById('loading-section');
        this.loadingText = document.getElementById('loading-text');
        this.resultSection = document.getElementById('result-section');
        this.poemOutput = document.getElementById('poem-output');
        this.copyBtn = document.getElementById('copy-btn');
        this.copyFeedback = document.getElementById('copy-feedback');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    async loadModel() {
        try {
            // Menampilkan pesan loading dan menonaktifkan input sementara
            this.showLoading('Memuat model AI...');
            this.disableInput();

            // Mengimpor library secara dinamis
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');

            // Inisialisasi model
            this.generator = await pipeline(
                'text2text-generation',
                'Xenova/LaMini-Flan-T5-77M'
            );

            // Menandai bahwa model telah siap digunakan
            this.isModelLoaded = true;
            this.hideLoading();
            this.enableInput(); // Mengaktifkan kembali input setelah model siap
        } catch (error) {
            this.showError('Gagal memuat model AI. Pastikan menggunakan server lokal (bukan file://) dan koneksi internet stabil.');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validasi state aplikasi sebelum memproses
        if (!this.isModelLoaded || this.isGenerating) {
            return;
        }

        // Validasi input pengguna
        const theme = this.themeInput.value.trim();
        if (!theme) {
            this.showError('Silakan masukkan tema puisi.');
            return;
        }

        await this.generatePoem(theme);
    }

    async generatePoem(theme) {
        try {
            this.isGenerating = true;
            this.showLoading('Menghasilkan puisi...');
            this.disableInput();
            this.hideResult();

            await new Promise(resolve => setTimeout(resolve, 100));

            const prompt = `Write a beautiful poem about ${theme}. Make it creative and expressive.`;

            const result = await this.generator(prompt, {
                max_new_tokens: 150,    // Panjang maksimal puisi
                temperature: 0.8,       // Tingkat kreativitas (0.0-1.0)
                do_sample: true,        // Aktifkan sampling probabilistik
                top_p: 0.9             // Nucleus sampling untuk variasi
            });

            // Mengambil teks dari hasil generasi
            const poem = result[0].generated_text;

            // Menampilkan hasil ke layar
            this.hideLoading();
            this.showResult(poem);
            this.enableInput();

        } catch (error) {
            console.error('Error generating poem:', error);
            this.hideLoading();
            this.showError('Gagal menghasilkan puisi. Silakan coba lagi.');
            this.enableInput();
        } finally {
            this.isGenerating = false;
        }
    }

    async copyToClipboard() {
        try {
            const text = this.poemOutput.textContent;
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback('Puisi berhasil disalin!', 'success');
        } catch (error) {
            this.showCopyFeedback('Gagal menyalin puisi.', 'error');
        }
    }

    showLoading(message) {
        this.loadingText.textContent = message;
        this.loadingSection.style.display = 'block';
        this.loadingSection.style.visibility = 'visible';
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
    }

    showResult(poem) {
        this.poemOutput.textContent = poem;
        this.resultSection.style.display = 'block';
        
        this.resultSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    hideResult() {
        this.resultSection.style.display = 'none';
    }

    disableInput() {
        this.themeInput.disabled = true;
        this.generateBtn.disabled = true;
    }

    enableInput() {
        this.themeInput.disabled = false;
        this.generateBtn.disabled = false;
    }

    showError(message) {
        this.hideLoading();
        alert(message);
    }

    showCopyFeedback(message, type) {
        this.copyFeedback.textContent = message;
        this.copyFeedback.className = `copy-feedback show ${type}`;

        // Auto-hide feedback setelah 3 detik
        setTimeout(() => {
            this.copyFeedback.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PoemGenerator();
});
