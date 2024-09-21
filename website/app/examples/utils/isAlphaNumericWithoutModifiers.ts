export const isAlphaNumericWithoutModifiers = (
  e: React.KeyboardEvent
): boolean => {
  const isAlphaNumericOrEnter = isKeyCodeAlphaNumeric(e.keyCode);
  const noModifiers = !e.ctrlKey && !e.metaKey && !e.altKey;
  return isAlphaNumericOrEnter && noModifiers;
};

export const isKeyCodeAlphaNumeric = (keyCode: number): boolean =>
  (keyCode >= 48 && keyCode <= 57) || // 0-9
  (keyCode >= 65 && keyCode <= 90) || // A-Z
  (keyCode >= 96 && keyCode <= 105); // Numpad 0-9
