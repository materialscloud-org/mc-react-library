import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

/**
 * McHistoryList
 *
 * Presentational history list. Entries are managed by the consumer —
 * pair it with `createHistoryStore` from `mc-react-library` for a
 * localStorage-backed store with the same shape:
 *
 *   { id, fileName, date, format? }
 *
 * Renders nothing when `entries` is empty.
 */
export function McHistoryList({
  entries = [],
  onLoad,
  onDelete,
  onClear,
  title = "History",
  clearLabel = "Clear all",
  loadLabel = "Load",
  deleteLabel = "Delete",
  className,
  classes = {},
  ...rest
}) {
  if (entries.length === 0) return null;

  return (
    <div className={cx("mc-history", className, classes.root)} {...rest}>
      <div className={cx("mc-history__header", classes.header)}>
        <p className={cx("mc-history__title", classes.title)}>{title}</p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cx("mc-history__clear", classes.clearButton)}
          >
            {clearLabel}
          </button>
        )}
      </div>

      <ul className={cx("mc-history__list", classes.list)}>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={cx("mc-history__item", classes.item)}
          >
            <div className={cx("mc-history__details", classes.details)}>
              <p className={cx("mc-history__name", classes.fileName)}>
                {entry.fileName}
              </p>
              {entry.date && (
                <p className={cx("mc-history__date", classes.date)}>
                  {formatDate(entry.date)}
                </p>
              )}
            </div>

            {entry.format && (
              <span className={cx("mc-history__format", classes.format)}>
                {String(entry.format).toUpperCase()}
              </span>
            )}

            {onLoad && (
              <button
                type="button"
                onClick={() => onLoad(entry)}
                className={cx("mc-history__load", classes.loadButton)}
              >
                {loadLabel}
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                aria-label={`${deleteLabel} ${entry.fileName}`}
                className={cx("mc-history__delete", classes.deleteButton)}
              >
                {deleteLabel}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
