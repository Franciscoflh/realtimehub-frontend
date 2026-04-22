/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0c0e11',
        surface: '#111316',
        surfaceDim: '#16181b',
        surfaceLow: '#1a1c1f',
        surfaceHigh: '#282a2d',
        surfaceHighest: '#33363a',
        outline: 'rgba(179, 188, 204, 0.18)',
        outlineGhost: 'rgba(179, 188, 204, 0.15)',
        primary: '#b1c5ff',
        primaryContainer: '#598cff',
        onPrimaryContainer: '#08152f',
        onSurface: '#eef2ff',
        onSurfaceMuted: '#9fa8bd',
        onSurfaceSoft: '#6d7486',
        danger: '#ff7b91',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 12px 32px rgba(0, 44, 113, 0.15)',
        bubble: '0 10px 28px rgba(0, 0, 0, 0.22)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #b1c5ff 0%, #598cff 100%)',
        'hero-radial': 'radial-gradient(circle at top, rgba(89, 140, 255, 0.18), transparent 35%)',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.92)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        messageIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s ease-in-out infinite',
        messageIn: 'messageIn 220ms ease-out',
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [],
};
