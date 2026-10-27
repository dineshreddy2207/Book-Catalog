import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BooksProvider } from './context/BooksContext'
import { AnnouncerProvider } from './context/AnnouncerContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BooksProvider>
        <AnnouncerProvider>
          <App />
        </AnnouncerProvider>
      </BooksProvider>
    </BrowserRouter>
  </StrictMode>
)
