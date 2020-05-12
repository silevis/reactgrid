var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getCellProperty } from '../Functions/getCellProperty';
var HeaderCellTemplate = (function () {
    function HeaderCellTemplate() {
        this.isFocusable = function () { return false; };
        this.getStyle = function (cell) { return ({ background: 'rgba(0, 0, 0, 0.20)' }); };
    }
    HeaderCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var value = parseFloat(text);
        return __assign(__assign({}, uncertainCell), { text: text, value: value });
    };
    HeaderCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        return cell.text;
    };
    HeaderCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        return cell.className ? cell.className : '';
    };
    return HeaderCellTemplate;
}());
export { HeaderCellTemplate };
