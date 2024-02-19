import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

// use plain css as it's easier to overload bootstrap css ('tooltip-inner')
import "./styles.css";

import AiidaLogo from "./aiida-logo-128.png";

export function ExploreButton(props) {
  var url = `${props.explore_url}/details/${props.uuid}?nodeType=NODE`;
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip className="explore_btn_tooltip">
          Browse provenance
          <br />
          {props.uuid}
        </Tooltip>
      }
    >
      <a href={url} target="_blank">
        <img src={AiidaLogo} className="explore_btn_aiida_logo"></img>
      </a>
    </OverlayTrigger>
  );
}
