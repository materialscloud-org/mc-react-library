import styles from "./styles.module.css";

export const DoiBadge = ({ doi_id, doi, label = "DOI" }) => {
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
          href={`https://doi.org/10.24435/materialscloud:${doi_id}`}
          className={styles.doi_right}
          target="_blank"
        >
          {doi_text}
        </a>
      </span>
    </div>
  );
};
