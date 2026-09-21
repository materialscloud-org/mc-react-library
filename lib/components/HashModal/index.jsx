import { useEffect, useState } from "react";
import "./index.css";

const MODAL_HASH_PREFIX = "#";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function getHash() {
  const raw = typeof window !== "undefined" ? window.location.hash : "";
  return raw.startsWith(MODAL_HASH_PREFIX) ? raw.slice(1) : raw;
}

/**
 * A modal whose visibility is driven by a URL hash fragment, e.g. `#terms`.
 * Setting the hash to match `hash` (or `hash/#modal`) opens it; clearing the
 * hash (or navigating to a different hash) closes it. Passing `open`/`onClose`
 * overrides hash-driven control, e.g. for in-page toggles.
 */
export default function HashModal({
  hash,
  open: openProp,
  onClose,
  title,
  children,
  maxWidth = "48rem",
  className,
  classes = {},
  ...rest
}) {
  const [openInternal, setOpenInternal] = useState(() => getHash() === hash);

  useEffect(() => {
    if (openProp !== undefined) return;
    const syncFromHash = () => setOpenInternal(getHash() === hash);
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [hash, openProp]);

  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openInternal;

  const close = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (getHash() === hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    setOpenInternal(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, hash]);

  if (!open) return null;

  return (
    <div
      className={cx("hash-modal", className, classes.root)}
      onClick={close}
      {...rest}
    >
      <div
        className={cx("hash-modal__dialog", classes.dialog)}
        style={{ "--hash-modal-max-width": maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={cx("hash-modal__header", classes.header)}>
          <h2 className={cx("hash-modal__title", classes.title)}>{title}</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className={cx("hash-modal__close", classes.closeButton)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={cx("hash-modal__close-icon", classes.closeIcon)}
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className={cx("hash-modal__body", classes.body)}>{children}</div>
      </div>
    </div>
  );
}
