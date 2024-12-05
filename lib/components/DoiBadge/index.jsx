import styles from "./styles.module.css";

export const DoiBadge = ({ doi_id, doi, label = "DOI", color = "#a2cbff" }) => {
  let doi_text = "";
  if (doi_id != null) {
    doi_text = `10.24435/materialscloud:${doi_id}`;
  } else {
    doi_text = doi;
  }

  return (
    <div className={styles.archive_doicitation}>
      <span className={styles.doi_badge}>
        <span className={styles.doi_left}>{label}</span>
        <a
          href={`https://doi.org/${doi_text}`}
          className={styles.doi_right}
          target="_blank"
          style={{ backgroundColor: color }}
        >
          {doi_text}
        </a>
      </span>
    </div>
  );
};
