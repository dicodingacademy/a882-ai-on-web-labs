import AppPresenter from './app-presenter.js';

class App {
  #content = null;
  #uiElements = {};

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    this.#content.innerHTML = await this.render();
    await this.afterRender();
  }

  // TODO: Tambahkan loading indikator saat kamera dinyalakan
  // TODO: Tambahkan element video dan canvas pada bagian viewport-container di bawah ini

  async render() {
    return `
        <section class="video-card">
          <div class="viewport-container">
            <div class="placeholder">
              <p>Camera Off</p>
            </div>
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
    // TODO: Lengkapi properti #uiElements dengan referensi elemen UI yang dibutuhkan
    this.#uiElements = {};

    // TODO: Kirimkan #uiElements ke Presenter dan panggil metode start pada Presenter
  }

  bindCameraEvents(camera) {
    // TODO: Tambahkan event listener untuk tombol toggleCamBtn
  }

  showError(message) {
    // TODO: Tampilkan pesan error pada elemen placeholderText
  }
}

export default App;
