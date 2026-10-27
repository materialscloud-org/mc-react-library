import { useState } from "react";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const IDLE = { status: "idle" };

/**
 * McShareButton
 *
 * Share button backed by a `createShareStore` store. Uploads
 * `toDocument(data)` on click, puts the link in the address bar, copies it
 * to the clipboard and shows it. Renders nothing when the store is
 * disabled or there is no `data`.
 *
 *   const shareStore = createShareStore(import.meta.env.VITE_SHARE_STORE);
 *
 *   <McShareButton
 *     store={shareStore}
 *     data={loaded}                    // { structure, fileName }
 *     toDocument={toStructureShare}
 *     shareId={loaded?.shareId}        // set when opened from a share link
 *   />
 *
 * Data that already has a `shareId` (it was opened from a link) is shared
 * by that link instead of being uploaded again. A new `data` resets it.
 */
export function McShareButton({
  store,
  data,
  toDocument = (d) => d,
  shareId,
  onShared,
  label = "Share",
  busyLabel = "Sharing…",
  className,
  classes = {},
  ...rest
}) {
  const [state, setState] = useState(IDLE);
  // Reset when the data changes (adjusting state during render, see
  // https://react.dev/learn/you-might-not-need-an-effect).
  const [sharedData, setSharedData] = useState(data);
  if (data !== sharedData) {
    setSharedData(data);
    setState(IDLE);
  }

  if (!store?.enabled || !data) return null;

  const handleShare = async () => {
    setState({ status: "uploading" });
    try {
      const id = state.id ?? shareId ?? (await store.upload(toDocument(data)));
      store.syncAddressBar(id);
      if (id !== shareId) onShared?.(id);
      const link = store.linkFor(id);
      let copied = false;
      try {
        await navigator.clipboard.writeText(link);
        copied = true;
      } catch {
        /* no clipboard access; the link is still shown */
      }
      setState({ status: "done", id, link, copied });
    } catch (err) {
      setState({ status: "error", message: err?.message ?? String(err) });
    }
  };

  return (
    <div className={cx("mc-share", className, classes.root)} {...rest}>
      <button
        type="button"
        onClick={handleShare}
        disabled={state.status === "uploading"}
        className={cx("mc-share__button", classes.button)}
      >
        {state.status === "uploading" ? busyLabel : label}
      </button>
      {state.status === "done" && (
        <span className={cx("mc-share__link", classes.link)}>
          {state.copied ? "Link copied: " : "Link: "}
          <a href={state.link}>{state.link}</a>
        </span>
      )}
      {state.status === "error" && (
        <span className={cx("mc-share__error", classes.error)}>
          Sharing failed: {state.message}
        </span>
      )}
      {store.name !== "production" && (
        <span className={cx("mc-share__store", classes.store)}>
          ({store.name} share store)
        </span>
      )}
    </div>
  );
}
