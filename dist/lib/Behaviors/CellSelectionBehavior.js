var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { focusLocation } from '../Functions/focusLocation';
import { Behavior } from '../Model/Behavior';
var CellSelectionBehavior = /** @class */ (function (_super) {
    __extends(CellSelectionBehavior, _super);
    function CellSelectionBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CellSelectionBehavior.prototype.handlePointerDown = function (event, location, state) {
        if (event.target.className === 'reactgrid-content')
            return state;
        return focusLocation(state, location);
    };
    return CellSelectionBehavior;
}(Behavior));
export { CellSelectionBehavior };
