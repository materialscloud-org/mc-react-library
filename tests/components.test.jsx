import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import {
  createShareStore,
  McShareButton,
  McStructureUpload,
} from "../lib/main.js";

beforeEach(() => {
  globalThis.window = {
    location: { origin: "https://app.example", pathname: "/", search: "", hash: "" },
  };
});
afterEach(() => {
  delete globalThis.window;
});

describe("McShareButton", () => {
  const data = { structure: {}, fileName: "x.cif" };

  it("renders nothing when sharing is disabled", () => {
    expect(renderToStaticMarkup(<McShareButton store={createShareStore()} data={data} />)).toBe("");
  });

  it("renders nothing without data", () => {
    expect(renderToStaticMarkup(<McShareButton store={createShareStore("dev")} data={null} />)).toBe("");
  });

  it("renders the button, and names a non-production store", () => {
    const html = renderToStaticMarkup(<McShareButton store={createShareStore("dev")} data={data} />);
    expect(html).toContain(">Share</button>");
    expect(html).toContain("(dev share store)");
    expect(
      renderToStaticMarkup(<McShareButton store={createShareStore("production")} data={data} />),
    ).not.toContain("share store");
  });
});

describe("McStructureUpload", () => {
  it("renders the dropzone and examples", () => {
    const html = renderToStaticMarkup(
      <McStructureUpload
        examples={[
          { label: "Si", url: "/examples/Si.cif", family: "Semiconductors" },
          { label: "Al", url: "/examples/Al.cif", family: "Metals" },
        ]}
      />,
    );
    expect(html).toContain("Upload a crystal structure");
    expect(html).toContain("Drop your crystal structure here");
    expect(html).toContain('<optgroup label="Semiconductors">');
    expect(html).toContain(">Si</option>");
  });

  it("has no examples section without examples", () => {
    const html = renderToStaticMarkup(<McStructureUpload />);
    expect(html).not.toContain("<select");
  });
});
