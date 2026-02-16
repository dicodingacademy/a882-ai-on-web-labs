import { generateCameraSection, generateInfoPanel } from '../../templates.js';
import { getConfidenceTheme, getConfidenceTextClass, getConfidenceCardClass } from '../../utils/index.js';
import HomePresenter from './home-presenter.js';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <main class="main-container">
        ${generateCameraSection()}
        ${generateInfoPanel()}
      </main>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({ view: this });
    await this.#presenter.initialApp();
    this.#bindEvents();
  }

  #bindEvents() {
    const toggleBtn = document.getElementById('btn-toggle');
    const fpsSlider = document.getElementById('fps-slider');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.#presenter.toggleCamera();
      });
    }

    if (fpsSlider) {
      fpsSlider.addEventListener('input', (e) => {
        const fpsValue = document.getElementById('fps-value');
        if (fpsValue) fpsValue.textContent = e.target.value;
        this.#presenter.setFPS(parseInt(e.target.value, 10));
      });
    }

    window.addEventListener('beforeunload', () => {
      this.#presenter.stopCamera();
    });
  }

  showCameraLoading() {
    const toggleBtn = document.getElementById('btn-toggle');
    const btnText = document.getElementById('btn-text');
    if (toggleBtn) {
      toggleBtn.disabled = true;
    }
    if (btnText) {
      btnText.textContent = 'Memuat...';
    }
  }

  hideCameraLoading() {
    const toggleBtn = document.getElementById('btn-toggle');
    const btnText = document.getElementById('btn-text');
    /**
    * @review
    * bukan kah seharusnya if (toggleBtn && toggleBtn.disable) ? karena aku lihat kode ini untuk enable button yang disable?
    */
    if (toggleBtn && !toggleBtn.disabled) {
      toggleBtn.disabled = false;
    }
    if (btnText) {
      btnText.textContent = 'Mulai Scan';
    }
  }

  enableToggleButton() {
    const toggleBtn = document.getElementById('btn-toggle');
    const btnText = document.getElementById('btn-text');
    const viewInactive = document.getElementById('view-inactive');
    const viewActive = document.getElementById('view-active');
    const scannerOverlay = document.getElementById('scanner-overlay');
    const statusDot = document.getElementById('status-dot');
    const statusTextCamera = document.getElementById('status-text-camera');

    if (toggleBtn) {
      toggleBtn.disabled = false;
      toggleBtn.classList.remove('btn-stop');
      toggleBtn.classList.add('btn-start');
    }
    if (btnText) btnText.textContent = 'Mulai Scan';
    if (viewInactive) viewInactive.style.display = 'flex';
    if (viewActive) viewActive.style.display = 'none';
    if (scannerOverlay) scannerOverlay.style.display = 'none';
    if (statusDot) statusDot.classList.remove('active');
    if (statusTextCamera) statusTextCamera.textContent = 'OFFLINE';
  }

  /**
   * @review
   * Method ini mengakses element #status-text yang ada di header (index.html),
   * bukan di dalam template yang di-render oleh HomePage sendiri.
   *
   * Dalam pattern MVP, View seharusnya hanya mengelola DOM yang menjadi
   * tanggung jawabnya (yaitu yang dihasilkan dari render()).
   * Memanipulasi element di luar scope-nya membuat coupling tersembunyi
   * antara HomePage dan layout global.
   *
   * Alternatif: buat komponen header terpisah yang mengelola status-text,
   * atau pindahkan tanggung jawab update status ke App-level.
   */
  showStatus(message) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
      statusText.textContent = message;
    }
  }

  showCameraActive() {
    const toggleBtn = document.getElementById('btn-toggle');
    const btnText = document.getElementById('btn-text');
    const viewInactive = document.getElementById('view-inactive');
    const viewActive = document.getElementById('view-active');
    const scannerOverlay = document.getElementById('scanner-overlay');
    const statusDot = document.getElementById('status-dot');
    const statusTextCamera = document.getElementById('status-text-camera');

    if (toggleBtn) {
      toggleBtn.classList.remove('btn-start');
      toggleBtn.classList.add('btn-stop');
    }
    if (btnText) btnText.textContent = 'Berhenti';
    if (viewInactive) viewInactive.style.display = 'none';
    if (viewActive) viewActive.style.display = 'block';
    if (scannerOverlay) scannerOverlay.style.display = 'block';
    if (statusDot) statusDot.classList.add('active');
    if (statusTextCamera) statusTextCamera.textContent = 'SIARAN LANGSUNG';
  }

  showCameraInactive() {
    const toggleBtn = document.getElementById('btn-toggle');
    const btnText = document.getElementById('btn-text');
    const viewInactive = document.getElementById('view-inactive');
    const viewActive = document.getElementById('view-active');
    const scannerOverlay = document.getElementById('scanner-overlay');
    const statusDot = document.getElementById('status-dot');
    const statusTextCamera = document.getElementById('status-text-camera');

    if (toggleBtn) {
      toggleBtn.classList.remove('btn-stop');
      toggleBtn.classList.add('btn-start');
    }
    if (btnText) btnText.textContent = 'Mulai Scan';
    if (viewInactive) viewInactive.style.display = 'flex';
    if (viewActive) viewActive.style.display = 'none';
    if (scannerOverlay) scannerOverlay.style.display = 'none';
    if (statusDot) statusDot.classList.remove('active');
    if (statusTextCamera) statusTextCamera.textContent = 'OFFLINE';
  }

  showIdleState() {
    const stateIdle = document.getElementById('state-idle');
    const stateAnalyzing = document.getElementById('state-analyzing');
    const stateResult = document.getElementById('state-result');

    if (stateIdle) stateIdle.style.display = 'flex';
    if (stateAnalyzing) stateAnalyzing.style.display = 'none';
    if (stateResult) stateResult.style.display = 'none';
  }

  showAnalyzingState() {
    const stateIdle = document.getElementById('state-idle');
    const stateAnalyzing = document.getElementById('state-analyzing');
    const stateResult = document.getElementById('state-result');

    if (stateIdle) stateIdle.style.display = 'none';
    if (stateAnalyzing) stateAnalyzing.style.display = 'flex';
    if (stateResult) stateResult.style.display = 'none';
  }

  showResultState(className, confidence) {
    const stateIdle = document.getElementById('state-idle');
    const stateAnalyzing = document.getElementById('state-analyzing');
    const stateResult = document.getElementById('state-result');
    const resName = document.getElementById('res-name');
    const resConfidence = document.getElementById('res-confidence');
    const resBar = document.getElementById('res-bar');
    const resultCard = document.getElementById('result-card');

    if (stateIdle) stateIdle.style.display = 'none';
    if (stateAnalyzing) stateAnalyzing.style.display = 'none';
    if (stateResult) {
      stateResult.style.display = 'flex';
      stateResult.classList.add('fadeIn');
    }

    if (resName) resName.textContent = className;
    if (resConfidence) resConfidence.textContent = `${confidence}%`;
    if (resBar) resBar.style.width = `${confidence}%`;

    if (resultCard) {
      resultCard.classList.remove('theme-green', 'theme-yellow', 'theme-red');
      resultCard.classList.add(getConfidenceCardClass(confidence));
    }
    if (resConfidence) {
      resConfidence.classList.remove('text-green', 'text-yellow', 'text-red');
      resConfidence.classList.add(getConfidenceTextClass(confidence));
    }
  }

  showResultsWithNullNutrition(className, confidence) {
    const resName = document.getElementById('res-name');
    const resConfidence = document.getElementById('res-confidence');
    const resBar = document.getElementById('res-bar');
    const resultCard = document.getElementById('result-card');
    const nutriFact = document.getElementById('nutri-fact');
    const nutriHeaderTitle = document.getElementById('nutri-header-title');

    if (resName) resName.textContent = className;
    if (resConfidence) resConfidence.textContent = `${confidence}%`;
    if (resBar) resBar.style.width = `${confidence}%`;

    if (resultCard) {
      resultCard.classList.remove('theme-green', 'theme-yellow', 'theme-red');
      resultCard.classList.add(getConfidenceCardClass(confidence));
    }
    if (resConfidence) {
      resConfidence.classList.remove('text-green', 'text-yellow', 'text-red');
      resConfidence.classList.add(getConfidenceTextClass(confidence));
    }

    this.showResultState(className, confidence);

    if (nutriFact) nutriFact.textContent = 'Menghasilkan informasi nutrisi...';
    if (nutriHeaderTitle) nutriHeaderTitle.innerHTML = '🤖 Menghasilkan Fakta Nutrisi...';
  }

  showNutritionLoading() {
    const nutriFact = document.getElementById('nutri-fact');
    const nutriHeaderTitle = document.getElementById('nutri-header-title');
    const generateBtn = document.getElementById('generate-nutri-btn');

    if (nutriHeaderTitle) nutriHeaderTitle.innerHTML = '🤖 Menghasilkan...';
    if (nutriFact) nutriFact.textContent = 'Sedang menghasilkan informasi nutrisi...';
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.textContent = 'Memproses...';
    }
  }

  showNutritionSuccess(fact) {
    const nutriFact = document.getElementById('nutri-fact');
    const nutriHeaderTitle = document.getElementById('nutri-header-title');

    if (nutriHeaderTitle) nutriHeaderTitle.textContent = 'Fakta Nutrisi';
    if (nutriFact) {
      nutriFact.style.transform = 'scale(1.02)';
      setTimeout(() => {
        if (nutriFact) {
          nutriFact.style.transform = 'scale(1)';
          nutriFact.textContent = fact;
        }
      }, 300);
    }
  }

  showNutritionError() {
    const nutriFact = document.getElementById('nutri-fact');
    const nutriHeaderTitle = document.getElementById('nutri-header-title');
    const generateBtn = document.getElementById('generate-nutri-btn');

    if (nutriHeaderTitle) nutriHeaderTitle.textContent = 'Fakta Nutrisi (Gagal)';
    if (nutriFact) nutriFact.textContent = 'Tidak dapat menghasilkan informasi nutrisi saat ini.';
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.textContent = '🔄 Coba Lagi';
    }
  }

  showError(message) {
    alert(message);
  }

  getCameraSelectElement() {
    return document.getElementById('camera-select');
  }

  getFPSValue() {
    const fpsSlider = document.getElementById('fps-slider');
    return parseInt(fpsSlider?.value || '30', 10);
  }
}
