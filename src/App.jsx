import "./App.css";

import Popover from "react-bootstrap/Popover";

import {
  TestButton,
  DoiBadge,
  HelpButton,
  McloudSpinner,
  StructDownloadButton,
  ExploreButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "../lib/main.js";

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
      <span>McloudSpinner</span>
      <div style={{ width: "80px", padding: "10px" }}>
        <McloudSpinner />
      </div>
      <span>utils.jsx</span>
      <div>{formatChemicalFormula("CO2")}</div>
      <div>{formatSpaceGroupSymbol("P6_3/mcm")}</div>
      <span>StructDownloadButton</span>
      <div>
        <StructDownloadButton
          aiida_rest_url="https://aiida.materialscloud.org/mc3d/api/v4"
          uuid="1d546de0-fb37-4faa-bb25-b3d02773f5e6"
        />
      </div>
      <span>ExploreButton</span>
      <div>
        some text{" "}
        <ExploreButton
          explore_url="https://www.materialscloud.org/explore/mc3d"
          uuid="1d546de0-fb37-4faa-bb25-b3d02773f5e6"
        />
      </div>
    </div>
  );
}

export default App;
