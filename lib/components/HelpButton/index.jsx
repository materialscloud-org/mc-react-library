import { useEffect, useRef, useState } from "react";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function isBootstrapPopoverElement(node) {
  const type = node?.type;
  const name =
    type?.displayName || type?.name || (typeof type === "string" ? type : "");
  return (
    typeof name === "string" && name.toLowerCase().includes("popover")
  );
}

function unwrapPopover(node) {
  let current = node;
  // Unwrap legacy react-bootstrap <Popover><Popover.Body>...</Popover.Body></Popover>
  // down to its plain content, so we don't end up with Bootstrap markup
  // (and double padding) inside our own styled container.
  // Plain elements like <div> are left untouched.
  while (
    current &&
    typeof current === "object" &&
    "props" in current &&
    isBootstrapPopoverElement(current)
  ) {
    current = current.props.children;
  }
  return current;
}

export function HelpButton({
  popover,
  content,
  placement = "top",
  className,
  classes = {},
  children = "?",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const popoverNode = content !== undefined ? content : popover;
  const hasPopover = popoverNode != null;

  useEffect(() => {
    if (!open || !hasPopover) return;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, hasPopover]);

  if (!hasPopover) {
    return (
      <div className={cx("help-button", className, classes.root)} {...rest}>
        <span className={cx("help-button__trigger", classes.trigger)}>
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cx("help-button", className, classes.root)}
      {...rest}
    >
      <button
        type="button"
        className={cx("help-button__trigger", classes.trigger)}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      {open && (
        <div
          role="dialog"
          data-placement={placement}
          className={cx("help-button__popover", classes.popover)}
        >
          {unwrapPopover(popoverNode)}
        </div>
      )}
    </div>
  );
}
