/**
 * Client for the Materials Cloud key-value store, which backs share links of
 * the form `https://<app>/?<id>`. Every function takes the store's root URL
 * and defaults to the production store:
 *
 *   const id = await uploadShare(doc, kvUrl);   // POST {kvUrl}/api/shares
 *   const doc = await fetchShare(id, kvUrl);    // GET  {kvUrl}/api/shares/<id>
 *
 * Links expire after 30 days and only resolve against the store they were
 * made in. The store only accepts requests from allow-listed origins
 * (localhost:5173 works against the dev store).
 */

export const KV_STORE_URL = "https://kv-store.materialscloud.org";

const SHORT_ID = /^[A-Za-z0-9_-]+$/;

const sharesUrl = (kvUrl) =>
  `${(kvUrl || KV_STORE_URL).replace(/\/+$/, "")}/api/shares`;

const appUrl = () => window.location.origin + window.location.pathname;

/** The share id in the address bar (`?<id>`: a bare key without a value). */
export function shareIdFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const entry = [...params].find(
    ([key, value]) => value === "" && SHORT_ID.test(key),
  );
  return entry ? entry[0] : null;
}

/** App link that opens the share `id`. */
export const shareLinkFor = (id) => `${appUrl()}?${id}`;

/** Point the address bar at the share `id`, or back at the plain app URL. */
export function syncAddressBar(id) {
  const link = id ? shareLinkFor(id) : appUrl();
  window.history.replaceState(null, "", link + window.location.hash);
}

/** Upload a JSON document; resolves to its share id. */
export async function uploadShare(doc, kvUrl) {
  const res = await fetch(sharesUrl(kvUrl), {
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
export async function fetchShare(id, kvUrl) {
  const res = await fetch(`${sharesUrl(kvUrl)}/${encodeURIComponent(id)}`);
  if (res.status === 404) {
    throw new Error("shared data not found (links expire after 30 days)");
  }
  if (!res.ok) throw new Error(`could not load shared data (${res.status})`);
  return res.json();
}
