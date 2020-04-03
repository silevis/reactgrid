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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as React from 'react';
import { State } from '../Model';
import { GridRenderer } from './GridRenderer';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { EventHandlers, } from '../Functions/EventHandlers';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';
import { notifyAboutReactGridPro } from '../Functions/notifyAboutReactGridPro';
var ReactGrid = (function (_super) {
    __extends(ReactGrid, _super);
    function ReactGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateUpdater = function (modifier) { return _this.handleStateUpdate(modifier(_this.state)); };
        _this.eventHandlers = new EventHandlers(_this.stateUpdater);
        _this.state = new State(_this.stateUpdater);
        return _this;
    }
    ReactGrid.getDerivedStateFromProps = function (props, state) {
        return getDerivedStateFromProps(props, state);
    };
    ReactGrid.prototype.componentDidMount = function () {
        notifyAboutReactGridPro(this.state);
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    };
    ReactGrid.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    };
    ReactGrid.prototype.render = function () {
        var Grid = this.state.legacyBrowserMode ? LegacyBrowserGridRenderer : GridRenderer;
        return React.createElement(Grid, { state: this.state, eventHandlers: this.eventHandlers });
    };
    ReactGrid.prototype.handleStateUpdate = function (state) {
        var changes = __spreadArrays(state.queuedCellChanges);
        if (changes.length > 0) {
            if (this.props.onCellsChanged) {
                this.props.onCellsChanged(__spreadArrays(changes));
            }
            ;
            changes.forEach(function () { return state.queuedCellChanges.pop(); });
        }
        if (state !== this.state) {
            this.setState(state);
        }
    };
    return ReactGrid;
}(React.Component));
export { ReactGrid };
;
