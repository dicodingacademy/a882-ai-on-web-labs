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
        this.video = document.getElementById('videoElement');
        this.cameraSelect = document.getElementById('cameraSelect');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        // TODO 1.1: Inisialisasi elemen untuk pengaturan frame rate
        this.fpsSelect = document.getElementById('fpsSelect');
    }

    bindEvents() {
        // TODO 1: Bind event listeners untuk tombol start, stop, dan perubahan pengaturan kamera
        this.startBtn.onclick = () => this.startCamera();
        this.stopBtn.onclick = () => this.stopCamera();
        // TODO 1.1: Bind event listener untuk perubahan frame rate
        this.fpsSelect.onchange = () => this.targetFPS = parseInt(this.fpsSelect.value);
    }

    async init() {
        // TODO 1: Muat daftar kamera yang tersedia
        await this.loadCamera();
    }

    async loadCamera() {
        try {
            // TODO 1: Implementasi metode untuk memuat daftar kamera yang tersedia
            // Meminta izin akses kamera pertama kali agar label perangkat terbaca
            await navigator.mediaDevices.getUserMedia({ video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            const cameras = devices.filter((device) => device.kind === 'videoinput');

            if (cameras.length === 0) {
                this.cameraSelect.innerHTML = '<option>No cameras found</option>';
                this.startBtn.disabled = true;
                return;
            };

            cameras.forEach((camera, index) => {
                camera.id = camera.deviceId;
                camera.name = camera.label || `Camera ${index + 1}`;
                this.cameraSelect.innerHTML += `<option value="${camera.id}">${camera.name}</option>`;
            });
            
            this.cameraSelect.disabled = false;
            this.startBtn.disabled = cameras.length === 0;
        } catch (error) {
            console.error('Akses kamera ditolak:', error);
            // TODO 1.2: Nonaktifkan tombol start jika akses kamera ditolak
            this.startBtn.disabled = true;
        }
    }

    async startCamera() {
        // TODO 1: Implemetasi 
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        try {
            this.startBtn.disabled = true;
            this.startBtn.textContent = 'Starting...';

            const deviceList = this.cameraSelect.value ? { exact: this.cameraSelect.value } : undefined;
            const facingMode = isMobile ? 'environment' : 'user';
            
            // TODO 1: Pengaturan constraints kamera
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: deviceList,
                    width: { ideal: isMobile ? 480 : 640 },
                    height: { ideal: isMobile ? 640 : 480 },
                    facingMode,
                    frameRate: { ideal: this.targetFPS },
                }
            });
            
            this.video.srcObject = this.stream;
            await this.video.play();
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
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.video.srcObject = null;
        }
        this.updateUI();
    }

    updateUI() {
        // TODO 1.2: Perbarui UI setelah kamera dimulai
        const active = this.isActive();
        this.startBtn.disabled = active;
        this.startBtn.textContent = 'Start Camera';
        this.stopBtn.disabled = !active;
        this.cameraSelect.disabled = active;
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