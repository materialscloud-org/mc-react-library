import "./App.css";

import Popover from "react-bootstrap/Popover";

import { TestButton, DoiBadge, HelpButton } from "../lib/main.js";

const helpButtonContents = (
  <Popover>
    <Popover.Body>Test</Popover.Body>
  </Popover>
);

function App() {
  return (
    <div className="test-container">
      <span>TestButton</span>
      <div>
        <TestButton />
      </div>
      <span>DoiBadge</span>
      <div>
        <DoiBadge doi_id="ab-cd" />
      </div>
      <span>HelpButton</span>
      <div style={{ fontSize: "12px" }}>
        <HelpButton popover={helpButtonContents} placement="top" />
      </div>
      <div>
        <HelpButton popover={helpButtonContents} placement="left" />
      </div>
      <div style={{ fontSize: "20px" }}>
        <HelpButton popover={helpButtonContents} placement="bottom" />
      </div>
    </div>
  );
}

export default App;
