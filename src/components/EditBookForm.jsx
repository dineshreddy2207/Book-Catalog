import { useEffect, useRef, useState } from "react";
import { GENRES } from "../data/books";

const CURRENT_YEAR = new Date().getFullYear();

const FIELD_LABELS = {
  title: "Title",
  author: "Author",
  genre: "Genre",
  year: "Year published",
  copies: "Copies owned",
  available: "Copies available",
  description: "Description",
};

const isWholeNumber = (v) => /^\d+$/.test(v.trim());

export function validateBook(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = "Enter a title";
  else if (values.title.trim().length > 150)
    errors.title = "Title must be 150 characters or fewer";

  if (!values.author.trim()) errors.author = "Enter an author";

  if (!values.genre) errors.genre = "Select a genre";

  if (!values.year.trim()) {
    errors.year = "Enter the year the book was published";
  } else if (!isWholeNumber(values.year)) {
    errors.year = "Year must be a number, like 1851";
  } else if (Number(values.year) > CURRENT_YEAR) {
    errors.year = "Year can’t be in the future";
  }

  if (!isWholeNumber(values.copies)) {
    errors.copies = "Copies owned must be a whole number";
  } else if (Number(values.copies) > 99) {
    errors.copies = "Copies owned must be 99 or fewer";
  }

  if (!isWholeNumber(values.available)) {
    errors.available = "Copies available must be a whole number";
  } else if (
    !errors.copies &&
    Number(values.available) > Number(values.copies)
  ) {
    errors.available = "Copies available can’t be more than copies owned";
  }

  if (values.description.length > 500) {
    errors.description = "Description must be 500 characters or fewer";
  }

  return errors;
}

const inputClass = (hasError) =>
  `mt-1 block w-full rounded-md border bg-white px-3 py-2 text-stone-900 ${
    hasError ? "border-red-700 border-2" : "border-stone-400"
  }`;

function Field({ id, label, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-stone-800"
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-stone-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-red-700">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      )}
      {children({
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
    </div>
  );
}

export default function EditBookForm({ book, onSave, onCancel }) {
  const [values, setValues] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    year: String(book.year),
    copies: String(book.copies),
    available: String(book.available),
    description: book.description ?? "",
  });
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const summaryRef = useRef(null);

  const errorEntries = Object.entries(errors);

  // after a failed submit, move focus to the error summary so it gets read out
  useEffect(() => {
    if (submitCount > 0 && errorEntries.length > 0) {
      summaryRef.current?.focus();
    }
  }, [submitCount]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateBook(values);
    setErrors(nextErrors);
    setSubmitCount((c) => c + 1);

    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      ...book,
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre,
      year: Number(values.year),
      copies: Number(values.copies),
      available: Number(values.available),
      description: values.description.trim(),
    });
  }

  function focusField(e, name) {
    e.preventDefault();
    document.getElementById(`edit-${name}`)?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          aria-labelledby="error-summary-title"
          className="rounded-md border-2 border-red-700 bg-red-50 p-4"
        >
          <h3 id="error-summary-title" className="font-semibold text-red-800">
            There{" "}
            {errorEntries.length === 1
              ? "is 1 problem"
              : `are ${errorEntries.length} problems`}{" "}
            with this form
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a
                  href={`#edit-${name}`}
                  onClick={(e) => focusField(e, name)}
                  className="text-red-800 underline underline-offset-2"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field id="edit-title" label={FIELD_LABELS.title} error={errors.title}>
        {(aria) => (
          <input
            id="edit-title"
            name="title"
            value={values.title}
            onChange={handleChange}
            required
            data-autofocus
            className={inputClass(errors.title)}
            {...aria}
          />
        )}
      </Field>

      <Field id="edit-author" label={FIELD_LABELS.author} error={errors.author}>
        {(aria) => (
          <input
            id="edit-author"
            name="author"
            value={values.author}
            onChange={handleChange}
            required
            className={inputClass(errors.author)}
            {...aria}
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="edit-genre" label={FIELD_LABELS.genre} error={errors.genre}>
          {(aria) => (
            <select
              id="edit-genre"
              name="genre"
              value={values.genre}
              onChange={handleChange}
              required
              className={inputClass(errors.genre)}
              {...aria}
            >
              <option value="">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          )}
        </Field>

        <Field
          id="edit-year"
          label={FIELD_LABELS.year}
          hint="For example, 1851"
          error={errors.year}
        >
          {(aria) => (
            <input
              id="edit-year"
              name="year"
              inputMode="numeric"
              value={values.year}
              onChange={handleChange}
              required
              className={inputClass(errors.year)}
              {...aria}
            />
          )}
        </Field>

        <Field
          id="edit-copies"
          label={FIELD_LABELS.copies}
          error={errors.copies}
        >
          {(aria) => (
            <input
              id="edit-copies"
              name="copies"
              inputMode="numeric"
              value={values.copies}
              onChange={handleChange}
              required
              className={inputClass(errors.copies)}
              {...aria}
            />
          )}
        </Field>

        <Field
          id="edit-available"
          label={FIELD_LABELS.available}
          error={errors.available}
        >
          {(aria) => (
            <input
              id="edit-available"
              name="available"
              inputMode="numeric"
              value={values.available}
              onChange={handleChange}
              required
              className={inputClass(errors.available)}
              {...aria}
            />
          )}
        </Field>
      </div>

      <Field
        id="edit-description"
        label={`${FIELD_LABELS.description} (optional)`}
        hint={`${500 - values.description.length} characters left`}
        error={errors.description}
      >
        {(aria) => (
          <textarea
            id="edit-description"
            name="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            className={inputClass(errors.description)}
            {...aria}
          />
        )}
      </Field>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-stone-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
