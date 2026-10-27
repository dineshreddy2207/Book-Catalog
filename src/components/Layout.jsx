import { useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import { useAnnounce } from "../context/AnnouncerContext";

export default function Layout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const { resetCatalog } = useBooks();
  const announce = useAnnounce();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname]);

  function skipToContent(e) {
    e.preventDefault();
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView();
  }

  function handleReset() {
    resetCatalog();
    announce("Catalog reset to the original sample data");
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <a
        href="#main-content"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow"
      >
        Skip to main content
      </a>

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900"
          >
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8">
              <rect width="32" height="32" rx="6" fill="#7c2d12" />
              <path d="M9 8h6v16H9zM17 8h6v16h-6z" fill="#fef3c7" />
            </svg>
            Riverside Branch Library
          </Link>
          <nav aria-label="Main">
            <ul className="flex gap-4 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="text-stone-800 underline-offset-4 hover:underline"
                >
                  Catalog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none"
      >
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm text-stone-600">
          <p>Demo project. Data is stored in your browser only.</p>
          <button
            type="button"
            onClick={handleReset}
            className="underline underline-offset-4 hover:text-stone-900"
          >
            Reset sample data
          </button>
        </div>
      </footer>
    </div>
  );
}
