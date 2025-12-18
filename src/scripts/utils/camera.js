export default class Camera {
  #video;
  #canvas;
  #ctx;
  #cameraSelect;
  #fpsSlider;
  #videoResolution = { width: 1280, height: 720 };

  constructor(appUI) {
    this.#video = appUI.video;
    this.#canvas = appUI.canvas;
    this.#ctx = appUI.ctx;
    this.#cameraSelect = appUI.cameraSelect;
    this.#fpsSlider = appUI.fpsSlider;
  }

  async start() {
    const deviceId = this.#cameraSelect.value;
    const fps = parseInt(this.#fpsSlider.value, 10);

    const constraints = {
      video: {
        frameRate: { ideal: fps },
        width: { ideal: this.#videoResolution.width },
        height: { ideal: this.#videoResolution.height },
      },
    };

    if (deviceId) {
      constraints.video.deviceId = { exact: deviceId };
    } else {
      constraints.video.facingMode = 'user';
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.#video.srcObject = stream;
      await this.#video.play();

      // TODO: Panggil browser API untuk menjalankan requestAnimationFrame untuk menggambar frame video ke canvas

    } catch (err) {
      console.error('Failed to start video stream:', err);
    }
  }

  stop() {
    
    // TODO: Hentikan requestAnimationFrame 

    if (this.#video.srcObject) {
      this.#video.srcObject.getTracks().forEach((track) => track.stop());
      this.#video.srcObject = null;
    }

    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  // TODO: Tambahkan method untuk menggambar frame video ke canvas

  // TODO: Tambahkan method untuk mendeteksi object pada frame video
}
