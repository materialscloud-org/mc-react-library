import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import styles from "./styles.module.css";

export function HelpButton(props) {
  let helpButtonDiv = <div className={styles.help_button}>?</div>;
  if (props.popover != null) {
    helpButtonDiv = (
      <OverlayTrigger
        trigger="click"
        rootClose
        placement={props.placement}
        overlay={props.popover}
      >
        {helpButtonDiv}
      </OverlayTrigger>
    );
  }
  return helpButtonDiv;
}
