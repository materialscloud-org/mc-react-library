import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export function ToggleSwitch({
  switchLength = "50px",
  labelLeft = "Left",
  labelRight = "Right",
  fontSize = "12px",
  toggled: controlledToggled,
  onToggle = () => {},
  labelClassName = "",
  containerClassName = "",
  switchClassName = "",
  thumbClassName = "",
}) {
  const [internalToggled, setInternalToggled] = useState(false);
  const isControlled = controlledToggled !== undefined;
  const toggled = isControlled ? controlledToggled : internalToggled;

  useEffect(() => {
    if (isControlled) {
      setInternalToggled(controlledToggled);
    }
  }, [controlledToggled, isControlled]);

  const handleClick = () => {
    const newState = !toggled;

    if (!isControlled) {
      setInternalToggled(newState);
    }

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
          type="button"
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
