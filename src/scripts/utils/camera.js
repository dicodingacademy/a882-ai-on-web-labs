import * as tf from '@tensorflow/tfjs';

export default class Camera {
  #video;
  #canvas;
  #ctx;
  #cameraSelect;
  #fpsSlider;
  #model;
  #labels;
  #imageSize;
  #prediction;
  #confidence;
  #animationFrameId = null;
  #videoResolution = { width: 1280, height: 720 };
  #videoDevices = [];

  constructor(appUI) {
    this.#video = appUI.video;
    this.#canvas = appUI.canvas;
    this.#ctx = appUI.ctx;
    this.#cameraSelect = appUI.cameraSelect;
    this.#fpsSlider = appUI.fpsSlider;
    this.#model = appUI.model;
    this.#labels = appUI.labels;
    this.#imageSize = appUI.imageSize;
    this.#prediction = appUI.prediction;
    this.#confidence = appUI.confidence;
  }

  async init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('Kamera tidak tersedia di browser ini.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.#videoDevices = devices.filter((device) => device.kind === 'videoinput');

    this.#populateCameraSelect(this.#videoDevices);

    stream.getTracks().forEach((track) => track.stop());
  }

  #populateCameraSelect(videoDevices) {
    this.#cameraSelect.innerHTML = '';

    if (videoDevices.length === 0) {
      const option = document.createElement('option');
      option.innerText = 'No cameras found';
      this.#cameraSelect.appendChild(option);
      return;
    }

    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.innerText = device.label || `Camera ${index + 1}`;
      this.#cameraSelect.appendChild(option);
    });
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

      this.#canvas.width = this.#video.videoWidth;
      this.#canvas.height = this.#video.videoHeight;

      this.#animationFrameId = requestAnimationFrame(() => this.#processFrame());
    } catch (err) {
      console.error('Failed to start video stream:', err);
    }
  }

  stop() {

     if (this.#animationFrameId) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#animationFrameId = null;
    }

    if (this.#video.srcObject) {
      this.#video.srcObject.getTracks().forEach((track) => track.stop());
      this.#video.srcObject = null;
    }

    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  #processFrame() {
    this.#animationFrameId = requestAnimationFrame(() => this.#processFrame());

    this.#ctx.save();
    this.#ctx.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);
    this.#ctx.restore();

    this.#detect()
  }

  async #detect() {
    if (!this.#model) return;

    const tensor = tf.tidy(() => {
      return tf.browser
        .fromPixels(this.#canvas)
        .resizeBilinear([this.#imageSize, this.#imageSize])
        .div(255.0)
        .expandDims(0);
    });

    const predictions = this.#model.predict(tensor);
    const values = await predictions.data();

    const topPrediction = values.indexOf(Math.max(...values));
    const label = this.#labels[topPrediction];
    const confidence = Math.round(values[topPrediction] * 100);

    this.#prediction.textContent = label;
    this.#confidence.style.width = `${confidence}%`;

    tensor.dispose();
    predictions.dispose();
  }
}
