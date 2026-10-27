# Library Catalog

A small React app for browsing and managing a branch library's book catalog.
Built mainly as an accessibility exercise: everything should work with a
keyboard only and with a screen reader.

There's no backend. The catalog comes from `src/data/books.js` and edits are
saved to `localStorage`, so they stick around after a refresh ("Reset sample
data" in the footer puts things back).

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

`npm run build` makes a production build in `dist/`.

## Stack

- React 18 + Vite
- React Router 6
- Tailwind CSS 4
- No component library, no image assets. Book covers are SVGs generated
  from each book's colors (`src/components/BookCover.jsx`)

## Features

- Search by title or author (debounced)
- Filter by genre and availability, sort by title / author / year
- Filters and page number are kept in the URL, so results can be bookmarked
  and the back button works
- Pagination (8 per page)
- Book detail page
- Edit a book in a modal with form validation

## Project structure

```
src/
  components/   UI pieces (BookCard, Modal, EditBookForm, Pagination...)
  context/      BooksContext (catalog data + edits), AnnouncerContext (live region)
  data/         mock data
  hooks/        useDebouncedValue, useDocumentTitle
  pages/        CatalogPage, BookDetailPage, NotFoundPage
  utils/        filtering / sorting / pagination helpers
```

## Accessibility notes

Aiming for WCAG 2.1 AA / Section 508.

- **Skip link** to the main content, landmarks (`header`, `nav`, `main`, `footer`)
  and a logical heading order on every page
- **Page titles** change on every route (2.4.2), and focus moves to `<main>` after
  navigation so screen reader users aren't left on a link that no longer exists
- **Live regions**: the "Showing 1–8 of 34 books" text is `aria-live="polite"`, so
  filter changes are announced without moving focus. Saves are announced through
  one shared status region that also shows a visible toast
- **Modal** uses the native `<dialog>` element with `showModal()`. That gives a real
  focus trap, makes the background inert and handles Escape. Focus goes to the first
  field on open and back to the button that opened it on close
- **Forms**: visible labels on everything, hints and errors linked with
  `aria-describedby`, `aria-invalid` on bad fields, and an error summary at the top
  that gets focus on submit and links to each field (GOV.UK pattern). Numeric fields
  use `inputMode="numeric"` instead of `type="number"`
- **Pagination** is a labelled `nav`, current page marked with `aria-current="page"`,
  and focus moves to the results heading when the page changes
- **Not relying on color**: availability is always written out ("2 of 3 available",
  "All copies checked out"), the colored dot is just extra
- **Links/buttons have unique names**: "Edit" buttons include the book title as
  visually hidden text
- **Focus ring**: one 3px high-contrast outline everywhere (`:focus-visible`)
- Text colors were picked to meet 4.5:1 contrast. Covers are marked `aria-hidden`
  since the title is always shown next to them
- Respects `prefers-reduced-motion`

### How I check it

- Keyboard only: Tab / Shift+Tab through every page, open and close the modal with
  Enter and Escape, submit the form with errors
- Screen reader: NVDA + Firefox on Windows, VoiceOver + Safari on Mac
- axe DevTools and Lighthouse accessibility audit
- Zoom to 200% and a 320px wide window (reflow, 1.4.10)

## Things I'd do next

- Sync the search box when you use the back button (see TODO in `CatalogPage.jsx`)
- Add/delete books, not just edit
- Unit tests with Vitest + Testing Library, and `jest-axe`
- Hook it up to a real API (ASP.NET Core Web API would be the plan)
