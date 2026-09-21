import { useRef, useState } from "react";
import { UploadIcon } from "../Icons";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

/**
 * McDropzone
 *
 * Presentational file dropzone. Reports the chosen file via `onFile` —
 * parsing / uploading stays with the consumer (so no parser dependency
 * leaks into the library).
 *
 *   <McDropzone
 *     accept=".cif,.xyz"
 *     fileName={file?.name}
 *     onFile={(file) => …}
 *     hint="CIF, XYZ and POSCAR files"
 *   />
 */
export function McDropzone({
  onFile,
  accept,
  fileName,
  disabled = false,
  title = "Drop your file here",
  subtitle,
  replaceHint = "Click or drop another file to replace it",
  hint,
  className,
  classes = {},
  ...rest
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || disabled) return;
    onFile?.(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className={cx("mc-dropzone", className, classes.root)} {...rest}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className={cx(classes.input)}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
        hidden
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cx(
          "mc-dropzone__button",
          dragging && "mc-dropzone__button--dragging",
          classes.button,
        )}
      >
        <span className={cx("mc-dropzone__icon", classes.icon)}>
          <UploadIcon className="mc-dropzone__icon-svg" />
        </span>

        {fileName ? (
          <>
            <p className={cx("mc-dropzone__title", classes.fileName)}>
              {fileName}
            </p>
            <p className={cx("mc-dropzone__subtitle", classes.subtitle)}>
              {replaceHint}
            </p>
          </>
        ) : (
          <>
            <p className={cx("mc-dropzone__title", classes.title)}>{title}</p>
            <p className={cx("mc-dropzone__subtitle", classes.subtitle)}>
              {subtitle ?? (
                <>
                  or{" "}
                  <span className="mc-dropzone__browse">browse your files</span>
                </>
              )}
            </p>
            {hint && (
              <p className={cx("mc-dropzone__hint", classes.hint)}>{hint}</p>
            )}
          </>
        )}
      </button>
    </div>
  );
}
