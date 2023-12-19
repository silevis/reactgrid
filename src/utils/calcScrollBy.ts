// 1. get scrollable element
// 2. get scroll of scrollable element
// 3. get direction of sticky pane
// 4. calculate X and Y based on direction
// 5. scroll in that direction


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
