class CameraIntegration {
    constructor() {
        this.stream = null;
        this.targetFPS = 30;
        
        this.initializeElements();
        this.bindEvents();
        this.init();
    }

    /**
     * TODO:
     * Inisialisasi elemen:
     * [] Video
     * [] Select Camera
     * [] Start & Stop Button 
    */
    initializeElements() {}

    /**
     * TODO:
     * Daftarkan event listener untuk elemen:
     * [] Start & Stop Button 
     * [] Pilih kamera
     * [] Pilih FPS 
    */
    bindEvents() {}

    async init() {} // TODO: [] Muat daftar kamera yang tersedia

    /**
     * TODO:
     * [] Implementasi metode untuk memuat daftar kamera yang tersedia
    */
    async loadCamera() {
        try { } catch (error) {
            this.startBtn.disabled = true;
        }
    }

    /**
     * TODO:
     * [] Cek apakah perangkat adalah mobile
     * [] Pengaturan constraints kamera
    */
    async startCamera() {
        
        try {
            this.startBtn.disabled = true;
            this.startBtn.textContent = 'Starting...';
            
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
        // TODO: [] Hentikan semua track pada stream kamera
        this.updateUI();
    }

    updateUI() {
        // TODO: [] Perbarui UI setelah kamera dimulai
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