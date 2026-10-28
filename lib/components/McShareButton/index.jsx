import { useState } from "react";
import { KV_STORE_URL, shareLinkFor, syncAddressBar, uploadShare } from "../../utils/kvStore";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const IDLE = { status: "idle" };

// Icons drawn inline, so the library needs no icon font.
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="3.5" r="2" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="12" cy="12.5" r="2" />
    <path d="M5.8 7 10.2 4.5M5.8 9l4.4 2.5" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="5" width="8.5" height="9.5" rx="1.5" />
    <path d="M3 11V3a1.5 1.5 0 0 1 1.5-1.5H10" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // e.g. no clipboard access; the link is still shown
  }
}

/**
 * McShareButton
 *
 * Share button backed by the Materials Cloud kv-store. On click it uploads
 * `toDocument(data)`, puts the `?<id>` link in the address bar and copies
 * it. The link then appears to the left of the button, in the same row, so
 * nothing below moves. Renders nothing without `data`.
 *
 *   <McShareButton
 *     data={loaded}                    // { structure, fileName }
 *     toDocument={toStructureShare}
 *     shareId={loaded?.shareId}        // set when opened from a share link
 *     kvUrl={KV_URL}                   // optional; defaults to KV_STORE_URL
 *   />
 *
 * Data that already has a `shareId` (it was opened from a link) is shared
 * by that link instead of being uploaded again. A new `data` resets it.
 *
 * By default the row is right-aligned. To lay it out yourself (e.g. next to
 * other buttons), pass a function as children; `error` and `result` are
 * null until there is one, and `button` turns into a Copy button once the
 * link exists:
 *
 *   <McShareButton data={data}>
 *     {({ button, error, result }) => (
 *       <div className="my-row">{error}{result}{button}<DownloadButton /></div>
 *     )}
 *   </McShareButton>
 */
export function McShareButton({
  data,
  toDocument = (d) => d,
  kvUrl = KV_STORE_URL,
  shareId,
  onShared,
  label = "Share",
  busyLabel = "Sharing…",
  children,
  className,
  classes = {},
  ...rest
}) {
  // The state belongs to the data it was made for; new data starts idle.
  const [saved, setState] = useState({ ...IDLE, data });
  const state = saved.data === data ? saved : IDLE;

  if (!data) return null;

  const note = `Anyone with this link can view the data. It is stored on ${
    new URL(kvUrl || KV_STORE_URL).host
  } and expires after 30 days.`;

  const handleShare = async () => {
    const set = (next) => setState({ ...next, data });
    set({ status: "uploading" });
    try {
      const id = state.id ?? shareId ?? (await uploadShare(toDocument(data), kvUrl));
      syncAddressBar(id);
      if (id !== shareId) onShared?.(id);
      const link = shareLinkFor(id);
      set({ status: "done", id, link, copied: await copyToClipboard(link) });
    } catch (err) {
      set({ status: "error", message: err?.message ?? String(err) });
    }
  };

  const copyAgain = async () =>
    setState({ ...state, data, copied: await copyToClipboard(state.link) });

  const button =
    state.status === "done" ? (
      <button
        type="button"
        onClick={copyAgain}
        title={note}
        className={cx("mc-share__button", classes.button)}
      >
        {state.copied ? <CheckIcon /> : <CopyIcon />}
        {state.copied ? "Copied" : "Copy link"}
      </button>
    ) : (
      <button
        type="button"
        onClick={handleShare}
        disabled={state.status === "uploading"}
        title={note}
        className={cx("mc-share__button", classes.button)}
      >
        <ShareIcon />
        {state.status === "uploading" ? busyLabel : label}
      </button>
    );

  const error =
    state.status === "error" ? (
      <span role="alert" className={cx("mc-share__error", classes.error)}>
        Sharing failed: {state.message}
      </span>
    ) : null;

  const result =
    state.status === "done" ? (
      <input
        readOnly
        value={state.link}
        onFocus={(e) => e.target.select()}
        aria-label="Share link"
        title={note}
        className={cx("mc-share__input", classes.result)}
      />
    ) : null;

  if (typeof children === "function") {
    return children({ button, error, result, status: state.status });
  }

  return (
    <div className={cx("mc-share", className, classes.root)} {...rest}>
      {error}
      {result}
      {button}
    </div>
  );
}
