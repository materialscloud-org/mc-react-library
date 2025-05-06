import { useState } from "react";
import "./styles.css";

export function ToggleSwitchBig({
  switchLength = "50px",
  onLabel = "1",
  offLabel = "2",
  fontSize = "12px", // default font size
}) {
  const [toggled, setToggled] = useState(false);

  return (
    <div className="toggle-switch-big-container">
      <button
        className={`toggle-switch-big ${toggled ? "toggled" : ""}`}
        onClick={() => setToggled(!toggled)}
        style={{ "--switch-length": switchLength }}
      >
        <div className="thumb" />
        <span
          className="toggle-switch-big-label"
          style={{ fontSize: fontSize }}
        >
          {toggled ? onLabel : offLabel}
        </span>
      </button>
    </div>
  );
}
