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
 * Checks that the pressed key's `keyCode` is one of navigation keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of navigation keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export declare const isNavigationKey: (keyCode: number) => boolean;
