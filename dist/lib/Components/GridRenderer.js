import * as React from 'react';
import { HiddenElement } from './HiddenElement';
export var GridRenderer = function (props) {
    var state = props.state, eventHandlers = props.eventHandlers, children = props.children;
    var cellMatrix = state.cellMatrix;
    return (React.createElement("div", { className: 'reactgrid', "data-cy": "reactgrid", style: {
            position: 'relative',
            width: cellMatrix.width,
            height: cellMatrix.height
        }, ref: eventHandlers.reactgridRefHandler },
        React.createElement("div", { className: "reactgrid-content", onKeyDown: eventHandlers.keyDownHandler, onKeyUp: eventHandlers.keyUpHandler, onPointerDown: eventHandlers.pointerDownHandler, onPasteCapture: eventHandlers.pasteCaptureHandler, onPaste: eventHandlers.pasteHandler, onCopy: eventHandlers.copyHandler, onCut: eventHandlers.cutHandler, "data-cy": "reactgrid-content", style: {
                width: cellMatrix.width,
                height: cellMatrix.height,
            } },
            children,
            React.createElement(HiddenElement, { hiddenElementRefHandler: eventHandlers.hiddenElementRefHandler, state: state }))));
};
