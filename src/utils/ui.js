export const commonStyles = {
  errorContainer: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: 'var(--danger-bg)',
    border: '1px solid var(--danger-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--danger)',
    fontSize: '0.875rem'
  },

  warningContainer: {
    color: 'var(--warning-text)',
    fontStyle: 'italic'
  },

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  smallSpinner: {
    width: '1rem',
    height: '1rem',
    marginBottom: 0
  },

  errorToast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'var(--danger-bg)',
    color: 'var(--danger)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--danger-border)',
    maxWidth: '300px',
    zIndex: 1000,
    boxShadow: 'var(--shadow-lg)'
  },

  closeButton: {
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

/**
 * @review
 * Threshold di sini (80 dan 60) tidak sesuai dengan yang didefinisikan
 * di UI_CONFIG.confidenceThresholds (excellent: 90, good: 80).
 *
 * Artinya ada dua sumber kebenaran yang saling bertentangan:
 * - config.js bilang: >= 90 excellent, >= 80 good
 * - ui.js bilang: >= 80 green, >= 60 yellow
 *
 * Siswa akan bingung mana yang benar.
 *
 * Selain itu, UI_CONFIG sendiri diekspor dari config.js tapi tidak di-import
 * di mana pun dalam codebase. Jadi definisi threshold di config itu dead code.
 *
 * Sebaiknya: import UI_CONFIG di sini dan gunakan nilainya,
 * atau hapus UI_CONFIG.confidenceThresholds kalau memang tidak dipakai.
 */
export const getConfidenceTheme = (confidence) => {
  if (confidence >= 80) return 'theme-green';
  if (confidence >= 60) return 'theme-yellow';
  return 'theme-red';
};

export const getConfidenceTextClass = (confidence) => {
  if (confidence >= 80) return 'text-green';
  if (confidence >= 60) return 'text-yellow';
  return 'text-red';
};

export const createProgressBarStyle = (percentage, duration = '1s') => ({
  width: `${percentage}%`,
  transition: `width ${duration} ease-out`
});

export const formatPerformanceText = (performance) => {
  if (!performance) return '';
  return `${performance.backend.toUpperCase()}: ${performance.operationTime}ms (avg: ${performance.averageTime}ms)`;
};
