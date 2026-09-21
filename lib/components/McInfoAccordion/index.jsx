import { useState } from "react";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function Accordion({
  title,
  children,
  className = "",
  open: openProp,
  onToggle,
  classes = {},
  ...rest
}) {
  const [openInternal, setOpenInternal] = useState(true);
  const open = openProp !== undefined ? openProp : openInternal;

  const handleToggle = () => {
    const nextOpen = !open;

    if (onToggle) {
      onToggle(nextOpen);
    } else {
      setOpenInternal(nextOpen);
    }
  };

  return (
    <div
      className={cx(
        "mc-acc",
        "info-accordion",
        open && "mc-acc--open",
        open && "info-accordion--open",
        className,
        classes.root,
      )}
      {...rest}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cx("info-accordion__toggle", classes.toggle)}
        aria-expanded={open}
      >
        <span className={cx("info-accordion__title", classes.title)}>
          {title}
        </span>

        <span
          className={cx(
            "mc-acc__chevron",
            "info-accordion__chevron",
            open && "mc-acc__chevron--open",
            classes.chevron,
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mc-acc__chevron-icon"
            aria-hidden="true"
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={cx(
          "mc-acc__collapse",
          "info-accordion__content-wrapper",
          open && "mc-acc__collapse--open",
          classes.contentWrapper,
        )}
      >
        <div className="mc-acc__collapse-inner">
          <div
            className={cx(
              "mc-acc__panel",
              "info-accordion__content",
              classes.content,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
