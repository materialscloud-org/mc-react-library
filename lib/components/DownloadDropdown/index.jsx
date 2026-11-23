import { useEffect, useRef, useState } from "react";
import { DownloadIcon } from "../Icons";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function saveText(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * DownloadDropdown: a download icon with a menu of files. Each entry of
 * `download_formats` is either
 * - { label, href }: a link (e.g. a server's download URL), or
 * - { label, filename, content }: saved in the browser; `content` is the text,
 *   or a function returning it (called on click, e.g. a matsci-parse writer).
 *
 *   <DownloadDropdown download_formats={[
 *     { label: "CIF", filename: "GaAs.cif", content: () => toCIF(structure) },
 *     { label: "XSF", href: `${api}/nodes/${uuid}/download?download_format=xsf` },
 *   ]} />
 */
export function DownloadDropdown({
  download_formats = [],
  title = "Download",
  className,
  classes = {},
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);


  useEffect(() => {
    if (!open) return;

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
  }, [open ]);

  return (
    <div
      ref={rootRef}
      className={cx("download-dropdown", className, classes.root)}
      {...rest}
    >
      <button
        type="button"
        title={title}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cx("download-dropdown__button", classes.button)}
      >
        <DownloadIcon
          className={cx("download-dropdown__icon", classes.icon)}
        />
      </button>
      {open && (
        <div className={cx("download-dropdown__dropdown", classes.dropdown)}>
          <ul
            role="menu"
            className={cx("download-dropdown__menu", classes.menu)}
          >
            {download_formats.map(({ label, href, filename, content }) => (
              <li
                key={label}
                role="none"
                className={cx(classes.menuItem)}
                onClick={() => setOpen(false)}
              >
                {content !== undefined ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      saveText(
                        typeof content === "function" ? content() : content,
                        filename,
                      )
                    }
                    className={cx(classes.menuLink)}
                  >
                    {label}
                  </button>
                ) : (
                  <a
                    role="menuitem"
                    href={href}
                    className={cx(classes.menuLink)}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
