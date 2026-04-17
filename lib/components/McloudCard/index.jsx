import styles from "./styles.module.css";

/**
 * McloudCard
 *
 * A flexible container component for grouping related content with optional
 * header and footer sections.
 *
 * Provides a consistent visual container with built-in styling and optional
 * scroll behavior when content exceeds a defined height.
 *
 * @component
 *
 * @param {React.ReactNode} children
 * Main content of the card.
 *
 * @param {React.ReactNode} [header]
 * Optional header section displayed at the top of the card.
 *
 * @param {React.ReactNode} [footer]
 * Optional footer section displayed at the bottom of the card.
 *
 * @param {string} [className=""]
 * Additional CSS class names applied to the root card element.
 * Can be used to override or extend styling.
 *
 * @param {string} [childrenClassName=""]
 * Additional class names applied to the content container.
 *
 * @param {React.CSSProperties} [style]
 * Inline styles applied to the root card element.
 *
 * @param {boolean} [scrollable=false]
 * Enables vertical scrolling when content exceeds maxHeight.
 *
 * @param {number} [maxHeight]
 * Maximum height of the card when scrollable is enabled.
 * Defaults to 400px if not provided.
 *
 * @returns {JSX.Element}
 */
export function McloudCard({
  children,
  header,
  footer,
  className = "",
  childrenClassName = "",
  style,
  scrollable = false,
  maxHeight,
}) {
  return (
    <div
      className={`${styles.card} ${className}`}
      style={{
        ...style,
        ...(scrollable
          ? {
              maxHeight: maxHeight ?? 400,
              overflow: "auto",
            }
          : {}),
      }}
    >
      {header && <div className={styles.header}>{header}</div>}

      <div className={`${styles.body} ${childrenClassName}`}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
