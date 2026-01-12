class ObjectDetector {
	constructor() {
		this.model = null;
		this.labels = [];
	}

	/**
	 * TODO:
	 * Lengkapi metode untuk memuat model:
	 * [] Muat model dari './model/model.json'
	 * [] Muat metadata dari './model/metadata.json'
	*/
	async loadModel() { }

	/**
	 * TODO:
	 * Lengkapi metode untuk prediksi:
	 * [] Logika preprosesing gambar
	 * [] Lakukan prediksi menggunakan model yang dimuat
	 * [] Kembalikan hasil prediksi dengan className dan confidence
	*/
	async predict(imageElement) { }

	isLoaded() {
		return !!this.model;
	}

	/**
	 * TODO:
	 * [] Lengkapi metode untuk menonaktifkan model menggunakan dispose
	*/
	dispose() { }
}

export default ObjectDetector;