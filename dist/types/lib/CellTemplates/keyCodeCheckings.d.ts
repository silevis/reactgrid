/**
 * Checks that the pressed key's `keyCode` is one of alphanumeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of alpha numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const isAlphaNumericKey: (keyCode: number) => boolean;
/**
 * Similar to {@link isAlphaNumericKey} - checks that the provided `char` is one of alphanumeric characters
 *
 * @param {string} char character produced by `KeyboardEvent.key` field
 * @returns {boolean} Returns `true` if `char` is one of alphanumeric characters
 */
export declare const isCharAlphaNumeric: (char: string) => boolean;
/**
 * Helper function to check that the provided `key` produces printable character
 * @param key field from `KeyboardEvent` interface
 * @returns Returns `true` if `key` is one of printable characters
 */
export declare const isKeyPrintable: (key: string) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of numeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const inNumericKey: (keyCode: number) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of numpad keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numpad keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const isNumpadNumericKey: (keyCode: number) => boolean;
/**
 * Checks that the pressed key's `keyCode` is allow while typing numeric value e.g. `-3.14`
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of allowed on typing numeric value
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const isAllowedOnNumberTypingKey: (keyCode: number) => boolean;
/**
 * Similar to {@link isAllowedOnNumberTypingKey} - checks that the provided `char` is allowed while typing numeric value e.g. `-3.14`
 *
 * @param {string} char character produced by `KeyboardEvent.key` field
 * @returns {boolean} Returns `true` if `char` is one of allowed while typing numeric value
 */
export declare const isCharAllowedOnNumberInput: (char: string) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of navigation keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of navigation keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const isNavigationKey: (keyCode: number) => boolean;
