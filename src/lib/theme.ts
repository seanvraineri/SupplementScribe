/**
 * Apple-inspired design tokens for SupplementScribe.
 */
export const colors = {
  // Apple-style blue gradient tones
  blue: {
    light: '#5AC8FA',
    default: '#007AFF',
    dark: '#0040DD',
  },
  // Neutral tones
  neutral: {
    50: '#F9F9F9',
    100: '#F3F3F3', 
    900: '#1D1D1F',
  },
};

export const fonts = {
  // Apple uses SF Pro - system-ui will render as SF Pro on Apple devices
  sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'system-ui', 'sans-serif'],
};

export const radii = {
  button: '980px', // Extremely rounded for Apple-style pill buttons
}; 