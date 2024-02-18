import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import styles from "./styles.module.css";

export function HelpButton(props) {
  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement={props.placement}
      overlay={props.popover}
    >
      <div className={styles.help_button}>?</div>
    </OverlayTrigger>
  );
}
