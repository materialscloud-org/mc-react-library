import { fromJSON, toJSON } from "matsci-parse";

/**
 * The share-store document for a structure. Shared links hold the input
 * structure, not results: apps recompute on load, so links stay small and
 * keep working when the app changes. Any app can open any structure link.
 *
 *   <McShareButton store={shareStore} data={loaded} toDocument={toStructureShare} />
 */

const KIND = "structure";
const VERSION = 1;

/** `{ structure, fileName }` -> share document. */
export const toStructureShare = ({ structure, fileName }) => ({
  kind: KIND,
  version: VERSION,
  fileName,
  structure: toJSON(structure),
});

/** Share document -> `{ structure, fileName }`. Throws on other documents. */
export function fromStructureShare(doc) {
  if (doc?.kind !== KIND || !doc.structure) {
    throw new Error("this link does not hold a structure");
  }
  return { structure: fromJSON(doc.structure), fileName: doc.fileName };
}
