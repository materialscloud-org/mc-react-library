import { useEffect, useRef, useState } from "react";
import { DownloadIcon } from "../Icons";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const defaultFormats = [
  { format: "cif", label: "CIF" },
  { format: "xsf", label: "XSF" },
  { format: "xyz", label: "XYZ" },
];

export function StructDownloadButton({
  aiida_rest_url,
  uuid,
  download_formats,
  title = "Download",
  className,
  classes = {},
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const dl_url = `${aiida_rest_url}/nodes/${uuid}/download`;
  const downloadFormats = download_formats || defaultFormats;

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
      className={cx("struct-download", className, classes.root)}
      {...rest}
    >
      <button
        type="button"
        title={title}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cx("struct-download__button", classes.button)}
      >
        <DownloadIcon
          className={cx("struct-download__icon", classes.icon)}
        />
      </button>
      {open && (
        <div className={cx("struct-download__dropdown", classes.dropdown)}>
          <ul
            role="menu"
            className={cx("struct-download__menu", classes.menu)}
          >
            {downloadFormats.map(({ format, label }) => (
              <li
                key={format}
                role="none"
                className={cx(classes.menuItem)}
                onClick={() => setOpen(false)}
              >
                <a
                  role="menuitem"
                  href={`${dl_url}?download_format=${format}`}
                  className={cx(classes.menuLink)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
