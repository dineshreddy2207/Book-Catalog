import { GENRES } from '../data/books'
import { SORT_OPTIONS } from '../utils/catalog'

const fieldClass =
  'mt-1 block w-full rounded-md border border-stone-400 bg-white px-3 py-2 text-stone-900'

export default function CatalogFilters({ search, genre, status, sort, onChange, onClear }) {
  const hasFilters = Boolean(search || genre || status)

  return (
    <form
      role="search"
      aria-label="Catalog"
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <div>
        <label htmlFor="search" className="text-sm font-semibold text-stone-800">
          Search title or author
        </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="e.g. Dickens"
          autoComplete="off"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="genre" className="text-sm font-semibold text-stone-800">
          Genre
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => onChange('genre', e.target.value)}
          className={fieldClass}
        >
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="text-sm font-semibold text-stone-800">
          Availability
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => onChange('status', e.target.value)}
          className={fieldClass}
        >
          <option value="">Any</option>
          <option value="available">On the shelf</option>
          <option value="out">Checked out</option>
        </select>
      </div>

      <div>
        <label htmlFor="sort" className="text-sm font-semibold text-stone-800">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onChange('sort', e.target.value)}
          className={fieldClass}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasFilters}
        className="rounded-md px-3 py-2 text-sm font-medium text-stone-800 underline underline-offset-4 hover:text-stone-950 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
      >
        Clear filters
      </button>
    </form>
  )
}
