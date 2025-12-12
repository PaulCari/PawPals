import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 1. Importamos aquí

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos la App con BrowserRouter aquí */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)