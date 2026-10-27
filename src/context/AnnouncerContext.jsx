import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AnnouncerContext = createContext(() => {});

export function AnnouncerProvider({ children }) {
  const [message, setMessage] = useState("");
  const timers = useRef([]);

  const announce = useCallback((text) => {
    timers.current.forEach(clearTimeout);
    setMessage("");
    timers.current = [
      setTimeout(() => setMessage(text), 100),
      setTimeout(() => setMessage(""), 6000),
    ];
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      >
        {message && (
          <p className="rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            {message}
          </p>
        )}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnounce() {
  return useContext(AnnouncerContext);
}
