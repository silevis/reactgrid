import * as React from 'react';
export var HiddenElement = function (_a) {
    var hiddenElementRefHandler = _a.hiddenElementRefHandler;
    return React.createElement("input", { className: 'rg-hidden-element', ref: hiddenElementRefHandler, inputMode: 'none' });
};
