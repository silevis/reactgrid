var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as React from 'react';
import { GridRenderer } from './GridRenderer';
import { PanesRenderer } from './PanesRenderer';
import { handleStateUpdate } from '../Functions/handleStateUpdate';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';
import { notifyAboutReactGridPro } from '../Functions/notifyAboutReactGridPro';
import { componentDidUpdate } from '../Functions/componentDidUpdate';
import { EventHandlers } from '../Model/EventHandlers';
import { defaultStateFields } from '../Model/State';
import { PointerEventsController } from '../Model/PointerEventsController';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { CellEditorRenderer, cellEditorCalculator } from './CellEditor';
import { CellRenderer } from './CellRenderer';
var ReactGrid = /** @class */ (function (_super) {
    __extends(ReactGrid, _super);
    function ReactGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.updateState = function (state) { return _this.setState(state); };
        _this.stateUpdater = function (modifier) { return handleStateUpdate(modifier(_this.state), _this.state, _this.props, _this.updateState); };
        _this.pointerEventsController = new PointerEventsController(_this.stateUpdater);
        _this.eventHandlers = new EventHandlers(_this.stateUpdater, _this.pointerEventsController);
        _this.cellMatrixBuilder = new CellMatrixBuilder();
        _this.state = __assign({ update: _this.stateUpdater, cellMatrix: _this.cellMatrixBuilder.setProps(_this.props).fillRowsAndCols().fillSticky().fillScrollableRange()
                .setEdgeLocations().getCellMatrix() }, defaultStateFields);
        return _this;
    }
    ReactGrid.getDerivedStateFromProps = function (props, state) {
        try {
            return getDerivedStateFromProps(props, state);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    ReactGrid.prototype.componentDidUpdate = function (prevProps, prevState) {
        componentDidUpdate(prevProps, prevState, this.state);
    };
    ReactGrid.prototype.componentDidMount = function () {
        notifyAboutReactGridPro(this.state);
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    };
    ReactGrid.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    };
    ReactGrid.prototype.render = function () {
        var _a = this, state = _a.state, eventHandlers = _a.eventHandlers;
        if (state.legacyBrowserMode) {
            return React.createElement(LegacyBrowserGridRenderer, { state: state, eventHandlers: eventHandlers });
        }
        else {
            return (React.createElement(GridRenderer, { state: state, eventHandlers: eventHandlers },
                React.createElement(PanesRenderer, { state: state, cellRenderer: CellRenderer }),
                state.currentlyEditedCell && React.createElement(CellEditorRenderer, { state: state, positionCalculator: cellEditorCalculator })));
        }
    };
    return ReactGrid;
}(React.Component));
export { ReactGrid };
;
