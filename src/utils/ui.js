import { TENSORFLOW_CONFIG } from './config.js';

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

export const getConfidenceTheme = (confidence) => {
  const { excellent, good } = TENSORFLOW_CONFIG.confidenceThresholds;
  if (confidence >= excellent) return 'theme-green';
  if (confidence >= good) return 'theme-yellow';
  return 'theme-red';
};

export const getConfidenceTextClass = (confidence) => {
  const { excellent, good } = TENSORFLOW_CONFIG.confidenceThresholds;
  if (confidence >= excellent) return 'text-green';
  if (confidence >= good) return 'text-yellow';
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
