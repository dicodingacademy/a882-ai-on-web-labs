import { Settings2, Zap, AlertCircle } from 'lucide-react';
import {
  commonStyles,
  getConfidenceTheme,
  getConfidenceTextClass,
  createProgressBarStyle,
  formatPerformanceText
} from '../utils/ui.js';

function InfoPanel({ appState, detectionResult, nutritionData, error }) {
  const renderIdleState = () => (
    <div className="state-container state-idle">
      <div className="state-idle-icon">
        <Settings2 size={32} />
      </div>
      <h2>Siap untuk Scan</h2>
      <p>Mulai kamera dan arahkan ke buah atau sayuran untuk mendapatkan wawasan nutrisi instan.</p>
      {error && (
        <div style={commonStyles.errorContainer}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );

  const renderAnalyzingState = () => (
    <div className="state-container state-analyzing">
      <div className="spinner"></div>
      <h2>Menganalisis Gambar...</h2>
      <p>Mengidentifikasi jenis produk dan menghitung metrik.</p>
    </div>
  );

  const renderResultState = () => {
    if (!detectionResult) return null;

    const confidence = Math.round(detectionResult.score * 100);
    const themeClass = getConfidenceTheme(confidence);
    const scoreClass = getConfidenceTextClass(confidence);

    const renderNutritionContent = () => {
      if (nutritionData === null) {
        return (
          <div style={commonStyles.loadingContainer}>
            <div className="spinner" style={commonStyles.smallSpinner}></div>
            <span>Menghasilkan informasi nutrisi...</span>
          </div>
        );
      }

      if (nutritionData === 'error') {
        return (
          <div style={commonStyles.warningContainer}>
            Gagal menghasilkan informasi nutrisi. Mode offline atau layanan tidak tersedia.
          </div>
        );
      }

      return nutritionData;
    };

    return (
      <div className="result-container">
        <div className={`result-card ${themeClass}`}>
          <div className="result-header">
            <div>
              <p className="result-label">Objek Terdeteksi</p>
              <h2 className="result-title">{detectionResult.className}</h2>
            </div>
            <div className="confidence-score">
              <span className={`score-val ${scoreClass}`}>{confidence}%</span>
              <span className="score-label">Kepercayaan</span>
            </div>
          </div>

          <div className="confidence-bar-bg">
            <div
              className="confidence-bar-fill"
              style={createProgressBarStyle(confidence)}
            ></div>
          </div>

          {detectionResult.performance && (
            <p className="ai-note">
              <Zap size={12} />
              <span>{formatPerformanceText(detectionResult.performance)}</span>
            </p>
          )}
        </div>

        <div className="nutrition-card">
          <div className="nutri-header">
            <Zap size={18} />
            <h3>Fakta Nutrisi</h3>
            <span className="nutri-header-badge">Dihasilkan AI</span>
          </div>

          <div className="nutri-content">
            <div className="nutri-text">
              {renderNutritionContent()}
            </div>
          </div>
        </div>

        <div className="disclaimer">
          <AlertCircle size={18} />
          <p className="disclaimer-text">
            <strong>Catatan:</strong> Nilai nutrisi adalah perkiraan berdasarkan data generik rata-rata.
            Selalu konsultasikan kemasan untuk nilai yang tepat jika tersedia.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="info-panel" aria-live="polite">
      {appState === 'idle' && renderIdleState()}
      {appState === 'analyzing' && renderAnalyzingState()}
      {appState === 'result' && renderResultState()}
    </section>
  );
}

export default InfoPanel;