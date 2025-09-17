export const theme = {
  colors: {
    pageBg: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    border: '#e5e7eb',
    text: '#0f172a',
    textMuted: '#475569',

    primary: '#2563eb',
    primaryText: '#ffffff',
    accent: '#6366f1',

    // Grid semantics
    start: '#dbeafe',
    end: '#dcfce7',
    current: '#fef3c7',
    inPath: '#fae8ff',
    checking: '#cffafe',
    processed: '#e2e8f0',
    unprocessed: '#ffffff',

    // Elements
    chipBg: '#eef2ff',
    chipBorder: '#c7d2fe',
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
}

export type Theme = typeof theme

