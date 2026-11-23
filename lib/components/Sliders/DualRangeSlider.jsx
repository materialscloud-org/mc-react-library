import { useId, useState } from "react";
import styles from "./styles.module.css";

/**
 * DualRangeSlider: a [low, high] range. Two native range inputs on one track
 * (filled between the thumbs) and a number box at each end to type a bound
 * (applied on Enter or blur, rounded to `step`, clamped). The track fills the
 * row; the label is optional.
 *
 *   <DualRangeSlider label="Density" value={[lo, hi]} min={0} max={1200} step={1} onChange={setRange} />
 *
 * onChange receives a new [low, high] with low <= high.
 */
export function DualRangeSlider({ label, value, min, max, step, onChange, className = "" }) {
  const id = useId();
  const [lo, hi] = value;
  const pct = (v) => ((v - min) / (max - min)) * 100;
  // when the thumbs meet, the one that can still move must be on top
  const loOnTop = lo > (min + max) / 2;
  return (
    <div className={`${styles.root} ${className}`}>
      {label && (
        <label id={id} className={styles.label}>
          {label}
        </label>
      )}
      <NumberBox label="minimum" value={lo} min={min} max={hi} step={step} onChange={(v) => onChange([v, hi])} />
      <div role="group" aria-labelledby={label ? id : undefined} className={styles.track}>
        <div
          className={styles.fill}
          style={{
            background: `linear-gradient(to right, var(--mc-slider-track) ${pct(lo)}%, var(--mc-slider-color) ${pct(lo)}%, var(--mc-slider-color) ${pct(hi)}%, var(--mc-slider-track) ${pct(hi)}%)`,
          }}
        />
        <input
          type="range"
          aria-label="minimum"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className={`${styles.dualInput} ${loOnTop ? styles.above : styles.below}`}
        />
        <input
          type="range"
          aria-label="maximum"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className={`${styles.dualInput} ${styles.below}`}
        />
      </div>
      <NumberBox label="maximum" value={hi} min={lo} max={max} step={step} onChange={(v) => onChange([lo, v])} />
    </div>
  );
}

/** a typed bound: kept as text while editing, applied on Enter or blur */
function NumberBox({ label, value, min, max, step, onChange }) {
  const [draft, setDraft] = useState(null);
  const text = draft ?? String(value);
  const commit = () => {
    setDraft(null);
    const v = Number(text);
    if (text.trim() === "" || !Number.isFinite(v)) return; // back to the value
    // toFixed: 0.1-steps would leave float noise (0.30000000000000004)
    const rounded = step ? Number((Math.round(v / step) * step).toFixed(10)) : v;
    const clamped = Math.min(max, Math.max(min, rounded));
    if (clamped !== value) onChange(clamped);
  };
  return (
    <input
      type="number"
      aria-label={`${label} value`}
      className={styles.number}
      value={text}
      min={min}
      max={max}
      step={step}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
    />
  );
}
