// Ease-in-out function
const easeInOut = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// Utility function to interpolate between two paths
const interpolatePaths = (path1: string, path2: string, t: number): string => {
  const interpolateNumbers = (n1: number, n2: number, t: number) =>
    n1 + (n2 - n1) * t;

  const path1Data = path1.match(/[-+]?[0-9]*\.?[0-9]+/g)?.map(Number) || [];
  const path2Data = path2.match(/[-+]?[0-9]*\.?[0-9]+/g)?.map(Number) || [];

  if (path1Data.length !== path2Data.length) {
    console.warn(
      "Paths must have the same number of points for smooth interpolation."
    );
    return path1; // fallback to avoid error
  }

  const interpolatedData = path1Data.map((point, index) =>
    interpolateNumbers(point, path2Data[index], t)
  );
  return path1.replace(/[-+]?[0-9]*\.?[0-9]+/g, () =>
    interpolatedData.shift()!.toString()
  );
};

export { easeInOut, interpolatePaths };
