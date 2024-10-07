import { keyCodes } from "./keyCodes";

/**
 * Checks if a keyboard event is triggered by a valid key without any specified invalid keys or modifier keys.
 *
 * @param e The keyboard event to check.
 * @param invalidKeys An optional array of additional keys that should be considered invalid.
 * @returns True if the event is triggered by a valid key without any specified invalid keys or modifier keys, false otherwise.
 */
export const isValidKey = (e: React.KeyboardEvent, invalidKeys: string[] = []): boolean => {
  const defaultInvalidKeys = [
    "Shift",
    "Alt", // Modifiers
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown", // Arrow keys
    " ", // Space key
    "Tab",
    "PageDown",
    "PageUp",
    "Home",
    "End",
    "Insert",
    "Delete",
    "Backspace",
    "Escape",
    "Enter", // Other keys
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12", // Function keys
  ];

  const allInvalidKeys = [...defaultInvalidKeys, ...invalidKeys];

  const isKeyCombination = e.ctrlKey || e.metaKey;

  const isInvalidKey =
    allInvalidKeys.includes(e.key) ||
    allInvalidKeys.some((mod) => e[mod as keyof React.KeyboardEvent]) ||
    isKeyCombination;

  return !isInvalidKey;
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
