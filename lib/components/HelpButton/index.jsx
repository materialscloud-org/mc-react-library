import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import styles from "./styles.module.css";

/* Note, you should put this element in a div with specified width, height and font-size */
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
