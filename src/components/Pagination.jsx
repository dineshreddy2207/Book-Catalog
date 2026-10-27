function getPageList(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap-" + p);
    result.push(p);
  });
  return result;
}

const baseBtn =
  "min-w-10 rounded-md border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            className={`${baseBtn} border-stone-300 bg-white hover:bg-stone-100`}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <span aria-hidden="true">← </span>Previous
          </button>
        </li>

        {getPageList(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <li key={p} aria-hidden="true" className="px-1 text-stone-500">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`${baseBtn} ${
                  p === page
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white hover:bg-stone-100"
                }`}
              >
                <span className="sr-only">Page </span>
                {p}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className={`${baseBtn} border-stone-300 bg-white hover:bg-stone-100`}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next<span aria-hidden="true"> →</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
