import CameraIntegration from "./camera.js";

class App {
    constructor() {
        this.camera = null;
        this.detector = null;
        this.isRunning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.init();
    }
    
    initializeElements() {
        // TODO 2: Inisialisasi elemen untuk menampilkan status model
        
        // TODO 1: Inisialisasi elemen video dan canvas
        
        // TODO 2: Inisialisasi elemen untuk menampilkan hasil prediksi
    }
    
    bindEvents() {
        // TODO 2: Bind event listener untuk memulai prediksi saat video siap
    }
    
    async init() {
        try {
            // TODO 1: Panggil konstruktor CameraIntegration
            this.camera = new CameraIntegration();
            // TODO 2: Panggil konstruktor ObjectDetector & load model
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    // TODO 2: Implementasi metode untuk memulai dan menghentikan prediksi
    
    // TODO 2: Implementasi metode prediksi
    
    // TODO 2: Implementasi metode untuk memperbarui tampilan hasil prediksi
    
    // TODO 2: Implementasi metode untuk mereset tampilan hasil prediksi
    
    // TODO 2: Implementasi metode untuk menampilkan status model
    
    destroy() {
        // TODO 1: Menghentikan kamera
        // TODO 2: Implementasi metode untuk membersihkan sumber daya saat aplikasi dihentikan
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    // TODO 3: Pastikan sumber daya dibersihkan saat jendela ditutup
    // window.addEventListener('beforeunload', () => app.destroy());
});