/**
 * Framework-free client for the Materials Cloud key-value store, which backs
 * Share links of the form `https://<app>/?<id>`.
 *
 * Opt-in: `createShareStore()` with no store returns a disabled store, so
 * apps can pass an env var straight through and sharing stays off when it
 * is unset:
 *
 *   const shareStore = createShareStore(import.meta.env.VITE_SHARE_STORE);
 *   shareStore.enabled; // false unless VITE_SHARE_STORE is "dev" / "production" / a URL
 *
 * The store's API:
 *   POST {store}/api/shares       JSON body -> { id }   (413 if too large)
 *   GET  {store}/api/shares/<id>  -> the JSON body      (404 once expired)
 *
 * Links only resolve against the store they were created in, and the store
 * only accepts requests from allow-listed origins (localhost:5173 works
 * against the dev store).
 */

export const SHARE_STORES = {
  dev: "https://kv-store.dev.materialscloud.org",
  production: "https://kv-store.materialscloud.org",
};

const SHORT_ID = /^[A-Za-z0-9_-]+$/;

const appUrl = () => window.location.origin + window.location.pathname;

export function createShareStore(store) {
  const url = !store
    ? null
    : (SHARE_STORES[store] ?? (/^https?:\/\//.test(store) ? store : null));
  if (store && !url) {
    throw new Error(
      `Unknown share store '${store}' (expected: ${Object.keys(SHARE_STORES).join(", ")} or a URL)`,
    );
  }
  const enabled = url !== null;
  const name = enabled ? (SHARE_STORES[store] ? store : url) : null;
  const sharesUrl = enabled ? `${url.replace(/\/+$/, "")}/api/shares` : null;

  /** The share id in the address bar (`?<id>`: a bare key without a value). */
  function idFromLocation() {
    if (!enabled) return null;
    const params = new URLSearchParams(window.location.search);
    const entry = [...params].find(
      ([key, value]) => value === "" && SHORT_ID.test(key),
    );
    return entry ? entry[0] : null;
  }

  /** App link that opens the share `id`. */
  const linkFor = (id) => `${appUrl()}?${id}`;

  /** Point the address bar at the share `id`, or back at the plain app URL. */
  function syncAddressBar(id) {
    if (!enabled) return;
    const link = id ? linkFor(id) : appUrl();
    window.history.replaceState(null, "", link + window.location.hash);
  }

  /** Upload a JSON document; resolves to its share id. */
  async function upload(doc) {
    if (!enabled) throw new Error("sharing is not enabled");
    const res = await fetch(sharesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    if (res.status === 413) throw new Error("this data is too large to share");
    if (!res.ok) throw new Error(`share service returned ${res.status}`);
    const { id } = await res.json();
    return id;
  }

  /** Fetch the JSON document shared as `id`. */
  async function fetchShare(id) {
    if (!enabled) throw new Error("sharing is not enabled");
    const res = await fetch(`${sharesUrl}/${encodeURIComponent(id)}`);
    if (res.status === 404) {
      throw new Error("shared data not found (links expire after 30 days)");
    }
    if (!res.ok) throw new Error(`could not load shared data (${res.status})`);
    return res.json();
  }

  return {
    enabled,
    name,
    idFromLocation,
    linkFor,
    syncAddressBar,
    upload,
    fetch: fetchShare,
  };
}
