import * as React from 'react';
import { HiddenElement } from './HiddenElement';
export var GridRenderer = function (props) {
    var _a, _b;
    var state = props.state, eventHandlers = props.eventHandlers, children = props.children;
    var cellMatrix = state.cellMatrix;
    return (React.createElement("div", { className: 'reactgrid', "data-cy": "reactgrid", style: {
            position: 'relative',
            width: ((_a = props.state.props) === null || _a === void 0 ? void 0 : _a.enableFullWidthHeader) ? '100%' : cellMatrix.width,
            height: cellMatrix.height
        }, ref: eventHandlers.reactgridRefHandler },
        React.createElement("div", { className: "reactgrid-content", onKeyDown: eventHandlers.keyDownHandler, onKeyUp: eventHandlers.keyUpHandler, onPointerDown: eventHandlers.pointerDownHandler, onPasteCapture: eventHandlers.pasteCaptureHandler, onPaste: eventHandlers.pasteHandler, onCopy: eventHandlers.copyHandler, onCut: eventHandlers.cutHandler, "data-cy": "reactgrid-content", style: {
                width: ((_b = props.state.props) === null || _b === void 0 ? void 0 : _b.enableFullWidthHeader) ? '100%' : cellMatrix.width,
                height: cellMatrix.height,
            } },
            children,
            React.createElement(HiddenElement, { hiddenElementRefHandler: eventHandlers.hiddenElementRefHandler, state: state }))));
};
