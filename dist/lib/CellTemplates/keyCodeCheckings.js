import { keyCodes } from '../Functions/keyCodes';
/**
 * Checks that the pressed key's `keyCode` is one of alphanumeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of alpha numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var isAlphaNumericKey = function (keyCode) {
    return (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_Z) ||
        isNumpadNumericKey(keyCode) ||
        (keyCode >= keyCodes.MULTIPLY && keyCode <= keyCodes.DIVIDE) ||
        (keyCode >= keyCodes.SEMICOLON && keyCode <= keyCodes.SINGLE_QUOTE) ||
        keyCode === keyCodes.SPACE;
};
/**
 * Checks that the pressed key's `keyCode` is one of numeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var inNumericKey = function (keyCode) {
    return (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) || isNumpadNumericKey(keyCode);
};
/**
 * Checks that the pressed key's `keyCode` is one of numpad keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numpad keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var isNumpadNumericKey = function (keyCode) { return (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9); };
/**
 * Checks that the pressed key's `keyCode` is allow while typing numeric value e.g. `-3.14`
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of allowed on typing numeric value
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var isAllowedOnNumberTypingKey = function (keyCode) {
    return (keyCode >= keyCodes.COMMA && keyCode <= keyCodes.PERIOD) || keyCode === keyCodes.DECIMAL;
};
/**
 * Checks that the pressed key's `keyCode` is one of navigation keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of navigation keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var isNavigationKey = function (keyCode) {
    return keyCode === keyCodes.LEFT_ARROW || keyCode === keyCodes.RIGHT_ARROW ||
        keyCode === keyCodes.UP_ARROW || keyCode === keyCodes.DOWN_ARROW ||
        keyCode === keyCodes.END || keyCode === keyCodes.HOME ||
        keyCode === keyCodes.BACKSPACE || keyCode === keyCodes.DELETE;
};
