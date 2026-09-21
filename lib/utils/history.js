/**
 * Framework-free localStorage history store.
 *
 * Both apps kept an identical copy differing only in the storage key;
 * this factory unifies them. Works outside React (and safely no-ops
 * where localStorage is unavailable).
 *
 *   const structures = createHistoryStore("myapp.parsedStructures");
 *   const [history, setHistory] = useState(() => structures.load());
 *   setHistory(structures.add({ id, fileName, format, date, structure }));
 */
export function createHistoryStore(storageKey, { maxEntries = 50 } = {}) {
  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function save(entries) {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(entries.slice(0, maxEntries)),
      );
      return true;
    } catch {
      return false;
    }
  }

  function add(entry) {
    const next = [entry, ...load().filter((e) => e.id !== entry.id)].slice(
      0,
      maxEntries,
    );
    save(next);
    return next;
  }

  function remove(id) {
    const next = load().filter((e) => e.id !== id);
    save(next);
    return next;
  }

  function clear() {
    save([]);
    return [];
  }

  return { load, save, add, remove, clear };
}
