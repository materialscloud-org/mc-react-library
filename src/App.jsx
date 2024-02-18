import "./App.css";

import { TestButton, DoiBadge } from "../lib/main.js";

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
    </div>
  );
}

export default App;
