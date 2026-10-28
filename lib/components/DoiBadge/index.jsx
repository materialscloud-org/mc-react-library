import "./index.css";

/**
 * DoiBadge
 *
 *   <DoiBadge doi="10.1016/j.commatsci.2016.10.015" label="Paper DOI" />
 *   <DoiBadge doi_id="2017.0008/v1" label="Data DOI" />   // Materials Cloud Archive
 *
 * The label sets the colour: "Data DOI" blue, "Paper DOI" green, anything
 * else (e.g. "DOI", "ArXiv") blue. `color` overrides it. The link gets
 * lighter on hover, whatever the colour.
 */
export const DoiBadge = ({
  doi_id,
  doi,
  label = "DOI",
  color,
  className = "",
  style,
  ...rest
}) => {
  let doi_text = "";
  if (doi_id != null) {
    doi_text = `10.24435/materialscloud:${doi_id}`;
  } else {
    doi_text = doi;
  }

  const variant = label === "Paper DOI" ? "mc-doi--paper" : "";

  return (
    <div
      className={["mc-doi", variant, className].filter(Boolean).join(" ")}
      style={color ? { "--mc-doi-color": color, ...style } : style}
      {...rest}
    >
      <span className="mc-doi__badge">
        <span className="mc-doi__label">{label}</span>
        <a
          href={`https://doi.org/${doi_text}`}
          className="mc-doi__link"
          target="_blank"
          rel="noreferrer"
        >
          {doi_text}
        </a>
      </span>
    </div>
  );
};
