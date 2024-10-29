export const getValueFromPixelString = (value: string | number): number => {
  if (typeof value === "string") {
    return parseInt(value, 10);
  } else {
    return value;
  }
};
