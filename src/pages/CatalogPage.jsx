import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import { useAnnounce } from "../context/AnnouncerContext";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { filterBooks, sortBooks, paginate } from "../utils/catalog";
import CatalogFilters from "../components/CatalogFilters";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import EditBookForm from "../components/EditBookForm";

export default function CatalogPage() {
  useDocumentTitle("Browse the catalog");

  const { books, updateBook } = useBooks();
  const announce = useAnnounce();

  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "title";
  const page = Number(searchParams.get("page")) || 1;

  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(searchText, 300);

  const [editingBook, setEditingBook] = useState(null);
  const resultsHeadingRef = useRef(null);

  function updateParams(changes, { resetPage = true, replace = false } = {}) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === "" || value == null) next.delete(key);
          else next.set(key, value);
        });
        if (resetPage) next.delete("page");
        return next;
      },
      { replace },
    );
  }

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedSearch !== current) {
      updateParams({ q: debouncedSearch }, { replace: true });
    }
  }, [debouncedSearch]);

  const results = useMemo(() => {
    const filtered = filterBooks(books, {
      query: debouncedSearch,
      genre,
      status,
    });
    return paginate(sortBooks(filtered, sort), page);
  }, [books, debouncedSearch, genre, status, sort, page]);

  function handleFilterChange(name, value) {
    if (name === "search") {
      setSearchText(value);
      return;
    }
    updateParams({ [name]: value });
  }

  function clearFilters() {
    setSearchText("");
    updateParams({ q: "", genre: "", status: "" });
  }

  function goToPage(next) {
    updateParams(
      { page: next === 1 ? "" : String(next) },
      { resetPage: false },
    );
    resultsHeadingRef.current?.focus();
    window.scrollTo({ top: resultsHeadingRef.current?.offsetTop ?? 0 });
  }

  function handleSave(updated) {
    updateBook(updated);
    setEditingBook(null);
    announce(`Saved changes to ${updated.title}`);
  }

  return (
    <>
      <h1 className="font-serif text-3xl font-bold">Browse the catalog</h1>
      <p className="mt-2 max-w-2xl text-stone-700">
        Search by title or author, narrow things down by genre, or check what’s
        on the shelf right now.
      </p>

      <div className="mt-6">
        <CatalogFilters
          search={searchText}
          genre={genre}
          status={status}
          sort={sort}
          onChange={handleFilterChange}
          onClear={clearFilters}
        />
      </div>

      <section aria-labelledby="results-heading" className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="results-heading"
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="font-serif text-2xl font-bold focus:outline-none"
          >
            Results
          </h2>
          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-stone-700"
          >
            {results.total === 0
              ? "No books found"
              : `Showing ${results.from}–${results.to} of ${results.total} books` +
                (results.totalPages > 1
                  ? `, page ${results.page} of ${results.totalPages}`
                  : "")}
          </p>
        </div>

        {results.total === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="font-medium">Nothing matches those filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.items.map((book) => (
              <li key={book.id}>
                <BookCard book={book} onEdit={setEditingBook} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={results.page}
          totalPages={results.totalPages}
          onPageChange={goToPage}
        />
      </section>

      <Modal
        open={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        title={editingBook ? `Edit “${editingBook.title}”` : ""}
        description="Changes are saved in this browser."
      >
        {editingBook && (
          <EditBookForm
            book={editingBook}
            onSave={handleSave}
            onCancel={() => setEditingBook(null)}
          />
        )}
      </Modal>
    </>
  );
}
