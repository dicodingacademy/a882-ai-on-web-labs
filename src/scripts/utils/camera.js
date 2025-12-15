import * as tf from '@tensorflow/tfjs';

export default class Camera {
  #model;
  #labels;
  #imageSize;
  #prediction;
  #confidence;
  #isDetecting = false;
  #video;
  #canvas;
  #ctx;
  #cameraSelect;
  #fpsSlider;
  #placeholder;
  #placeholderText;
  #loader;
  #animationFrameId = null;
  #videoResolution = { width: 1280, height: 720 };

  constructor(appUI) {
    this.#model = appUI.model;
    this.#labels = appUI.labels;
    this.#imageSize = appUI.imageSize;
    this.#prediction = appUI.prediction;
    this.#confidence = appUI.confidence;
    this.#video = appUI.video;
    this.#canvas = appUI.canvas;
    this.#ctx = appUI.ctx;
    this.#cameraSelect = appUI.cameraSelect;
    this.#fpsSlider = appUI.fpsSlider;
    this.#placeholder = appUI.placeholder;
    this.#placeholderText = appUI.placeholderText;
    this.#loader = appUI.loader;
  }

  async start() {
    this.#placeholderText.style.display = 'none';
    this.#loader.style.display = 'block';
    this.#placeholder.style.display = 'flex';
    this.#canvas.style.display = 'none';

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

      this.#placeholder.style.display = 'none';
      this.#canvas.style.display = 'block';

      this.#animationFrameId = requestAnimationFrame(() => this.#processFrame());
    } catch (err) {
      console.error('Failed to start video stream:', err);
      this.#placeholder.style.display = 'flex';
      this.#loader.style.display = 'none';
      this.#placeholderText.style.display = 'block';
      this.#canvas.style.display = 'none';
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
    this.#placeholder.style.display = 'flex';
    this.#loader.style.display = 'none';
    this.#placeholderText.style.display = 'block';
    this.#canvas.style.display = 'none';
  }

  #processFrame() {
    this.#animationFrameId = requestAnimationFrame(() => this.#processFrame());

    this.#ctx.save();
    this.#ctx.scale(-1, 1);
    this.#ctx.translate(-this.#canvas.width, 0);
    this.#ctx.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);
    this.#ctx.restore();

    if (!this.#isDetecting) {
      this.#isDetecting = true;
      this.#detect().then(() => {
        this.#isDetecting = false;
      });
    }
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
