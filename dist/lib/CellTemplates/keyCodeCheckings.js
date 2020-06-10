import { keyCodes } from '../Functions/keyCodes';
export var isAlphaNumericKey = function (keyCode) {
    return (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_Z) ||
        isNumpadNumericKey(keyCode) ||
        (keyCode >= keyCodes.MULTIPLY && keyCode <= keyCodes.DIVIDE) ||
        (keyCode >= keyCodes.SEMICOLON && keyCode <= keyCodes.SINGLE_QUOTE) ||
        (keyCode === keyCodes.SPACE);
};
export var inNumericKey = function (keyCode) {
    return (keyCode >= keyCodes.KEY_0 && keyCode <= keyCodes.KEY_9) || isNumpadNumericKey(keyCode);
};
export var isNumpadNumericKey = function (keyCode) { return (keyCode >= keyCodes.NUMPAD_0 && keyCode <= keyCodes.NUMPAD_9); };
export var isAllowedOnNumberTypingKey = function (keyCode) {
    return ((keyCode >= keyCodes.COMMA && keyCode <= keyCodes.PERIOD) || keyCode === keyCodes.DECIMAL);
};
export var isNavigationKey = function (keyCode) {
    return (keyCode === keyCodes.LEFT_ARROW) || (keyCode === keyCodes.RIGHT_ARROW) ||
        keyCode === keyCodes.UP_ARROW || keyCode === keyCodes.DOWN_ARROW ||
        keyCode === keyCodes.END || keyCode === keyCodes.HOME ||
        keyCode === keyCodes.BACKSPACE || keyCode === keyCodes.DELETE;
};
