import { keyCodes } from "./keyCodes";

/**
 * Checks if a keyboard event is triggered by an alphanumeric key or the Enter key without any modifier keys (Ctrl, Meta, Shift, Alt).
 *
 * @param e The keyboard event to check.
 * @returns True if the event is triggered by an alphanumeric key or the Enter key without any modifier keys, false otherwise.
 */
export const isAlphaNumericWithoutModifiers = (e: React.KeyboardEvent): boolean => {
  const isAlphaNumericOrEnter = isKeyCodeAlphaNumeric(e.keyCode);
  const noModifiers = !e.ctrlKey && !e.metaKey && !e.altKey;
  return isAlphaNumericOrEnter && noModifiers;
};

/**
 * Checks that the pressed key's `keyCode` is one of printable characters
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of printable characters
 */
export const isKeyCodeAlphaNumeric = (keyCode: number): boolean =>
  (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) || // 0-9
  (keyCode >= keyCodes.KEY_A && keyCode <= keyCodes.KEY_Z) || // A-Z
  (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9); // Numpad 0-9

/**
 * Checks that the pressed key's `keyCode` is one of numeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export const inNumericKey = (keyCode: number): boolean =>
  (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) || isNumpadNumericKey(keyCode);

/**
 *
 * @param keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns Returns `true` if `keyCode` is one of number separator keys
 */
export const isNumberSeparator = (keyCode: number): boolean =>
  keyCode === keyCodes.PERIOD || keyCode === keyCodes.COMMA;

/**
 * Checks that the pressed key's `keyCode` is one of numpad keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numpad keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export const isNumpadNumericKey = (keyCode: number): boolean =>
  keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9;

/**
 * Checks that the pressed key's `keyCode` is one of navigation keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of navigation keys
 */
export const isNavigationKey = (keyCode: number): boolean =>
  keyCode === keyCodes.LEFT_ARROW ||
  keyCode === keyCodes.RIGHT_ARROW ||
  keyCode === keyCodes.UP_ARROW ||
  keyCode === keyCodes.DOWN_ARROW ||
  keyCode === keyCodes.END ||
  keyCode === keyCodes.HOME ||
  keyCode === keyCodes.BACKSPACE ||
  keyCode === keyCodes.DELETE;
