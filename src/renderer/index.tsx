import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';

const domNode = document.getElementById('root');

if (domNode) {
  const theme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const root = createRoot(domNode);
  root.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}
