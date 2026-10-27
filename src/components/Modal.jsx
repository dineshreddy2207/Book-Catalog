import { useEffect, useId, useRef } from "react";

export default function Modal({ open, onClose, title, description, children }) {
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      lastFocused.current = document.activeElement;
      dialog.showModal();
      document.body.style.overflow = "hidden";

      const target = dialog.querySelector("[data-autofocus]");
      if (target) target.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) return;
    document.body.style.overflow = "";
    if (lastFocused.current && document.contains(lastFocused.current)) {
      lastFocused.current.focus();
    }
    lastFocused.current = null;
  }, [open]);

  function handleCancel(e) {
    e.preventDefault();
    onClose();
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-lg rounded-lg bg-white p-0 text-stone-900 shadow-xl backdrop:bg-stone-950/60"
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-serif text-xl font-bold">
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-sm text-stone-600">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              <span className="sr-only">Close dialog</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
