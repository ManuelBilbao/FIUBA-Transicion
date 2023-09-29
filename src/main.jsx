import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css'

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={temaInstitucional}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
