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
		// TODO: [] Inisialisasi elemen tombol salin dan umpan balik salin
	}

	bindEvents() {
		this.form.addEventListener('submit', (e) => this.handleSubmit(e));
		// TODO: [] Tambahkan event listener untuk tombol salin
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
				'Xenova/LaMini-Flan-T5-77M',
				{ dtype: "q4" },
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

	/**
	 * TODO:
	 * [✓] Logika Generasi Puisi dengan Model AI
	 * [] Menyempurnakan logika loading
	*/
	async generatePoem(theme) {
		try {
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
			this.showResult(poem);

		} catch (error) {
			console.log('error')
		} finally {
			console.log('selesai')
		}
	}

	/**
	 * TODO:
	 * [] Logika Copy to Clipboard
	*/

	showLoading(message) {
		this.loadingText.textContent = message;
		this.loadingSection.style.display = 'block';
		this.loadingSection.style.visibility = 'visible';
	}

	hideLoading() {
		this.loadingSection.style.display = 'none';
	}
	/**
	 * TODO:
	 * [✓] Fungsi Tampilkan Hasil Puisi
	 * [] Auto Scroll
	*/
	showResult(poem) {
		this.poemOutput.textContent = poem;
		this.resultSection.style.display = 'block';
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

	/**
	 * TODO:
	 * [] COPY FEEDBACK dengan animasi visual
	*/
}

document.addEventListener('DOMContentLoaded', () => {
	new PoemGenerator();
});
