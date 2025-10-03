// components/theme.js
import { createTheme } from '@mui/material/styles';

// ejemplo básico; adapta tu paleta/typography/overrides aquí
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export default theme;