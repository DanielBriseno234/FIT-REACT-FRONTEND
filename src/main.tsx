import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToasterConfig } from './components/Utiles/Alerts/ToasterConfig.tsx';

import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <ThemeProvider>
      <App />
      <ToasterConfig />
    </ThemeProvider>

  </StrictMode>,
)
