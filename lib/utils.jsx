export function formatChemicalFormula(formula) {
  // split formula into array of elements and numbers
  let f_split = formula.split(/(\d+)/);
  return f_split.map((v, index) => {
    if (v.match(/\d+/)) {
      return <sub key={index}>{v}</sub>;
    }
    return v;
  });
}

export function formatSpaceGroupSymbol(params) {
  let nextIsSub = false;
  return (
    <span>
      {params.split("").map((v, index) => {
        if (v == "_") {
          nextIsSub = true;
          return null;
        }
        if (nextIsSub) {
          nextIsSub = false;
          return <sub key={index}>{v}</sub>;
        }
        return v;
      })}
    </span>
  );
}
