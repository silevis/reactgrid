
export function createMultiplierFromDistance(aX: number, aY: number, bX: number, bY: number) {
  const multiplier = Math.sqrt(Math.pow(aX + aY, 2) + Math.pow(bX + bY, 2));
  return multiplier;
}
