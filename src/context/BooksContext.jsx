import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import initialBooks from "../data/books";

const STORAGE_KEY = "library-catalog.books.v1";

const BooksContext = createContext(null);

function loadBooks() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn("Could not read saved catalog, using mock data", err);
  }
  return initialBooks;
}

function booksReducer(state, action) {
  switch (action.type) {
    case "update":
      return state.map((b) =>
        b.id === action.book.id ? { ...b, ...action.book } : b,
      );
    case "reset":
      return initialBooks;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function BooksProvider({ children }) {
  const [books, dispatch] = useReducer(booksReducer, undefined, loadBooks);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {}
  }, [books]);

  const updateBook = useCallback(
    (book) => dispatch({ type: "update", book }),
    [],
  );
  const resetCatalog = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo(
    () => ({
      books,
      getBook: (id) => books.find((b) => b.id === id),
      updateBook,
      resetCatalog,
    }),
    [books, updateBook, resetCatalog],
  );

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used inside <BooksProvider>");
  return ctx;
}
