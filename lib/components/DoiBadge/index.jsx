import styles from "./styles.module.css";

export function DoiBadge(props) {
  return (
    <div className={styles.archive_doicitation}>
      <span className={styles.doi_badge}>
        <span className={styles.doi_left}>DOI</span>
        <a
          href={`https://doi.org/10.24435/materialscloud:${props.doi_id}`}
          className={styles.doi_right}
          target="_blank"
        >
          {`10.24435/materialscloud:${props.doi_id}`}
        </a>
      </span>
    </div>
  );
}
