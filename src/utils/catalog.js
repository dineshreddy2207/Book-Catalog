export const PAGE_SIZE = 8;

export const SORT_OPTIONS = [
  { value: "title", label: "Title (A–Z)" },
  { value: "author", label: "Author (A–Z)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export function filterBooks(
  books,
  { query = "", genre = "", status = "" } = {},
) {
  const q = query.trim().toLowerCase();

  return books.filter((book) => {
    if (
      q &&
      !book.title.toLowerCase().includes(q) &&
      !book.author.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (genre && book.genre !== genre) return false;
    if (status === "available" && book.available === 0) return false;
    if (status === "out" && book.available > 0) return false;
    return true;
  });
}

const sortableTitle = (title) => title.replace(/^(the|a|an)\s+/i, "");
const lastName = (author) => author.split(/,|&/)[0].trim().split(" ").pop();

export function sortBooks(books, sortBy = "title") {
  const sorted = [...books];
  switch (sortBy) {
    case "author":
      return sorted.sort((a, b) =>
        lastName(a.author).localeCompare(lastName(b.author)),
      );
    case "newest":
      return sorted.sort((a, b) => b.year - a.year);
    case "oldest":
      return sorted.sort((a, b) => a.year - b.year);
    case "title":
    default:
      return sorted.sort((a, b) =>
        sortableTitle(a.title).localeCompare(sortableTitle(b.title)),
      );
  }
}

export function paginate(items, page = 1, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    // 1-based, for "Showing 9–16 of 34"
    from: items.length ? start + 1 : 0,
    to: Math.min(start + pageSize, items.length),
    total: items.length,
  };
}

export function formatYear(year) {
  return year < 1000 ? `${year} AD` : String(year);
}
