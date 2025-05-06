import { useState } from "react";
import "./styles.css";

export function ToggleSwitch({
  switchLength = "50px",
  labelLeft = "Left",
  labelRight = "Right",
  fontSize = "12px",
  onToggle = () => {},
  labelClassName = "", // Allow custom css to all elements
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
      className={`toggle-switch-wrapper ${containerClassName}`}
      style={{ fontSize }}
    >
      <span
        className={`toggle-label${labelClassName ? ` ${labelClassName}` : ""}`}
      >
        {labelLeft}
      </span>
      <div className="toggle-switch-container">
        <button
          className={`toggle-switch ${
            toggled ? "toggled" : ""
          } ${switchClassName}`}
          onClick={handleClick}
          style={{ "--switch-length": switchLength }}
        >
          <div className={`thumb ${thumbClassName}`} />
        </button>
      </div>
      <span
        className={`toggle-label${labelClassName ? ` ${labelClassName}` : ""}`}
      >
        {labelRight}
      </span>
    </div>
  );
}
