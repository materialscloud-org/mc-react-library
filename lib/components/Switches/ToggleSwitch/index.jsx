import { useState } from "react";
import styles from "./styles.module.css";

export function ToggleSwitch({
  switchLength = "50px",
  labelLeft = "Left",
  labelRight = "Right",
  fontSize = "12px",
  onToggle = () => {},
  labelClassName = "",
  containerClassName = "",
  switchClassName = "",
  thumbClassName = "",
}) {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    const newState = !toggled;
    setToggled(newState);
    onToggle(newState);
  };

  return (
    <div
      className={`${styles.toggleSwitchWrapper} ${containerClassName}`}
      style={{ fontSize }}
    >
      <span className={`${styles.toggleLabel} ${labelClassName}`}>
        {labelLeft}
      </span>
      <div className={styles.toggleSwitchContainer}>
        <button
          className={`${styles.toggleSwitch} ${
            toggled ? styles.toggled : ""
          } ${switchClassName}`}
          onClick={handleClick}
          style={{ "--switch-length": switchLength }}
        >
          <div className={`${styles.thumb} ${thumbClassName}`} />
        </button>
      </div>
      <span className={`${styles.toggleLabel} ${labelClassName}`}>
        {labelRight}
      </span>
    </div>
  );
}
