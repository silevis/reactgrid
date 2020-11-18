import * as React from 'react';
import { HiddenElement } from './HiddenElement';
import { ErrorBoundary } from './ErrorBoundary';
export var GridRenderer = function (_a) {
    var _b, _c;
    var state = _a.state, eventHandlers = _a.eventHandlers, children = _a.children;
    var cellMatrix = state.cellMatrix;
    return (React.createElement(ErrorBoundary, null,
        React.createElement("div", { className: 'reactgrid', "data-cy": "reactgrid", style: {
                position: 'relative',
                width: ((_b = state.props) === null || _b === void 0 ? void 0 : _b.enableFullWidthHeader) ? '100%' : cellMatrix.width,
                height: cellMatrix.height
            }, ref: eventHandlers.reactgridRefHandler },
            React.createElement("div", { className: 'reactgrid-content', onKeyDown: eventHandlers.keyDownHandler, onKeyUp: eventHandlers.keyUpHandler, onPointerDown: eventHandlers.pointerDownHandler, onPasteCapture: eventHandlers.pasteCaptureHandler, onPaste: eventHandlers.pasteHandler, onCopy: eventHandlers.copyHandler, onCut: eventHandlers.cutHandler, onBlur: eventHandlers.blurHandler, "data-cy": 'reactgrid-content', style: {
                    width: ((_c = state.props) === null || _c === void 0 ? void 0 : _c.enableFullWidthHeader) ? '100%' : cellMatrix.width,
                    height: cellMatrix.height,
                } },
                children,
                React.createElement(HiddenElement, { state: state, hiddenElementRefHandler: eventHandlers.hiddenElementRefHandler })))));
};
