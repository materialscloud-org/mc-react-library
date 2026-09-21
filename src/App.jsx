import "./App.css";

import { useState } from "react";

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
  ToggleSwitch,
  McCopyAccordion,
  McCopyExtraAccordion,
  McInfoAccordion,
  McDropzone,
  McHistoryList,
  createHistoryStore,
  HashModal,
} from "../lib/main.js";

const demoHistory = createHistoryStore("mc-react-library.demoHistory");

import tests from "../tests/simpleTests.js";
import { McloudCard } from "../lib/components/McloudCard/index.jsx";

const helpButtonContents = "Test";

function App() {
  const [demoFile, setDemoFile] = useState(null);
  const [demoHistoryEntries, setDemoHistoryEntries] = useState(() => [
    {
      id: "demo-1",
      fileName: "Si_POSCAR",
      format: "poscar",
      date: new Date().toISOString(),
    },
    {
      id: "demo-2",
      fileName: "graphite.cif",
      format: "cif",
      date: new Date().toISOString(),
    },
  ]);
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
      </tr>,
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

      <DoiBadge
        doi="custom-doi/10.ab.cd"
        label="custom-label"
        color="#a2e5b7"
      />

      <div>Mc Text Accordion</div>
      <McCopyAccordion
        title="KPOINTS (VASP)"
        text={"vaspKpointsText"}
        filename="KPOINTS"
      />

      <div>Mc Info Accordion</div>
      <McInfoAccordion title="About this entry">
        <p>Generic rich content goes here — text, links, or any React nodes.</p>
      </McInfoAccordion>

      <div>Mc Copy Accordion with extra action</div>
      <McCopyExtraAccordion
        title="PW.in + input set"
        text={"pw input text"}
        filename="PW.in"
        extraActions={
          <button
            type="button"
            className="text-renderer__action"
            onClick={() => alert("zip download goes here")}
          >
            <span>Input set (.zip)</span>
          </button>
        }
      />

      <span>McDropzone</span>
      <div>
        <McDropzone
          accept=".cif,.xyz,.poscar"
          fileName={demoFile}
          onFile={(file) => {
            setDemoFile(file.name);
            setDemoHistoryEntries(
              demoHistory.add({
                id: crypto.randomUUID(),
                fileName: file.name,
                format: file.name.split(".").pop(),
                date: new Date().toISOString(),
              }),
            );
          }}
          hint="CIF, XYZ and POSCAR files (demo persists to localStorage)"
        />
      </div>

      <span>McHistoryList</span>
      <div>
        <McHistoryList
          title="Demo history"
          entries={demoHistoryEntries}
          onLoad={(entry) => setDemoFile(entry.fileName)}
          onDelete={(id) =>
            setDemoHistoryEntries(demoHistory.remove(id))
          }
          onClear={() => setDemoHistoryEntries(demoHistory.clear())}
        />
      </div>

      <span>Overrides (tokens + classes)</span>
      <div>
        <McCopyAccordion
          title="Themed via CSS variables"
          text={"themed text"}
          filename="themed.txt"
          className="demo-purple"
        />
      </div>
      <div>
        <McInfoAccordion
          title="Themed via classes.root"
          classes={{ root: "demo-outline" }}
        >
          <p>
            The <code>classes.root</code> class is appended after the default
            classes, so it wins on equal specificity.
          </p>
        </McInfoAccordion>
      </div>

      <span>McloudCard</span>
      <div>
        <McloudCard
          header={<span>Header</span>}
          footer={<span>Footer</span>}
          className="max-w-md mx-auto"
          childrenClassName="space-y-3"
        >
          <p>
            This is an example card body. It can contain any React content. It
            expands to fill its container wrapping when it has overflowed
          </p>

          <button>Action</button>
        </McloudCard>
      </div>

      <span>ToggleSwitch</span>
      <div style={{ marginTop: "8px" }}>
        <ToggleSwitch />
      </div>
      <span>HashModal (hash-driven)</span>
      <div>
        <a href="#demo-modal">Open demo modal</a>
        <HashModal hash="demo-modal" title="Demo modal">
          <p>
            This modal opened because the URL hash matches. Close it via the
            button, overlay click, or Escape key.
          </p>
        </HashModal>
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
      {/* <div>
        <table className="demo-table">
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
        </table>
      </div> */}
    </div>
  );
}

export default App;
