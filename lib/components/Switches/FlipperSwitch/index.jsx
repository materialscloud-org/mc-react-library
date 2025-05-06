import { useState } from "react";
import "./styles.css";

export function FlipperSwitch({
  switchLength = "50px",
  labelLeft = "Left",
  labelRight = "Right",
  fontSize = "12px",
  onToggle = () => {},
  labelClassName = "", // Allow custom CSS to all elements
  containerClassName = "",
  switchClassName = "",
}) {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    const newState = !toggled;
    setToggled(newState);
    onToggle(newState);
  };

  return (
    <div
      className={`flipper-switch-wrapper ${containerClassName}`}
      style={{ fontSize }}
    >
      {/* Left label */}
      <span
        className={`flipper-label${labelClassName ? ` ${labelClassName}` : ""}`}
      >
        {labelLeft}
      </span>

      {/* Switch container */}
      <div className="flipper-switch-container">
        <button
          className={`flipper-switch ${
            toggled ? "toggled" : ""
          } ${switchClassName}`}
          onClick={handleClick}
          style={{ "--switch-length": switchLength }}
        ></button>
      </div>

      {/* Right label */}
      <span
        className={`flipper-label${labelClassName ? ` ${labelClassName}` : ""}`}
      >
        {labelRight}
      </span>
    </div>
  );
}
