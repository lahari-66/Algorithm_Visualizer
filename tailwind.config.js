/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1120',
        panel: '#0f172a',
        accent: '#22d3ee',
        accent2: '#a855f7',
        glow: 'rgba(56, 189, 248, 0.4)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(56, 189, 248, 0.25)',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Sora', 'Segoe UI', 'sans-serif'],
        body: ['DM Sans', 'Outfit', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Cascadia Code', 'monospace'],
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateX(-30%)', opacity: 0 },
          '40%': { opacity: 0.5 },
          '100%': { transform: 'translateX(130%)', opacity: 0 },
        },
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 114, 182, 0)' },
          '50%': { boxShadow: '0 0 0 6px rgba(244, 114, 182, 0.25)' },
        },
      },
      animation: {
        floaty: 'floaty 8s ease-in-out infinite',
        scanline: 'scanline 4s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
