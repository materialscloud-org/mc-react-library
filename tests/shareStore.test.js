import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fromCIF } from "matsci-parse";

import {
  createShareStore,
  fromStructureShare,
  toStructureShare,
} from "../lib/main.js";

// A minimal browser location/history for the address-bar helpers.
function fakeWindow(search = "") {
  const location = { origin: "https://app.example", pathname: "/tool/", search, hash: "" };
  globalThis.window = {
    location,
    history: {
      replaceState: (_state, _title, url) => {
        location.search = new URL(url).search;
      },
    },
  };
}

beforeEach(() => fakeWindow());
afterEach(() => {
  delete globalThis.window;
  vi.unstubAllGlobals();
});

describe("createShareStore", () => {
  it("is disabled without a store", () => {
    for (const store of [undefined, null, ""]) {
      const s = createShareStore(store);
      expect(s.enabled).toBe(false);
      expect(s.idFromLocation()).toBe(null);
    }
  });

  it("does not touch the address bar when disabled", () => {
    fakeWindow("?abc123");
    createShareStore().syncAddressBar(null);
    expect(window.location.search).toBe("?abc123");
  });

  it("knows the dev and production stores, and accepts a URL", () => {
    expect(createShareStore("dev").name).toBe("dev");
    expect(createShareStore("production").name).toBe("production");
    expect(createShareStore("http://localhost:9000/").enabled).toBe(true);
  });

  it("rejects an unknown store name", () => {
    expect(() => createShareStore("staging")).toThrow(/Unknown share store 'staging'/);
  });

  it("reads a bare ?<id> and ignores other parameters", () => {
    fakeWindow("?fromURL=https://x/y&abc_12-3");
    expect(createShareStore("dev").idFromLocation()).toBe("abc_12-3");
    fakeWindow("?fromURL=https://x/y&format=optimade");
    expect(createShareStore("dev").idFromLocation()).toBe(null);
  });

  it("builds links and syncs the address bar", () => {
    const s = createShareStore("dev");
    expect(s.linkFor("abc")).toBe("https://app.example/tool/?abc");
    s.syncAddressBar("abc");
    expect(window.location.search).toBe("?abc");
    s.syncAddressBar(null);
    expect(window.location.search).toBe("");
  });

  it("uploads and fetches documents", async () => {
    const calls = [];
    vi.stubGlobal("fetch", async (url, init) => {
      calls.push([url, init?.method ?? "GET", init?.body]);
      return init?.method === "POST"
        ? { ok: true, status: 200, json: async () => ({ id: "abc" }) }
        : { ok: true, status: 200, json: async () => ({ hello: "world" }) };
    });
    const s = createShareStore("dev");
    expect(await s.upload({ hello: "world" })).toBe("abc");
    expect(await s.fetch("abc")).toEqual({ hello: "world" });
    expect(calls).toEqual([
      ["https://kv-store.dev.materialscloud.org/api/shares", "POST", '{"hello":"world"}'],
      ["https://kv-store.dev.materialscloud.org/api/shares/abc", "GET", undefined],
    ]);
  });

  it("explains too-large uploads and expired links", async () => {
    vi.stubGlobal("fetch", async (_url, init) => ({
      ok: false,
      status: init?.method === "POST" ? 413 : 404,
    }));
    const s = createShareStore("dev");
    await expect(s.upload({})).rejects.toThrow(/too large/);
    await expect(s.fetch("abc")).rejects.toThrow(/expire after 30 days/);
  });
});

describe("structure shares", () => {
  const cif = `data_NaCl
_cell_length_a 5.64
_cell_length_b 5.64
_cell_length_c 5.64
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Na1 Na 0 0 0
Cl1 Cl 0.5 0.5 0.5
`;

  it("round-trips through JSON", () => {
    const structure = fromCIF(cif);
    const doc = JSON.parse(JSON.stringify(toStructureShare({ structure, fileName: "NaCl.cif" })));
    const back = fromStructureShare(doc);
    expect(back.fileName).toBe("NaCl.cif");
    expect(back.structure.sites.map((s) => s.species.symbol)).toEqual(["Na", "Cl"]);
    expect(Array.from(back.structure.sites[1].frac)).toEqual([0.5, 0.5, 0.5]);
  });

  it("rejects documents that are not structures", () => {
    expect(() => fromStructureShare({ kind: "phonons" })).toThrow(/does not hold a structure/);
    expect(() => fromStructureShare(null)).toThrow();
  });
});
