import AppPresenter from './app-presenter.js';
import AppModel from './app-model.js';

class App {
  #content = null;
  #isCamOn = false;
  #uiElements = {};
  #presenter;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    this.#content.innerHTML = await this.render();
    await this.afterRender();
  }

  async render() {
    return `
        <section class="video-card">
          <div class="viewport-container">
            <div class="placeholder">
              <div class="loader"></div>
              <p>Camera Off</p>
            </div>
            <video id="webcam"></video>
            <canvas id="outputCanvas"></canvas>
          </div>
        </section>

        <section class="dashboard-grid">

          <div class="control-card result-card">
            <div class="prediction-label">Prediction</div>
            <div id="prediction" class="prediction-value">Waiting...</div>
            <div class="confidence-container">
              <div id="confidence" class="confidence-bar">
              </div>
            </div>
          </div>

          <div class="control-card settings-card">

            <div class="input-group">
              <label for="cameraSelect">Camera Source</label>
              <select id="cameraSelect">
                <option value="" disabled selected>Select Device</option>
              </select>
            </div>

            <div class="input-group">
              <div class="slider-row">
                <label for="fpsSlider">FPS Limit</label>
                <span id="fpsValue" class="fps-value">30</span>
              </div>
              <input type="range" id="fpsSlider" min="1" max="60" value="30">
            </div>

            <button id="toggleCamBtn" class="btn btn-primary">Start Camera</button>
          </div>

        </section>
    `;
  }

  async afterRender() {
    this.#uiElements = {
      prediction: document.getElementById('prediction'),
      confidence: document.getElementById('confidence'),
      video: document.getElementById('webcam'),
      canvas: document.getElementById('outputCanvas'),
      cameraSelect: document.getElementById('cameraSelect'),
      fpsSlider: document.getElementById('fpsSlider'),
      fpsValue: document.getElementById('fpsValue'),
      toggleCamBtn: document.getElementById('toggleCamBtn'),
      placeholder: document.querySelector('.placeholder'),
      placeholderText: document.querySelector('.placeholder p'),
      loader: document.querySelector('.loader'),
    };

    this.#uiElements.ctx = this.#uiElements.canvas.getContext('2d');

    this.#uiElements.video.addEventListener('loadedmetadata', () => {
      this.#uiElements.canvas.width = this.#uiElements.video.videoWidth;
      this.#uiElements.canvas.height = this.#uiElements.video.videoHeight;
    });

    this.#uiElements.fpsSlider.addEventListener('input', (e) => {
      this.#uiElements.fpsValue.textContent = e.target.value;
    });

    this.#presenter = new AppPresenter({
      view: this,
      model: new AppModel(),
      appUI: this.#uiElements,
    });

    await this.#presenter.start();
  }

  bindCameraEvents(camera) {
    this.#uiElements.toggleCamBtn.addEventListener('click', () => {
      if (this.#isCamOn) {
        camera.stop();
        this.#uiElements.toggleCamBtn.innerText = 'Start Camera';
      } else {
        camera.start();
        this.#uiElements.toggleCamBtn.innerText = 'Stop Camera';
      }
      this.#isCamOn = !this.#isCamOn;
    });
  }

  populateCameraSelect(videoDevices) {
    this.#uiElements.cameraSelect.innerHTML = '';

    if (videoDevices.length === 0) {
      const option = document.createElement('option');
      option.innerText = 'No cameras found';
      this.#uiElements.cameraSelect.appendChild(option);
      return;
    }

    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.innerText = device.label || `Camera ${index + 1}`;
      this.#uiElements.cameraSelect.appendChild(option);
    });
  }

  showError(message) {
    this.#uiElements.placeholderText.innerText = message;
    this.#uiElements.loader.style.display = 'none';
  }
}

export default App;
