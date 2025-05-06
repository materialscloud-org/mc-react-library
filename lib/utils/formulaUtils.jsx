import { formatChemicalFormula } from "./formatting";
import pt from "./pt.json"; // move to mc-r-lib?

export function countNumberOfAtoms(formula) {
  // split on capital letters to get element+number strings
  var elnum = formula.split(/(?=[A-Z])/);
  var num = 0;
  elnum.forEach((v) => {
    let match = v.match(/\d+/);
    let n = match == null ? 1 : parseInt(match[0]);
    num += n;
  });
  return num;
}

export function countNumberOfElements(formula) {
  return formula.split(/(?=[A-Z])/).length;
}

export function formatTitle(formulaStr, id, method) {
  return (
    <span>
      {formatChemicalFormula(formulaStr)} ({id}/{method})
    </span>
  );
}

export function calculateDensity(formula, volume) {
  // currently uses scoped pt to determine densities.
  var elnum = formula.split(/(?=[A-Z])/);
  let totMz = 0;

  elnum.forEach((eln) => {
    const match = eln.match(/([a-zA-Z]+)(\d*)/);
    const symbol = match[1];
    const count = parseInt(match[2] || "1");
    const mz = pt[symbol]?.mz || 0;
    totMz += mz * count;
  });
  return Math.round((totMz * 10000) / (volume.value * 6.0223));
}
