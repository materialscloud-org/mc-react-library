/* Symmetry utilities
 *
 * sources to check consistency with:
 * - https://www.cryst.ehu.es/cgi-bin/cryst/programs/nph-table?from=getwp
 * - https://cci.lbl.gov/sginfo/hall_symbols.html
 * - https://cci.lbl.gov/sginfo/itvb_2001_table_a1427_hall_symbols.html
 * - https://github.com/spglib/spglib/blob/v2.5.0/database/make_spgtype_db.py
 * - https://github.com/materialsproject/pymatgen/blob/v2024.8.9/src/pymatgen/symmetry/analyzer.py
 * - https://raw.githubusercontent.com/materialsproject/pymatgen/v2024.8.9/src/pymatgen/symmetry/symm_ops.json
 * - https://aflow.org/prototype-encyclopedia/spacegroup_info.html
 */

// Import the international (Hermann-Mauguin) space and point group symbols
// (generated with pymatgen, see the /scripts folder)
import space_group_data from "./space_groups.json";

// Pearson notation for crystal families and bravais lattices
// https://en.wikipedia.org/wiki/Pearson_symbol
const PEARSON_CRYSTAL_FAMILIES = {
  a: "triclinic",
  m: "monoclinic",
  o: "orthorhombic",
  t: "tetragonal",
  h: "hexagonal",
  c: "cubic",
};
// Note that for "base-centered" other sources might use a different letter
// (e.g. 'C' instead of 'S')
const PEARSON_BRAVAIS_LATTICES = {
  aP: "triclinic",
  mP: "simple monoclinic",
  mS: "base-centered monoclinic",
  oP: "simple orthorhombic",
  oS: "base-centered orthorhombic",
  oI: "body-centered orthorhombic",
  oF: "face-centered orthorhombic",
  tP: "simple tetragonal",
  tI: "body-centered tetragonal",
  hR: "rhombohedral",
  hP: "hexagonal",
  cP: "simple cubic",
  cI: "body-centered cubic",
  cF: "face-centered cubic",
};

function getCrystalFamily(spgn) {
  if (spgn < 1 || spgn > 230) {
    throw new Error(`Invalid space group number ${spgn}`);
  }
  if (spgn < 3) return "a";
  if (spgn < 16) return "m";
  if (spgn < 75) return "o";
  if (spgn < 143) return "t";
  if (spgn < 195) return "h";
  return "c";
}

function getCrystalSystem(spgn) {
  /* Crystal system
   *
   * Same as the crystal family except for the hexagonal crystal family (143-194),
   * which is divided into trigonal and hexagonal crystal systems.
   */
  if (spgn > 142 && spgn < 168) return "trigonal";
  return PEARSON_CRYSTAL_FAMILIES[getCrystalFamily(spgn)];
}

function getLatticeSystem(spgn) {
  /* Lattice system
   *
   * Same as the crystal family except for the hexagonal crystal family (143-194),
   * which is divided into rhombohedral and hexagonal lattice systems.
   * (The rhombohedral ones start with an 'R' for their space group symbol.)
   */
  if ([146, 148, 155, 160, 161, 166, 167].includes(spgn)) return "rhombohedral";
  return PEARSON_CRYSTAL_FAMILIES[getCrystalFamily(spgn)];
}

function getBravaisLattice(spgn) {
  /* Bravais lattice in Pearson notation and a more descriptive label
   *
   * The Pearson notation consists of the crystal family letter + "centering type",
   * which can be found from the first letter of the international symbol.
   * Note: the letters "C" and "A" map to "S".
   */

  let sgLetter = space_group_data[spgn.toString()]["sg_int_short"].charAt(0);
  let centeringType = sgLetter;
  if (["A", "C"].includes(sgLetter)) {
    centeringType = "S";
  }
  let pearson = getCrystalFamily(spgn) + centeringType;

  return [pearson, PEARSON_BRAVAIS_LATTICES[pearson]];
}

export function getSymmetryInfo(spgn) {
  if (spgn < 1 || spgn > 230) {
    throw new Error(`Invalid space group number ${spgn}`);
  }
  let bravais = getBravaisLattice(spgn);

  return {
    space_group_symbol: space_group_data[spgn.toString()]["sg_int_short"],
    point_group_symbol: space_group_data[spgn.toString()]["pg_int"],
    crystal_family_pearson: getCrystalFamily(spgn),
    crystal_family: PEARSON_CRYSTAL_FAMILIES[getCrystalFamily(spgn)],
    crystal_system: getCrystalSystem(spgn),
    lattice_system: getLatticeSystem(spgn),
    bravais_lattice_pearson: bravais[0],
    bravais_lattice: bravais[1],
  };
}

export function getPrimToConvMatrix(spaceGroupSymbol) {
  // Method to return the conv Matrix of a primitive cell
  //  to the conventional standard cell

  if (spaceGroupSymbol.includes("P")) {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  } else if (spaceGroupSymbol.includes("I")) {
    return [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ];
  } else if (spaceGroupSymbol.includes("F")) {
    return [
      [-1, 1, 1],
      [1, -1, 1],
      [1, 1, -1],
    ];
  } else if (spaceGroupSymbol.includes("A")) {
    return [
      [1, 1, 0],
      [-1, 1, 0],
      [0, 0, 1],
    ];
  } else if (spaceGroupSymbol.includes("R")) {
    return [
      [-1, 1, 0],
      [1, 1, -1],
      [1, 1, 1],
    ];
  } else if (spaceGroupSymbol.includes("C")) {
    if (spaceGroupSymbol in ["C2", "CmCc", "C2/m", "C2/c"]) {
      return [
        [1, -1, 0],
        [1, 1, 0],
        [0, 0, 1],
      ];
    } else {
      return [
        [1, -1, 0],
        [1, 1, 0],
        [0, 0, 1],
      ];
    }
  } else {
    console.log("Missing Space group data for:", spaceGroupSymbol);
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }
}
