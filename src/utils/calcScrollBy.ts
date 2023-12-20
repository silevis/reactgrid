
/**
 * Calculates the scroll direction. It also can apply a multiplier to the scroll speed in selected direction.
 * @param direction The direction to scroll.
 * @param multiplier The multiplier to apply to the scroll direction.
 * @returns The scroll direction.
 */
export const calcScrollBy = (direction: string, multiplier?: number): { x: number; y: number; } => {
  let x = 0;
  let y = 0;
  switch (direction.toLowerCase()) {
    case "left":
      x = -1;
      break;
    case "right":
      x = 1;
      break;
    case "top":
      y = -1;
      break;
    case "bottom":
      y = 1;
      break;
    case "topcenter":
      y = -1;
      break;
    case "bottomcenter":
      y = 1;
      break;
    case "topleft":
      x = -1;
      y = -1;
      break;
    case "topright":
      x = 1;
      y = -1;
      break;
    case "bottomleft":
      x = -1;
      y = 1;
      break;
    case "bottomright":
      x = 1;
      y = 1;
      break;
  }
  if (multiplier) {
    x *= multiplier;
    y *= multiplier;
  }
  return { x, y };
};
