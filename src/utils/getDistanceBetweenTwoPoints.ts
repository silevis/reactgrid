/**
 * This function calculates the Euclidean distance between two points in a 2D space.
 * The distance is calculated using the formula sqrt((aX + aY)^2 + (bX + bY)^2).
 *
 * @param aX - The x-coordinate of the first point.
 * @param aY - The y-coordinate of the first point.
 * @param bX - The x-coordinate of the second point.
 * @param bY - The y-coordinate of the second point.
 * @returns The Euclidean distance between the two points.
 */
export function getDistanceBetweenTwoPoints(aX: number, aY: number, bX: number, bY: number) {
  return Math.sqrt(Math.pow(aX + aY, 2) + Math.pow(bX + bY, 2));
}
