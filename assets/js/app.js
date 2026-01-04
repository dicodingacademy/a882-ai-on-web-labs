class App {
    constructor() {
        this.camera = null;
        this.detector = null;
        this.isRunning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.init();
    }
    
    /**
     * TODO:
     * Inisialisasi elemen:
     * [] Status Model
     * [] Video & Canvas
     * [] Hasil Prediksi
    */ 
    initializeElements() {}
    
    bindEvents() {} // TODO: [] Bind event listener untuk memulai prediksi saat video siap
    
    /**
     * TODO:
     * [] Panggil konstruktor CameraIntegration
     * [] Panggil konstruktor ObjectDetector
     * [] Load model
    */
    async init() {
        try {  } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    // TODO: [] Implementasi metode untuk memulai dan menghentikan prediksi
    
    // TODO: [] Implementasi metode prediksi
    
    // TODO: [] Implementasi metode untuk memperbarui tampilan hasil prediksi
    
    // TODO: [] Implementasi metode untuk mereset tampilan hasil prediksi
    
    // TODO: [] Implementasi metode untuk menampilkan status model
    
    /**
     * TODO:
     * [] Menghentikan kamera
     * [] Implementasi metode untuk membersihkan sumber daya saat aplikasi dihentikan
    */
    destroy() {}
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    // TODO: [] Pastikan sumber daya dibersihkan saat jendela ditutup
});