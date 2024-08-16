import "./App.css";

import Popover from "react-bootstrap/Popover";
import { Table } from "react-bootstrap";

import {
  TestButton,
  DoiBadge,
  HelpButton,
  McloudSpinner,
  StructDownloadButton,
  ExploreButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
  getSymmetryInfo,
} from "../lib/main.js";

const helpButtonContents = (
  <Popover>
    <Popover.Body>Test</Popover.Body>
  </Popover>
);

function App() {
  let symmetryTable = [];
  for (let spgn = 1; spgn <= 230; spgn++) {
    let symmetryInfo = getSymmetryInfo(spgn);
    symmetryTable.push(
      <tr key={spgn}>
        <td>{spgn}</td>
        <td>{symmetryInfo.space_group_symbol}</td>
        <td>{symmetryInfo.point_group_symbol}</td>
        <td>{symmetryInfo.crystal_family_pearson}</td>
        <td>{symmetryInfo.crystal_family}</td>
        <td>{symmetryInfo.crystal_system}</td>
        <td>{symmetryInfo.lattice_system}</td>
        <td>{symmetryInfo.bravais_lattice_pearson}</td>
        <td>{symmetryInfo.bravais_lattice}</td>
      </tr>
    );
  }

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
      <span>utils/formatting.jsx</span>
      <div>{formatChemicalFormula("CO2")}</div>
      <div>{formatSpaceGroupSymbol("P6_3/mcm")}</div>
      <div>{formatSpaceGroupSymbol("P-42_1m")}</div>
      <span>utils/symmetry.js</span>
      <div>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Space group number</th>
              <th>Space group symbol</th>
              <th>Point group symbol</th>
              <th>Crystal family Pearson</th>
              <th>Crystal family</th>
              <th>Crystal system</th>
              <th>Lattice system</th>
              <th>Bravais lattice Pearson</th>
              <th>Bravais lattice</th>
            </tr>
          </thead>
          <tbody>{symmetryTable}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
