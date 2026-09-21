import { useState } from "react";
import { CopyIcon, CheckIcon, DownloadIcon } from "../Icons";
import "../McCopyAccordion/index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

/**
 * McCopyExtraAccordion
 *
 * Same as McCopyAccordion, plus an `extraActions` slot rendered after the
 * Copy / Download buttons. Use it for one-off actions (e.g. a "Download
 * input set (.zip)" button with app-specific logic) without forking the
 * whole accordion:
 *
 *   <McCopyExtraAccordion
 *     title="PW.in"
 *     text={pwText}
 *     filename="PW.in"
 *     extraActions={
 *       <button type="button" className="text-renderer__action" onClick={…}>
 *         Input set (.zip)
 *       </button>
 *     }
 *   />
 */
export function McCopyExtraAccordion({
  title,
  text,
  filename = "text.txt",
  open: openProp,
  onToggle,
  extraActions,
  className,
  classes = {},
  ...rest
}) {
  const [openInternal, setOpenInternal] = useState(true);
  const [copied, setCopied] = useState(false);

  const open = openProp !== undefined ? openProp : openInternal;

  const handleToggle = () => {
    const nextOpen = !open;

    if (onToggle) {
      onToggle(nextOpen);
    } else {
      setOpenInternal(nextOpen);
    }
  };

  const handleCopy = async (e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cx(
        "mc-acc",
        "text-renderer",
        open && "mc-acc--open",
        open && "text-renderer--open",
        className,
        classes.root,
      )}
      {...rest}
    >
      <div className={cx("text-renderer__header", classes.header)}>
        <button
          type="button"
          onClick={handleToggle}
          className={cx("text-renderer__toggle", classes.toggle)}
          aria-expanded={open}
        >
          <span className={cx("text-renderer__title", classes.title)}>
            {title}
          </span>

          <span
            className={cx(
              "mc-acc__chevron",
              "text-renderer__chevron",
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

        <div className={cx("text-renderer__actions", classes.actions)}>
          <button
            type="button"
            onClick={handleCopy}
            className={cx(
              "text-renderer__action",
              "text-renderer__copy-button",
              classes.action,
              classes.copyButton,
            )}
          >
            {copied ? (
              <CheckIcon className="text-renderer__action-icon" />
            ) : (
              <CopyIcon className="text-renderer__action-icon" />
            )}

            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className={cx(
              "text-renderer__action",
              "text-renderer__download-button",
              classes.action,
              classes.downloadButton,
            )}
          >
            <DownloadIcon className="text-renderer__action-icon" />
            <span>Download</span>
          </button>

          {extraActions}
        </div>
      </div>

      <div
        className={cx(
          "mc-acc__collapse",
          "text-renderer__content-wrapper",
          open && "mc-acc__collapse--open",
          classes.contentWrapper,
        )}
      >
        <div className="mc-acc__collapse-inner">
          <div
            className={cx(
              "mc-acc__panel",
              "text-renderer__content",
              classes.content,
            )}
          >
            <div className={cx("text-renderer__scroll", classes.scroll)}>
              <pre className={cx("text-renderer__pre", classes.pre)}>
                {text}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
