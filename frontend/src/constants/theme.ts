import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#7b1fa2' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});
