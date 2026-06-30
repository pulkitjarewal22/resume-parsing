import { createTheme, type ThemeOptions } from '@mui/material/styles';

const commonComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: { textTransform: 'none', borderRadius: 10, fontWeight: 600, padding: '8px 20px' },
      contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.25)' } },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 12, boxShadow: 'none', border: '1px solid', transition: 'all 0.2s ease-in-out', backgroundImage: 'none' },
    },
  },
  MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } } },
  MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } } },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  MuiTableCell: { styleOverrides: { head: { fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' } } },
  MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 8, fontSize: '0.75rem' } } },
  MuiDrawer: { styleOverrides: { paper: { border: 'none' } } },
};

const typography: ThemeOptions['typography'] = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 800, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, letterSpacing: '-0.01em' },
  h3: { fontWeight: 700, letterSpacing: '-0.01em' },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500, fontSize: '0.8rem' },
  body2: { fontSize: '0.85rem' },
  button: { fontWeight: 600 },
};

// ── Deep dark observability theme (always dark) ──────────────
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#ffffff' },
    secondary: { main: '#f472b6', light: '#f9a8d4', dark: '#ec4899' },
    background: { default: '#0a0e1a', paper: '#0f1629' },
    text: { primary: '#e2e8f0', secondary: '#8892a4' },
    success: { main: '#10b981', light: '#064e3b' },
    warning: { main: '#f59e0b', light: '#78350f' },
    error: { main: '#ef4444', light: '#7f1d1d' },
    info: { main: '#3b82f6', light: '#1e3a5f' },
    divider: 'rgba(99,102,241,0.12)',
  },
  typography,
  shape: { borderRadius: 10 },
  components: {
    ...commonComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiCard?.styleOverrides?.root,
          borderColor: 'rgba(99,102,241,0.15)',
          background: '#0f1629',
          '&:hover': { borderColor: 'rgba(99,102,241,0.28)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: 'rgba(99,102,241,0.05) !important' },
        },
      },
    },
  },
});

// Keep lightTheme alias pointing to dark for backward compat
export const lightTheme = darkTheme;
