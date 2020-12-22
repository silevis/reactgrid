import * as React from 'react';
// TODO make HOC for highlights 
export var CellFocus = function (_a) {
    var borderColor = _a.borderColor, isHighlight = _a.isHighlight, location = _a.location, className = _a.className;
    return (React.createElement("div", { key: borderColor, className: (isHighlight ? 'rg-cell-highlight' : 'rg-cell-focus') + " " + (className || ''), style: {
            top: location.row.top - (location.row.top === 0 ? 0 : 1),
            left: location.column.left - (location.column.left === 0 ? 0 : 1),
            width: location.column.width + (location.column.left === 0 ? 0 : 1),
            height: location.row.height + (location.row.top === 0 ? 0 : 1),
            borderColor: "" + borderColor,
        } }));
};
