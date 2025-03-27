import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Certifique-se de usar o nome correto

import App from './App.jsx'

createRoot(document.getElementById('root')).render(



     <StrictMode>
      <Router>
        <App />
      </Router>,
     </StrictMode>
)
