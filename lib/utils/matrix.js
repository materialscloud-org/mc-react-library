// Utility: norm and dot product
// Useful util functions for common matrix tasks

export function norm(vec) {
  return Math.sqrt(vec.reduce((sum, x) => sum + x * x, 0));
}

export function dot(v1, v2) {
  return v1.reduce((sum, x, i) => sum + x * v2[i], 0);
}

export function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

export function scalarMultiply(matrix, scalar) {
  return matrix.map((row) => row.map((val) => val * scalar));
}

export function identityMatrix(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

export function multiplyMatrices(m1, m2) {
  var result = [];
  for (var i = 0; i < m1.length; i++) {
    result[i] = [];
    for (var j = 0; j < m2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function getMatrixParams(matrix) {
  /*
  Method to convert a nxn matrix to lengths and angles:

  <(b,c) = cos⁻¹((b·c) / (|b| * |c|))  // angle between vectors b and c
  |a| = √(a_1^2 + a_2^2 + ... + a_n^2)

  returns an object:
  obj.lengths = [|a|, |b|, ..., |n|]
  obj.angles = n x n array where element i,j is the angle between i and j

  */

  const n = matrix.length;
  const lengths = matrix.map((v) => norm(v));

  const angles = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        angles[i][j] = 0;
        continue;
      }

      const dotProd = dot(matrix[i], matrix[j]);
      const normI = lengths[i];
      const normJ = lengths[j];

      if (normI > 0 && normJ > 0) {
        let cosTheta = dotProd / (normI * normJ);
        // Clamp to [-1, 1] to avoid NaN due to floating point errors
        cosTheta = Math.max(-1, Math.min(1, cosTheta));
        const angleRad = Math.acos(cosTheta);
        angles[i][j] = angleRad * (180 / Math.PI);
      } else {
        angles[i][j] = null; // Angle undefined for zero-length vector
      }
    }
  }

  return { lengths, angles };
}

export function invertMatrix(matrix) {
  const n = matrix.length;
  // Make a deep copy of the matrix
  const A = matrix.map((row) => row.slice());
  // Create identity matrix
  const I = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let i = 0; i < n; i++) {
    // Pivoting: find row with max value in column i
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    // Swap rows in A and I
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [I[i], I[maxRow]] = [I[maxRow], I[i]];

    // Make sure the matrix is not singular
    if (A[i][i] === 0) {
      throw new Error("Matrix is singular and cannot be inverted.");
    }

    // Normalize the pivot row
    const pivot = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      I[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = 0; j < n; j++) {
        A[k][j] -= factor * A[i][j];
        I[k][j] -= factor * I[i][j];
      }
    }
  }

  return I;
}

export function determinant(matrix) {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;
  for (let col = 0; col < n; col++) {
    const subMatrix = matrix
      .slice(1)
      .map((row) => row.filter((_, j) => j !== col));
    const sign = col % 2 === 0 ? 1 : -1;
    det += sign * matrix[0][col] * determinant(subMatrix);
  }
  return det;
}
