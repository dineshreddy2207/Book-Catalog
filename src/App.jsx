import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CatalogPage from './pages/CatalogPage'
import BookDetailPage from './pages/BookDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="books/:bookId" element={<BookDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
