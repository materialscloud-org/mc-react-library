import styles from "./styles.module.css";

/** [key, text] rows of an object, sorted by key */
const propertyRows = (properties) =>
  Object.keys(properties)
    .sort()
    .map((key) => [key, String(properties[key])]);

/**
 * PropertyTable: the properties of one entry (an object), one row each,
 * sorted by name, under a sticky header; scrolls past `maxHeight`.
 *
 *   <PropertyTable properties={{ "density [kg/m^3]": 260.2, bond_type: "amide" }} />
 */
export function PropertyTable({
  properties,
  maxHeight = 570,
  labels = ["Properties", "Values"],
  className = "",
}) {
  return (
    <div className={`${styles.container} ${className}`} style={{ maxHeight }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{labels[0]}</th>
            <th>{labels[1]}</th>
          </tr>
        </thead>
        <tbody>
          {propertyRows(properties).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td className={styles.value}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
