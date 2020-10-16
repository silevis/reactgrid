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
// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
var HeaderCellTemplate = /** @class */ (function () {
    function HeaderCellTemplate() {
        this.isFocusable = function (cell) { return false; };
        this.getStyle = function (cell) { return ({ background: 'rgba(128, 128, 128, 0.1)' }); };
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
