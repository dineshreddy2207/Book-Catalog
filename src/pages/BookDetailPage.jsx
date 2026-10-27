import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBooks } from '../context/BooksContext'
import { useAnnounce } from '../context/AnnouncerContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { formatYear } from '../utils/catalog'
import BookCover from '../components/BookCover'
import AvailabilityBadge from '../components/AvailabilityBadge'
import Modal from '../components/Modal'
import EditBookForm from '../components/EditBookForm'
import NotFoundPage from './NotFoundPage'

export default function BookDetailPage() {
  const { bookId } = useParams()
  const { getBook, updateBook } = useBooks()
  const announce = useAnnounce()
  const [isEditing, setIsEditing] = useState(false)

  const book = getBook(bookId)
  useDocumentTitle(book ? book.title : 'Book not found')

  if (!book) {
    return <NotFoundPage message="We couldn’t find that book. It may have been removed from the catalog." />
  }

  function handleSave(updated) {
    updateBook(updated)
    setIsEditing(false)
    announce(`Saved changes to ${updated.title}`)
  }

  const details = [
    ['Author', book.author],
    ['Genre', book.genre],
    ['Published', formatYear(book.year)],
    ['Pages', book.pages],
    ['Call number', book.callNumber],
    ['Copies owned', book.copies],
  ]

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap gap-2 text-stone-700">
          <li>
            <Link to="/" className="underline underline-offset-4 hover:text-stone-950">
              Catalog
            </Link>
            <span aria-hidden="true" className="ml-2">
              /
            </span>
          </li>
          <li aria-current="page" className="font-medium text-stone-900">
            {book.title}
          </li>
        </ol>
      </nav>

      <article className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="mx-auto w-48 md:w-full">
          <BookCover book={book} size="lg" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold leading-tight">{book.title}</h1>
          <p className="mt-2 text-lg text-stone-700">by {book.author}</p>

          <div className="mt-4">
            <AvailabilityBadge available={book.available} copies={book.copies} />
          </div>

          {book.description && <p className="mt-6 max-w-prose leading-relaxed">{book.description}</p>}

          <h2 className="mt-8 font-serif text-xl font-bold">Details</h2>
          <dl className="mt-3 grid max-w-lg grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-semibold text-stone-800">{label}</dt>
                <dd className="text-stone-700">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Edit book details
            </button>
            <Link
              to="/"
              className="rounded-md border border-stone-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
            >
              Back to catalog
            </Link>
          </div>
        </div>
      </article>

      <Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit “${book.title}”`}
        description="Changes are saved in this browser."
      >
        <EditBookForm book={book} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      </Modal>
    </>
  )
}
