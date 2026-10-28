import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { McAppHeader, McShareButton, McStructureUpload } from "../lib/main.js";

beforeEach(() => {
  globalThis.window = {
    location: { origin: "https://app.example", pathname: "/", search: "", hash: "" },
  };
});
afterEach(() => {
  delete globalThis.window;
});

describe("McShareButton", () => {
  it("renders nothing without data", () => {
    expect(renderToStaticMarkup(<McShareButton data={null} />)).toBe("");
  });

  it("renders the button", () => {
    const html = renderToStaticMarkup(<McShareButton data={{ structure: {}, fileName: "x.cif" }} />);
    expect(html).toContain("Share</button>");
    expect(html).toContain('class="mc-share"');
  });

  it("lets children lay out the pieces", () => {
    const html = renderToStaticMarkup(
      <McShareButton data={{}}>
        {({ button, error, result }) => (
          <section>
            {button}
            <button type="button">Download</button>
            {error}
            {result}
          </section>
        )}
      </McShareButton>,
    );
    expect(html).toMatch(/^<section><button[^>]*class="mc-share__button".*Share<\/button><button type="button">Download<\/button><\/section>$/);
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

describe("McAppHeader", () => {
  it("renders the title, logo and DOIs", () => {
    const html = renderToStaticMarkup(
      <McAppHeader
        title="My app"
        logo="/logo.png"
        dois={["10.1/abc", { doi: "10.2/def", label: "Paper", color: "#a2e5b7" }]}
      />,
    );
    expect(html).toContain("<h1");
    expect(html).toContain("My app</h1>");
    expect(html).toContain('src="/logo.png"');
    expect(html).toContain('href="https://doi.org/10.1/abc"');
    expect(html).toContain(">Paper</span>");
    expect(html).toContain("background-color:#a2e5b7");
  });

  it("leaves out the logo and DOIs when not given", () => {
    const html = renderToStaticMarkup(<McAppHeader title="My app" />);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("mc-app-header__dois");
  });
});
