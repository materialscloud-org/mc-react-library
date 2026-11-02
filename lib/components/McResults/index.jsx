import { useEffect, useLayoutEffect, useRef } from "react";

// Scroll only when the top of the results is below this fraction of the
// window: further up, they are in view already (or being read, scrolled into)
const SCROLL_BELOW = 2 / 3;

/**
 * McResults
 *
 * Wraps an app's results so that the page does not jump about when they
 * change:
 *
 * - while `busy` (new results on the way), what is shown is dimmed and the
 *   height it had is kept, so that the page does not shrink, and the browser
 *   does not scroll up, if the app clears its results meanwhile;
 * - a new `resultKey` (anything that changes with each result, e.g. the result
 *   itself) scrolls the results into view, if they are further down the page.
 *
 *   <McResults busy={computing} resultKey={result}>
 *     {result && <Results result={result} />}
 *   </McResults>
 *
 * Spinners and errors go outside: they would be dimmed too.
 */
export function McResults({ busy = false, resultKey, children, style, ...rest }) {
  const ref = useRef(null);
  const height = useRef(0); // the height of the results last shown
  const scrolledTo = useRef(null);

  // Before painting: the content may be gone already in this render
  useLayoutEffect(() => {
    const element = ref.current;
    element.style.minHeight = busy && height.current ? `${height.current}px` : "";
    if (busy || typeof ResizeObserver === "undefined") return;
    height.current = element.offsetHeight;
    const observer = new ResizeObserver(() => {
      height.current = element.offsetHeight;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [busy]);

  useEffect(() => {
    if (busy || !resultKey || resultKey === scrolledTo.current) return;
    scrolledTo.current = resultKey;
    const element = ref.current;
    if (element.getBoundingClientRect().top < window.innerHeight * SCROLL_BELOW) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [busy, resultKey]);

  return (
    <div
      ref={ref}
      aria-busy={busy}
      style={{
        opacity: busy ? 0.5 : 1,
        pointerEvents: busy ? "none" : undefined,
        transition: "opacity 150ms",
        scrollMarginTop: "1rem",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
