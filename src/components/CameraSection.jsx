import { useState, useRef, useEffect } from 'react';
import { Camera, Smartphone } from 'lucide-react';
import { commonStyles } from '../utils/ui.js';

function CameraSection({
  isRunning,
  onToggleCamera,
  services,
  modelStatus,
  error
}) {
  const [fps, setFps] = useState(30);
  const [cameraType, setCameraType] = useState('default');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /**
   * @review
   * Sebaiknya tambahkan dependency array [services.camera]
   * agar effect hanya jalan ketika camera service berubah.
   */
  useEffect(() => {
    if (services.camera) {
      if (videoRef.current && !services.camera.video) {
        services.camera.setVideoElement(videoRef.current);
      }
      if (canvasRef.current && !services.camera.canvas) {
        services.camera.setCanvasElement(canvasRef.current);
      }
    }
  });

  useEffect(() => {
    if (services.camera) {
      services.camera.setFPS(fps);
    }
  }, [fps, services.camera]);

  /**
   * @review
   * Ada dua masalah dengan camera selector ini:
   *
   * 1. services.camera.startCamera() dipanggil tanpa argumen.
   *    Padahal method startCamera(selectedCameraId) di CameraService
   *    menerima parameter deviceId. Tanpa argumen, kamera yang sama
   *    akan digunakan terus, jadi mengganti pilihan di dropdown tidak ada efeknya.
   *
   * 2. Nilai dropdown ('default', 'front', 'ext') diberkas ini adalah string hardcode
   *    yang tidak berhubungan dengan deviceId asli dari enumerateDevices().
   *
   *    Di sisi lain, CameraService.loadCameras() sudah bisa mengembalikan daftar kamera
   *    dengan deviceId yang sebenarnya, tapi tidak dimanfaatkan.
   *
   * Saran: silakan panggil loadCameras() saat init, populate dropdown dengan deviceId asli,
   * lalu pass deviceId ke startCamera(selectedCameraId).
   */
  const handleCameraChange = (newCameraType) => {
    setCameraType(newCameraType);
    if (services.camera && services.camera.isActive()) {
      services.camera.startCamera();
    }
  };

  const handleFpsChange = (newFps) => {
    setFps(Number(newFps));
  };

  const isModelReady = modelStatus === 'Model AI Siap';
  const buttonText = isRunning ? 'Stop Scan' : 'Mulai Scan';
  const buttonClass = isRunning ? 'btn btn-stop' : 'btn btn-start';
  const buttonDisabled = !isModelReady;
  /**
   * @review
   * Kondisi `buttonDisabled && !isModelReady` itu redundan.
   *
   * `buttonDisabled` sendiri sudah didefinisikan sebagai `!isModelReady` di baris atas.
   * Jadi `buttonDisabled && !isModelReady` sama saja dengan `!isModelReady && !isModelReady`,
   * yang secara logis identik dengan `!isModelReady`.
   *
   * Cukup: `const displayButtonText = !isModelReady ? 'Memuat Model...' : buttonText;`
   */
  const displayButtonText = buttonDisabled && !isModelReady
    ? 'Memuat Model...'
    : buttonText;

  return (
    <section className="camera-card" aria-label="Camera Feed and Controls">
      <div className="viewport">
        <div className="live-indicator">
          <span className={`dot ${isRunning ? 'active' : ''}`}></span>
          <span className="live-text">{isRunning ? 'LIVE' : 'OFFLINE'}</span>
        </div>

        {!isRunning && (
          <div className="view-content view-inactive">
            <Camera size={48} />
            <p>Kamera sedang tidak aktif</p>
            {error && (
              <p style={{
                ...commonStyles.errorContainer,
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                {error}
              </p>
            )}
          </div>
        )}

        <div className={`view-content view-active ${isRunning ? 'active' : ''}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />

          <canvas
            ref={canvasRef}
            className="canvas-hidden"
          />

          <div className={`scanner-overlay ${isRunning ? 'active' : ''}`}>
            <div className="scanner-line"></div>
            <div className="scanner-border"></div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          className={buttonClass}
          onClick={onToggleCamera}
          disabled={buttonDisabled}
          aria-label={displayButtonText}
        >
          <span>{displayButtonText}</span>
        </button>

        <div className="settings-group">
          <div className="select-wrapper">
            <div className="select-icon">
              <Smartphone size={16} />
            </div>
            <select
              value={cameraType}
              onChange={(e) => handleCameraChange(e.target.value)}
              disabled={isRunning}
            >
              <option value="default">Kamera Belakang (Utama)</option>
              <option value="front">Kamera Depan</option>
              <option value="ext">Webcam Eksternal</option>
            </select>
          </div>

          <div className="fps-control">
            <div className="fps-label">
              <label htmlFor="fps-slider">Batas FPS</label>
              <span>{fps}</span>
            </div>
            <input
              id="fps-slider"
              type="range"
              min="15"
              max="60"
              step="15"
              value={fps}
              onChange={(e) => handleFpsChange(e.target.value)}
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CameraSection;