import { matrix } from "../lib/main";
import { formula } from "../lib/main";

export default function tests() {
  console.log("Printing Matrix Tests");

  const test_vector1 = [3, 4];
  const test_vector2 = [8, 4];
  console.log("Test Vectors", test_vector1, test_vector2);

  console.log("norm vec1:", matrix.norm(test_vector1), ",expected 5");
  console.log("norm vec2:", matrix.norm(test_vector2), ",expected 8.94427");

  const testMatrix = [
    [1, 2, 3],
    [1, 5, 9],
    [6, 8, 4],
  ]; // first test passed.

  const transposeMatrix = [
    [1, 1, 6],
    [2, 5, 8],
    [3, 9, 4],
  ];

  const scaleMatrix = [
    [2, 4, 6],
    [2, 10, 18],
    [12, 16, 8],
  ];

  const largeIMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const invertMatrix = [
    [2.8888, -0.8888, -0.1666],
    [-2.7777, 0.77777, 0.3333],
    [1.2222, -0.2222, -0.1666],
  ];
  console.log("Test Matrix", testMatrix);

  console.log(
    "Transpose:",
    matrix.transpose(testMatrix),
    ",expected:",
    transposeMatrix
  );

  console.log(
    "Scaled Matrix:",
    matrix.scalarMultiply(testMatrix, 2),
    ",expected: ",
    scaleMatrix
  );

  console.log(
    "Scaled Matrix:",
    matrix.scalarMultiply(testMatrix),
    ",expected: ",
    scaleMatrix
  );

  console.log(
    "identity matrix:",
    matrix.identityMatrix(4),
    " expected: ",
    largeIMatrix
  );

  console.log(
    "inverted matrix",
    matrix.invertMatrix(testMatrix),
    " expected:",
    invertMatrix
  );

  console.log("Determinant:", matrix.determinant(testMatrix), ",expected: -18");

  return;
}
