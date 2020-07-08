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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useState } from 'react';
import '../styles.scss';
import { FlagCellTemplate } from './flagCell/FlagCellTemplate';
var emailValidator = function (email) {
    var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regex.test(email.replace(/\s+/g, ''));
};
export var TestGrid = function (props) {
    var myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
    var myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    var myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' });
    var _a = useState(function () {
        var columns = new Array(props.config.columns).fill(0).map(function (_, ci) { return ({
            columnId: "col-" + ci,
            resizable: true, reorderable: true, width: props.config.cellWidth,
        }); });
        var rows = new Array(props.config.rows).fill(0).map(function (_, ri) {
            return {
                rowId: "row-" + ri,
                reorderable: true, height: props.config.cellHeight,
                cells: columns.map(function (_, ci) {
                    if (ri === 0)
                        return { type: props.config.firstRowType, text: ri + " - " + ci };
                    var now = new Date();
                    switch (ci) {
                        case 0:
                            return { type: 'group', text: ri + " - " + ci, parentId: ri, isExpanded: ri % 4 && undefined, hasChildrens: true };
                        case 1:
                            return { type: 'text', text: ri + " - " + ci };
                        case 2:
                            return { type: 'email', text: ri + "." + ci + "@bing.pl", validator: emailValidator };
                        case 3:
                            return { type: 'number', format: myNumberFormat, value: parseFloat(ri + "." + ci), nanToZero: false, hideZero: true };
                        case 4:
                            return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) };
                        case 5:
                            return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) };
                        case 6:
                            return { type: 'checkbox', checked: false, checkedText: 'Checked', uncheckedText: false };
                        case 7:
                            return { type: 'flag', text: 'bra' };
                        default:
                            return { type: 'text', text: ri + " - " + ci, validator: function () { } };
                    }
                })
            };
        });
        return { rows: rows, columns: columns };
    }), state = _a[0], setState = _a[1];
    var handleColumnResize = function (columnId, width, selectedColIds) {
        var newState = __assign({}, state);
        var setColumnWidth = function (columnIndex) {
            var resizedColumn = newState.columns[columnIndex];
            newState.columns[columnIndex] = __assign(__assign({}, resizedColumn), { width: width });
        };
        if (selectedColIds.includes(columnId)) {
            var stateColumnIndexes = newState.columns
                .filter(function (col) { return selectedColIds.includes(col.columnId); })
                .map(function (col) { return newState.columns.findIndex(function (el) { return el.columnId === col.columnId; }); });
            stateColumnIndexes.forEach(setColumnWidth);
        }
        else {
            var columnIndex = newState.columns.findIndex(function (col) { return col.columnId === columnId; });
            setColumnWidth(columnIndex);
        }
        setState(newState);
    };
    var handleChangesTest = function (changes) {
        changes.forEach(function (change) {
            if (change.type === 'text') {
                console.log(change.newCell.text);
            }
            if (change.type === 'checkbox') {
                console.log(change.initialCell.checked);
            }
        });
    };
    var handleChanges = function (changes) {
        var newState = __assign({}, state);
        changes.forEach(function (change) {
            var changeRowIdx = newState.rows.findIndex(function (el) { return el.rowId === change.rowId; });
            var changeColumnIdx = newState.columns.findIndex(function (el) { return el.columnId === change.columnId; });
            if (change.type === 'flag') {
            }
            if (change.type === 'text') {
            }
            if (change.type === 'checkbox') {
            }
            newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        });
        setState(newState);
    };
    var reorderArray = function (arr, idxs, to) {
        var movedElements = arr.filter(function (_, idx) { return idxs.includes(idx); });
        to = Math.min.apply(Math, idxs) < to ? to += 1 : to -= idxs.filter(function (idx) { return idx < to; }).length;
        var leftSide = arr.filter(function (_, idx) { return idx < to && !idxs.includes(idx); });
        var rightSide = arr.filter(function (_, idx) { return idx >= to && !idxs.includes(idx); });
        return __spreadArrays(leftSide, movedElements, rightSide);
    };
    var handleCanReorderColumns = function (targetColumnId, columnIds, dropPosition) {
        return true;
    };
    var handleCanReorderRows = function (targetColumnId, rowIds, dropPosition) {
        return true;
    };
    var handleColumnsReorder = function (targetColumnId, columnIds, dropPosition) {
        var to = state.columns.findIndex(function (column) { return column.columnId === targetColumnId; });
        var columnIdxs = columnIds.map(function (id, idx) { return state.columns.findIndex(function (c) { return c.columnId === id; }); });
        setState({
            columns: reorderArray(state.columns, columnIdxs, to),
            rows: state.rows.map(function (row) { return (__assign(__assign({}, row), { cells: reorderArray(row.cells, columnIdxs, to) })); }),
        });
    };
    var handleRowsReorder = function (targetRowId, rowIds, dropPosition) {
        var newState = __assign({}, state);
        var to = state.rows.findIndex(function (row) { return row.rowId === targetRowId; });
        var ids = rowIds.map(function (id) { return state.rows.findIndex(function (r) { return r.rowId === id; }); });
        setState(__assign(__assign({}, newState), { rows: reorderArray(state.rows, ids, to) }));
    };
    var handleContextMenu = function (selectedRowIds, selectedColIds, selectionMode, menuOptions) {
        if (selectionMode === 'row') {
            menuOptions = __spreadArrays(menuOptions, [
                {
                    id: 'rowOption', label: 'Custom menu row option',
                    handler: function (selectedRowIds, selectedColIds, selectionMode) { }
                },
            ]);
        }
        if (selectionMode === 'column') {
            menuOptions = __spreadArrays(menuOptions, [
                {
                    id: 'columnOption', label: 'Custom menu column option',
                    handler: function (selectedRowIds, selectedColIds, selectionMode) { }
                },
            ]);
        }
        return __spreadArrays(menuOptions, [
            {
                id: 'all', label: 'Custom menu option',
                handler: function (selectedRowIds, selectedColIds, selectionMode) { }
            },
        ]);
    };
    var handleFocusLocationChanged = function (location) { };
    var handleFocusLocationChanging = function (location) {
        return true;
    };
    var Component = props.component;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "test-grid-container", "data-cy": "div-scrollable-element", style: __assign(__assign(__assign({}, (!props.config.pinToBody && {
                height: props.containerHeight || props.config.rgViewportHeight,
                width: props.containerWidth || props.config.rgViewportWidth,
                margin: props.containerMargin || props.config.margin,
                overflow: 'auto',
            })), { position: 'relative' }), (props.config.flexRow && {
                display: 'flex',
                flexDirection: 'row'
            })) },
            props.config.enableAdditionalContent &&
                React.createElement(React.Fragment, null,
                    React.createElement(Logo, { isPro: props.isPro }),
                    React.createElement(Logo, { isPro: props.isPro }),
                    React.createElement(Logo, { isPro: props.isPro })),
            React.createElement(Component, { rows: state.rows, columns: state.columns, initialFocusLocation: { columnId: 'col-2', rowId: 'row-2' }, onCellsChanged: handleChanges, onColumnResized: handleColumnResize, customCellTemplates: { 'flag': new FlagCellTemplate() }, highlights: [{ columnId: 'col-1', rowId: 'row-1', borderColor: '#00ff00' }], stickyLeftColumns: props.enableSticky ? props.config.stickyLeft : undefined, stickyRightColumns: props.enableSticky ? props.config.stickyRight : undefined, stickyTopRows: props.enableSticky ? props.config.stickyTop : undefined, stickyBottomRows: props.enableSticky ? props.config.stickyBottom : undefined, canReorderColumns: handleCanReorderColumns, canReorderRows: handleCanReorderRows, onColumnsReordered: handleColumnsReorder, onRowsReordered: handleRowsReorder, onContextMenu: handleContextMenu, onFocusLocationChanged: handleFocusLocationChanged, onFocusLocationChanging: handleFocusLocationChanging, enableRowSelection: props.enableColumnAndRowSelection || false, enableColumnSelection: props.enableColumnAndRowSelection || false, enableFullWidthHeader: props.config.enableFullWidthHeader || false, enableRangeSelection: props.config.enableRangeSelection, enableFillHandle: props.config.enableFillHandle, labels: {} }),
            props.config.enableAdditionalContent &&
                React.createElement(React.Fragment, null,
                    React.createElement("h1", { style: { width: 3000 } }, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT",
                    React.createElement("h1", null, "TEXT"),
                    " Test WITH IT")),
        React.createElement("input", { type: 'text', "data-cy": "outer-input" }),
        React.createElement(Logo, { isPro: props.isPro }),
        props.config.enableAdditionalContent &&
            React.createElement(React.Fragment, null,
                React.createElement("h1", { style: { width: 3000 } }, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT",
                React.createElement("h1", null, "TEXT"),
                " Test WITH IT")));
};
var Logo = function (props) {
    return React.createElement("div", { style: { display: 'flex', minWidth: 185 } },
        React.createElement("h1", { style: { position: 'relative' } },
            "ReactGrid",
            props.isPro && React.createElement("div", { style: {
                    position: 'absolute',
                    top: '-0.5em',
                    right: 0,
                    height: '2.5em',
                    width: '2.5em',
                    transform: 'translateX(100%) rotate(90deg)',
                    background: 'gold',
                    fontSize: '0.3em',
                    color: 'black'
                } }, "PRO")));
};
export var withDiv = function (Component) {
    return function (_a) {
        var props = __rest(_a, []);
        Component.displayName = 'WithDivWrapperTestGrid';
        return (React.createElement("div", { style: {
                padding: 20,
                position: 'relative',
            } },
            React.createElement(Component, __assign({}, props))));
    };
};
export var ExtTestGrid = withDiv(TestGrid);
