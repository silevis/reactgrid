/**
 * Recursively performs a deep comparison between two objects, including functions.
 * This function checks if both objects have identical structure and values,
 * comparing properties, including nested objects, arrays, and even function bodies.
 *
 * @param obj1 - The first object to compare, can be of any type.
 * @param obj2 - The second object to compare, can be of any type.
 * @returns `true` if both objects are deeply equal, including their functions and nested properties; `false` otherwise.
 */
export const deepCompare = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 === "function" && typeof obj2 === "function") {
    return obj1.toString() === obj2.toString();
  }

  if (obj1 === null || obj2 === null || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!deepCompare((obj1 as { [key: string]: unknown })[key], (obj2 as { [key: string]: unknown })[key]))
      return false;
  }

  return true;
};
