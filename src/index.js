import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

let temaInstitucional = createTheme();
temaInstitucional = createTheme(temaInstitucional, {
  palette: {
    ...temaInstitucional.palette,
    primary: {
      main: "#f7a600"
    },
    grey: {
      main: "#f2f2f2",
      dark: "#e2e2e2",
      contrastText: "#686767"
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#f2f2f2"
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={temaInstitucional}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
