import { Link } from 'react-router-dom'
import BookCover from './BookCover'
import AvailabilityBadge from './AvailabilityBadge'
import { formatYear } from '../utils/catalog'

export default function BookCard({ book, onEdit }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      {/* cover is decorative here, the title right below says the same thing */}
      <Link to={`/books/${book.id}`} tabIndex={-1} aria-hidden="true" className="mx-auto w-32">
        <BookCover book={book} />
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-serif text-lg font-bold leading-snug">
          <Link
            to={`/books/${book.id}`}
            className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900"
          >
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-stone-700">{book.author}</p>
        <p className="mt-1 text-sm text-stone-600">
          {book.genre} · {formatYear(book.year)}
        </p>

        <div className="mt-3">
          <AvailabilityBadge available={book.available} copies={book.copies} />
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="rounded-md border border-stone-400 px-3 py-1.5 text-sm font-medium text-stone-800 hover:bg-stone-100"
          >
            Edit<span className="sr-only"> {book.title}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
