class CameraIntegration {
    constructor() {
        this.stream = null;
        this.targetFPS = 30;
        
        this.initializeElements();
        this.bindEvents();
        this.init();
    }

    initializeElements() {
        // TODO 1: Inisialisasi elemen video, pemilih kamera, dan kontrol lainnya
        // TODO 1.1: Inisialisasi elemen untuk pengaturan frame rate
    }

    bindEvents() {
        // TODO 1: Bind event listeners untuk tombol start, stop, dan perubahan pengaturan kamera
        // TODO 1.1: Bind event listener untuk perubahan frame rate
    }

    async init() {
        // TODO 1: Muat daftar kamera yang tersedia
    }

    async loadCameras() {
        try {
            // TODO 1: Implementasi metode untuk memuat daftar kamera yang tersedia
            
            // TODO 1.2: Nonaktifkan tombol start jika tidak ada kamera 
        } catch (error) {
            // TODO 1.2: Nonaktifkan tombol start jika akses kamera ditolak
            this.startBtn.disabled = true;
        }
    }

    async startCamera() {
        // TODO 1: Cek apakah perangkat adalah mobile
        
        try {
            this.startBtn.disabled = true;
            this.startBtn.textContent = 'Starting...';
            
            // TODO 1: Pengaturan constraints kamera
            this.stream = null;
            
            this.video.srcObject = this.stream;
            this.updateUI();
        } catch (error) {
            alert(error.name === 'NotAllowedError' 
                ? 'Camera permission denied. Please allow camera access.' 
                : 'Failed to start camera.');
            this.updateUI();
        }
    }

    stopCamera() {
        // TODO 1: Hentikan semua track pada stream kamera
        this.updateUI();
    }

    updateUI() {
        // TODO 1.2: Perbarui UI setelah kamera dimulai
    }

    isActive() {
        return this.stream && this.stream.active;
    }

    isReady() {
        return this.isActive() && this.video.readyState >= 2 && !this.video.paused;
    }

    destroy() {
        this.stopCamera();
    }
}

export default CameraIntegration;