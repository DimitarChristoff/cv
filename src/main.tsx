import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import './index.css'

const themeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#d6a200',
    },
    secondary: {
      main: '#2266af',
    },
    background: {
      default: '#1c1b1b',
      paper: 'rgba(30,30,30,0.72)',
    },
    text: {
      primary: '#ffecb3',
      secondary: '#ad7e0f',
    },
  },
  typography: {
    fontSize: 12,
  },
}
const darkTheme = createTheme(themeOptions)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
      <div className="personal-bg" />
    </ThemeProvider>
  </React.StrictMode>,
)
