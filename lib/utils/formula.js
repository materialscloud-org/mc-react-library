import { formatChemicalFormula } from "./formatting";
import periodic_table from "./periodic_table.json";

export function countNumberOfAtoms(hillFormula) {
  // split on capital letters to get element+number strings
  // May break if non-hillFormula is used
  var elnum = hillFormula.split(/(?=[A-Z])/);
  var num = 0;
  elnum.forEach((v) => {
    let match = v.match(/\d+/);
    let n = match == null ? 1 : parseInt(match[0]);
    num += n;
  });
  return num;
}

export function countNumberOfElements(hillFormula) {
  // May break if non-hillFormula is supplied
  return hillFormula.split(/(?=[A-Z])/).length;
}

export function calculateDensity(hillFormula, volume) {
  // uses periodic table to determine densities.
  var elnum = hillFormula.split(/(?=[A-Z])/);
  let totMz = 0;

  elnum.forEach((eln) => {
    const match = eln.match(/([a-zA-Z]+)(\d*)/);
    const symbol = match[1];
    const count = parseInt(match[2] || "1");
    const mz = periodic_table[symbol]?.mz || 0;
    totMz += mz * count;
  });
  return Math.round((totMz * 10000) / (volume.value * 6.0223));
}
