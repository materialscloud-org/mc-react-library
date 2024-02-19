import Button from "react-bootstrap/Button";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import styles from "./styles.module.css";

export function StructDownloadButton(props) {
  var dl_url = `${props.aiida_rest_url}/nodes/${props.uuid}/download`;

  var clickPopover = (
    <Popover>
      <Popover.Body style={{ padding: "5px 0px" }}>
        <ul className={styles.download_dropdown_menu}>
          <li>
            <a href={`${dl_url}?download_format=chemdoodle`}>ChemDoodle</a>
          </li>
          <li>
            <a href={`${dl_url}?download_format=cif`}>CIF</a>
          </li>
          <li>
            <a href={`${dl_url}?download_format=xsf`}>XSF</a>
          </li>
          <li>
            <a href={`${dl_url}?download_format=xyz`}>XYZ</a>
          </li>
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
