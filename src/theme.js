export const THEMES = {
  dark: {
    name: 'Dark',
    icon: '🌙',
    vars: {
      '--bg': '#0b1120',
      '--surface': '#0f172a',
      '--surface2': '#1e293b',
      '--border': 'rgba(148,163,184,0.18)',
      '--text': '#e2e8f0',
      '--muted': '#94a3b8',
      '--accent': '#38bdf8',
      '--accent2': '#14b8a6',
      '--glow': 'rgba(56,189,248,0.35)',
      '--bar-default': 'linear-gradient(180deg,#3b82f6,#1d4ed8)',
      '--compare': '#fbbf24',
      '--swap': '#fb7185',
      '--sorted': '#34d399',
      '--found': '#38bdf8',
    },
  },
  light: {
    name: 'Light',
    icon: '☀️',
    vars: {
      '--bg': '#f1f5f9',
      '--surface': '#ffffff',
      '--surface2': '#f8fafc',
      '--border': 'rgba(100,116,139,0.2)',
      '--text': '#0f172a',
      '--muted': '#64748b',
      '--accent': '#0284c7',
      '--accent2': '#0d9488',
      '--glow': 'rgba(2,132,199,0.25)',
      '--bar-default': 'linear-gradient(180deg,#60a5fa,#2563eb)',
      '--compare': '#d97706',
      '--swap': '#e11d48',
      '--sorted': '#059669',
      '--found': '#0284c7',
    },
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    vars: {
      '--bg': '#020c1b',
      '--surface': '#0a192f',
      '--surface2': '#112240',
      '--border': 'rgba(100,255,218,0.15)',
      '--text': '#ccd6f6',
      '--muted': '#8892b0',
      '--accent': '#64ffda',
      '--accent2': '#57cbff',
      '--glow': 'rgba(100,255,218,0.3)',
      '--bar-default': 'linear-gradient(180deg,#57cbff,#1a6fa8)',
      '--compare': '#ffd700',
      '--swap': '#ff6b9d',
      '--sorted': '#64ffda',
      '--found': '#57cbff',
    },
  },
  matrix: {
    name: 'Matrix',
    icon: '💻',
    vars: {
      '--bg': '#000000',
      '--surface': '#0a0a0a',
      '--surface2': '#111111',
      '--border': 'rgba(0,255,65,0.2)',
      '--text': '#00ff41',
      '--muted': '#008f11',
      '--accent': '#00ff41',
      '--accent2': '#00b300',
      '--glow': 'rgba(0,255,65,0.4)',
      '--bar-default': 'linear-gradient(180deg,#00ff41,#007a1f)',
      '--compare': '#ffff00',
      '--swap': '#ff0000',
      '--sorted': '#00ff41',
      '--found': '#00ffff',
    },
  },
}

export const applyTheme = (themeKey) => {
  const theme = THEMES[themeKey]
  if (!theme) return
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })
  root.setAttribute('data-theme', themeKey)
}
