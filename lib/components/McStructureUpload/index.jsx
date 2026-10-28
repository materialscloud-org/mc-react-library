import { useEffect, useMemo, useState } from "react";
import { fromJSON, parseStructure, toJSON } from "matsci-parse";

import { McDropzone } from "../McDropzone";
import { McHistoryList } from "../McHistoryList";
import {
  RemoteStructureLoader,
  shortHashForUrl,
} from "../RemoteStructureLoader";
import { createHistoryStore } from "../../utils/history";
import { fetchShare, shareIdFromLocation, syncAddressBar } from "../../utils/kvStore";
import { fromStructureShare } from "../../utils/structureShare";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const baseName = (url) => url.split(/[?#]/)[0].split("/").pop();

/**
 * McStructureUpload
 *
 * Everything an app needs to get a crystal structure from the user: a file
 * dropzone (any format matsci-parse's `parseStructure` reads), example
 * structures, a localStorage history, `?fromURL=` links (OPTIMADE / AiiDA,
 * via RemoteStructureLoader) and `?<id>` share links from the kv-store at
 * `kvUrl` (default: the production store).
 *
 *   <McStructureUpload
 *     historyKey="myapp.parsedStructures"
 *     examples={[{ label: "Si", url: "/examples/Si.cif" }]}
 *     validate={(s) => { if (isDisordered(s)) throw new Error("…"); }}
 *     onStructureParsed={({ format, structure, fileName, shareId }) => …}
 *   />
 *
 * `validate(structure)` throws an Error to reject a structure; its message
 * is shown to the user. `shareId` is only set for structures opened from a
 * share link; pass it on to McShareButton.
 *
 * Examples are `{ label, url, fileName?, family? }`; `fileName` defaults to
 * the URL's last segment, and examples with a `family` are grouped.
 */
export function McStructureUpload({
  onStructureParsed,
  validate,
  historyKey,
  historyTitle = "Previously uploaded structures",
  examples = [],
  examplesTitle = "Otherwise, pick an example",
  label = "Upload a crystal structure",
  title = "Drop your crystal structure here",
  accept = ".cif,.xyz,.vasp,.poscar,.xsf,.in,.pwi",
  hint = "CIF, XYZ, POSCAR, XSF and Quantum ESPRESSO files",
  kvUrl,
  className,
  classes = {},
  ...rest
}) {
  const historyStore = useMemo(
    () => (historyKey ? createHistoryStore(historyKey) : null),
    [historyKey],
  );
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(null); // what is loading, for the spinner
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => historyStore?.load() ?? []);
  const [exampleLoading, setExampleLoading] = useState(null);

  // A ?fromURL= structure already in the history (matched by the short hash
  // of its URL) is loaded from there instead of being fetched again.
  const [remoteFromHistory] = useState(() => {
    try {
      const url = new URLSearchParams(window.location.search).get("fromURL");
      const hash = url && shortHashForUrl(url);
      return (hash && historyStore?.load().find((e) => e.fileName === hash)) || null;
    } catch {
      return null;
    }
  });

  // Links (?fromURL=, ?<id>) are remembered once, under their file name.
  const addToHistory = ({ fileName, format, structure }, { unique = false } = {}) => {
    if (!historyStore) return;
    if (unique && historyStore.load().some((e) => e.fileName === fileName)) return;
    setHistory(
      historyStore.add({
        id: crypto.randomUUID(),
        fileName,
        format,
        date: new Date().toISOString(),
        structure: toJSON(structure),
      }),
    );
  };

  // Validate and hand over a structure. Returns false if it was rejected.
  const handOver = (parsed, { remember = true, fromLink = false } = {}) => {
    setError(null);
    try {
      validate?.(parsed.structure);
    } catch (err) {
      setError(err?.message ?? String(err));
      return false;
    }
    // A structure that did not come from a link makes the old link stale.
    if (!fromLink) syncAddressBar(null);
    onStructureParsed?.(parsed);
    if (remember) addToHistory(parsed, { unique: fromLink });
    return true;
  };

  // On page load: a ?fromURL= structure from history, or a ?<id> share link.
  useEffect(() => {
    if (remoteFromHistory) {
      handOver(
        {
          format: remoteFromHistory.format,
          structure: fromJSON(remoteFromHistory.structure),
          fileName: remoteFromHistory.fileName,
        },
        { remember: false, fromLink: true },
      );
    }
    const id = shareIdFromLocation();
    if (!id) return;
    let cancelled = false;
    setBusy("shared structure");
    fetchShare(id, kvUrl)
      .then((doc) => {
        if (cancelled) return;
        const { structure, fileName } = fromStructureShare(doc);
        handOver(
          { format: "shared", structure, fileName: fileName ?? id, shareId: id },
          { fromLink: true },
        );
      })
      .catch((err) => {
        if (!cancelled) setError(`Loading shared structure failed: ${err.message}`);
      })
      .finally(() => {
        if (!cancelled) setBusy(null);
      });
    return () => {
      cancelled = true;
    };
    // Runs once, on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setError(null);
    setBusy(selectedFile.name);
    try {
      const text = await selectedFile.text();
      const { format, structure } = parseStructure(text, {
        fileName: selectedFile.name,
      });
      handOver({ format, structure, fileName: selectedFile.name });
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(null);
    }
  };

  const handleRemoteLoaded = ({ structure, format, fileName }) => {
    // Remembered under the URL's short hash, see remoteFromHistory.
    handOver({ format, structure, fileName }, { fromLink: true });
  };

  const handleLoadFromHistory = (entry) => {
    try {
      handOver(
        {
          format: entry.format,
          structure: fromJSON(entry.structure),
          fileName: entry.fileName,
        },
        { remember: false },
      );
    } catch (err) {
      setError(err?.message ?? String(err));
    }
  };

  const handleLoadExample = async (example) => {
    setError(null);
    setExampleLoading(example.url);
    try {
      const res = await fetch(example.url);
      if (!res.ok) throw new Error(`Failed to load example (${res.status})`);
      const fileName = example.fileName ?? baseName(example.url);
      const { format, structure } = parseStructure(await res.text(), {
        fileName,
      });
      handOver({ format, structure, fileName }, { remember: false });
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setExampleLoading(null);
    }
  };

  const families = examples.some((e) => e.family)
    ? Object.entries(
        examples.reduce((groups, example) => {
          (groups[example.family ?? "Other"] ||= []).push(example);
          return groups;
        }, {}),
      )
    : null;
  const option = (example) => (
    <option key={example.url} value={example.url}>
      {example.label}
    </option>
  );

  return (
    <div className={cx("mc-structure-upload", className, classes.root)} {...rest}>
      <label className={cx("mc-structure-upload__label", classes.label)}>
        {label}
      </label>

      <McDropzone
        accept={accept}
        fileName={file?.name}
        onFile={handleFile}
        title={title}
        hint={hint}
      />

      {busy && (
        <p className={cx("mc-structure-upload__status", classes.status)}>
          <span className="mc-structure-upload__spinner" />
          Loading {busy}…
        </p>
      )}

      {error && (
        <p className={cx("mc-structure-upload__error", classes.error)}>
          {error}
        </p>
      )}

      <RemoteStructureLoader
        autoLoad={!remoteFromHistory}
        onLoaded={handleRemoteLoaded}
        onError={(message) => setError(message)}
      />

      {examples.length > 0 && (
        <div className={cx("mc-structure-upload__examples", classes.examples)}>
          <p className="mc-structure-upload__examples-title">{examplesTitle}</p>
          <select
            value=""
            onChange={(e) => {
              const example = examples.find((x) => x.url === e.target.value);
              if (example) handleLoadExample(example);
            }}
            disabled={exampleLoading !== null}
            className={cx("mc-structure-upload__select", classes.select)}
          >
            <option value="">
              {exampleLoading ? "Loading example…" : "Select an example…"}
            </option>
            {families
              ? families.map(([family, members]) => (
                  <optgroup key={family} label={family}>
                    {members.map(option)}
                  </optgroup>
                ))
              : examples.map(option)}
          </select>
        </div>
      )}

      {history.length > 0 && (
        <McHistoryList
          className={cx("mc-structure-upload__history", classes.history)}
          title={historyTitle}
          entries={history}
          onLoad={handleLoadFromHistory}
          onDelete={(id) => setHistory(historyStore.remove(id))}
          onClear={() => setHistory(historyStore.clear())}
        />
      )}
    </div>
  );
}
