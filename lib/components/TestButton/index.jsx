import styles from "./styles.module.css";

export function TestButton({ className = "", ...rest }) {
  return (
    <button className={`${styles.button} ${className}`} {...rest}>
      TEST
    </button>
  );
}
