import { useId } from "react";
import styles from "./styles.module.css";

/**
 * RangeSlider: one value, with its label and the value beside the track.
 *
 *   <RangeSlider label="Scale" value={v} min={0} max={10} step={0.5} onChange={setV} />
 *
 * `format` formats the shown value; `className` goes on the outer row.
 */
export function RangeSlider({ label, value, min, max, step, onChange, format = (v) => v, className = "" }) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className={`${styles.root} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--mc-slider-color) ${percent}%, var(--mc-slider-track) ${percent}%)`,
        }}
        className={styles.input}
      />
      <span className={styles.value}>{format(value)}</span>
    </div>
  );
}
