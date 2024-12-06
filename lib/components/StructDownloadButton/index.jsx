import Button from "react-bootstrap/Button";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import styles from "./styles.module.css";

const defaultFormats = [
  { format: "cif", label: "CIF" },
  { format: "xsf", label: "XSF" },
  { format: "xyz", label: "XYZ" },
];

export function StructDownloadButton(props) {
  const dl_url = `${props.aiida_rest_url}/nodes/${props.uuid}/download`;
  const downloadFormats = props.download_formats || defaultFormats;

  const clickPopover = (
    <Popover>
      <Popover.Body style={{ padding: "5px 0px" }}>
        <ul className={styles.download_dropdown_menu}>
          {downloadFormats.map(({ format, label }) => (
            <li key={format}>
              <a href={`${dl_url}?download_format=${format}`}>{label}</a>
            </li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement={"bottom"}
      overlay={clickPopover}
    >
      <Button
        size="sm"
        style={{ margin: "4px", padding: "2px 7px" }}
        title={"Download"}
      >
        <span className="bi bi-download" />
      </Button>
    </OverlayTrigger>
  );
}
