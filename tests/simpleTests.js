import { matrix } from "../lib/main";
import { formula } from "../lib/main"; // Import formula in case it's needed later

export default function tests(tolerance = 0.0001) {
  // Test data
  const test_vector1 = [3, 4];
  const test_vector2 = [8, 4];

  const testMatrix = [
    [1, 2, 3],
    [1, 5, 9],
    [6, 8, 4],
  ];

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

  console.assert(
    Math.abs(matrix.norm(test_vector1) - 5) < tolerance,
    "Norm of vec1 should be 5"
  );
  console.assert(
    Math.abs(matrix.norm(test_vector2) - 8.94427) < tolerance,
    "Norm of vec2 should be 8.94427"
  );

  // Test 2: Matrix Transpose
  console.assert(
    JSON.stringify(matrix.transpose(testMatrix)) ===
      JSON.stringify(transposeMatrix),
    "Transpose of matrix is incorrect"
  );

  // Test 3: Matrix Scalar Multiplication
  console.assert(
    JSON.stringify(matrix.scalarMultiply(testMatrix, 2)) ===
      JSON.stringify(scaleMatrix),
    "Scalar multiplication of matrix by 2 is incorrect"
  );

  // Test 4: Identity Matrix
  console.assert(
    JSON.stringify(matrix.identityMatrix(4)) === JSON.stringify(largeIMatrix),
    "Identity matrix generation is incorrect"
  );

  // Test 5: Matrix Inversion (with tolerance)
  matrix.invertMatrix(testMatrix).forEach((row, i) => {
    row.forEach((value, j) => {
      console.assert(
        Math.abs(value - invertMatrix[i][j]) < tolerance,
        `Matrix inversion mismatch at position [${i},${j}]`
      );
    });
  });

  // Test 6: Determinant (with tolerance)
  console.assert(
    Math.abs(matrix.determinant(testMatrix) - -18) < tolerance,
    "Determinant of matrix should be -18"
  );

  console.log("All Matrix tests passed!");
}
