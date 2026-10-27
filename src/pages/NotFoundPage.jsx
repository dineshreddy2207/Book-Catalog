import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFoundPage({ message = 'The page you’re looking for doesn’t exist.' }) {
  useDocumentTitle('Page not found')

  return (
    <div className="py-12 text-center">
      <h1 className="font-serif text-3xl font-bold">Not found</h1>
      <p className="mt-3 text-stone-700">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
      >
        Go to the catalog
      </Link>
    </div>
  )
}
