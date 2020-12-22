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
import React from 'react';
import '../styles.scss';
import { FlagCellTemplate } from './flagCell/FlagCellTemplate';
var emailValidator = function (email) {
    var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regex.test(email.replace(/\s+/g, ''));
};
var myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
var myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
var myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' });
var style = {
    border: {
        left: { color: 'red', style: 'dashed', width: '2px' },
        top: { color: 'red', style: 'dashed', width: '2px' },
        right: { color: 'red', style: 'dashed', width: '2px' },
        bottom: { color: 'red', style: 'dashed', width: '2px' }
    }
};
export var TestGrid = function (props) {
    var config = props.config, component = props.component, enableSticky = props.enableSticky, enableColumnAndRowSelection = props.enableColumnAndRowSelection, enableFrozenFocus = props.enableFrozenFocus, _a = props.firstRowType, firstRowType = _a === void 0 ? 'text' : _a, _b = props.firstColType, firstColType = _b === void 0 ? 'chevron' : _b;
    var _c = React.useState(function () { return new Array(config.columns).fill({ columnId: 0, resizable: true, reorderable: true, width: -1 })
        .map(function (_, ci) { return ({ columnId: "col-" + ci, resizable: true, reorderable: true, width: config.cellWidth }); }); }), columns = _c[0], setColumns = _c[1];
    var _d = React.useState(function () { return new Array(config.rows).fill(0).map(function (_, ri) { return ({
        rowId: "row-" + ri,
        reorderable: true,
        height: config.cellHeight,
        cells: columns.map(function (_, ci) {
            if (ri === 0)
                return { type: firstRowType, text: ri + " - " + ci };
            if (ri === 2 && ci === 8)
                return { type: 'text', text: "non-editable", nonEditable: true, validator: function (text) { return true; } };
            if (ri === 3 && ci === 8)
                return { type: 'text', text: '', placeholder: 'placeholder', validator: function (text) { return true; } };
            var now = new Date();
            switch (ci) {
                case 0:
                    return firstColType === 'chevron'
                        ? { type: 'chevron', groupId: !(ri % 3) ? 'A' : undefined, text: ri + " - " + ci, parentId: ri, isExpanded: ri % 4 ? true : undefined, hasChildren: true }
                        : { type: 'header', groupId: !(ri % 3) ? 'A' : undefined, text: ri + " - " + ci };
                case 1:
                    return { type: 'text', groupId: !(ri % 3) ? 'B' : undefined, text: ri + " - " + ci, style: style };
                case 2:
                    return { type: 'email', text: ri + "." + ci + "@bing.pl", validator: emailValidator };
                case 3:
                    return { type: 'number', format: myNumberFormat, value: parseFloat(ri + "." + ci), nanToZero: false, hideZero: true };
                case 4:
                    return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) };
                case 5:
                    return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) };
                case 6:
                    return { type: 'checkbox', checked: false, checkedText: 'Checked', uncheckedText: 'Unchecked' };
                case 7:
                    return { type: 'flag', groupId: Math.random() < .66 ? Math.random() < .5 ? 'A' : 'B' : undefined, text: 'bra' };
                case 8:
                    return {
                        type: 'dropdown', values: [
                            { value: 'react', label: 'React' },
                            { value: 'vue', label: 'Vue' },
                            { value: 'angular', label: 'Angular' }
                        ], currentValue: 'react', isDisabled: false
                    };
                // case 9: // TODO allow user to pass non focusable cell (header cell) with arrows
                //     return { type: 'header', text: `${ri} - ${ci}` }
                default:
                    return { type: 'text', text: ri + " - " + ci, validator: function (text) { return true; } };
            }
        })
    }); }); }), rows = _d[0], setRows = _d[1];
    var handleColumnResize = function (columnId, width, selectedColIds) {
        setColumns(function (prevColumns) {
            var setColumnWidth = function (columnIndex) {
                var resizedColumn = prevColumns[columnIndex];
                prevColumns[columnIndex] = __assign(__assign({}, resizedColumn), { width: width });
            };
            if (selectedColIds.includes(columnId)) {
                var stateColumnIndexes = prevColumns
                    .filter(function (col) { return selectedColIds.includes(col.columnId); })
                    .map(function (col) { return prevColumns.findIndex(function (el) { return el.columnId === col.columnId; }); });
                stateColumnIndexes.forEach(setColumnWidth);
            }
            else {
                var columnIndex = prevColumns.findIndex(function (col) { return col.columnId === columnId; });
                setColumnWidth(columnIndex);
            }
            return __spreadArrays(prevColumns);
        });
    };
    // eslint-disable-next-line
    var handleChangesTest = function (changes) {
        changes.forEach(function (change) {
            var ax = Math.random() > .5 ? 'text' : 'number';
            if (change.newCell.type === ax) {
                console.log(change.newCell.type);
            }
            if (change.type === 'text') {
                console.log(change.newCell.text);
            }
            if (change.type === 'checkbox') {
                console.log(change.previousCell.checked);
            }
        });
    };
    // TODO ReactGrid should be able to handle this function
    // eslint-disable-next-line
    var handleChangesTest2 = function (changes) { };
    // eslint-disable-next-line
    rows[0].cells.find(function (cell) { return cell.type === "text" && cell.text; });
    var handleChanges = function (changes) {
        setRows(function (prevRows) {
            changes.forEach(function (change) {
                var changeRowIdx = prevRows.findIndex(function (el) { return el.rowId === change.rowId; });
                var changeColumnIdx = columns.findIndex(function (el) { return el.columnId === change.columnId; });
                if (change.type === 'flag') {
                    // console.log(change.newCell.text);
                }
                if (change.type === 'text') {
                    // console.log(change.newCell.text);
                }
                if (change.type === 'checkbox') {
                    // console.log(change.previousCell.checked);
                }
                prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
            });
            return __spreadArrays(prevRows);
        });
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
        // const rowIndex = state.rows.findIndex((row: Row) => row.rowId === targetColumnId);
        // if (rowIndex === 0) return false;
        return true;
    };
    var handleColumnsReorder = function (targetColumnId, columnIds, dropPosition) {
        var to = columns.findIndex(function (column) { return column.columnId === targetColumnId; });
        var columnIdxs = columnIds.map(function (id, idx) { return columns.findIndex(function (c) { return c.columnId === id; }); });
        setRows(rows.map(function (row) { return (__assign(__assign({}, row), { cells: reorderArray(row.cells, columnIdxs, to) })); }));
        setColumns(reorderArray(columns, columnIdxs, to));
    };
    var handleRowsReorder = function (targetRowId, rowIds, dropPosition) {
        setRows(function (prevRows) {
            var to = rows.findIndex(function (row) { return row.rowId === targetRowId; });
            var columnIdxs = rowIds.map(function (id) { return rows.findIndex(function (r) { return r.rowId === id; }); });
            return reorderArray(prevRows, columnIdxs, to);
        });
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
    var Component = component;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: 'test-grid-container', "data-cy": 'div-scrollable-element', style: __assign(__assign(__assign({}, (!config.pinToBody && {
                height: config.fillViewport ? "calc(100vh - 30px)" : config.rgViewportHeight,
                width: config.fillViewport ? "calc(100vw - 45px)" : config.rgViewportWidth,
                margin: config.margin,
                overflow: 'auto',
            })), { position: 'relative' }), (config.flexRow && {
                display: 'flex',
                flexDirection: 'row'
            })) },
            config.additionalContent &&
                React.createElement("div", { style: { height: config.rgViewportHeight + "px", backgroundColor: '#fafff3' } },
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth }),
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth }),
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth })),
            React.createElement(Component, { rows: rows, columns: columns, initialFocusLocation: config.initialFocusLocation, focusLocation: enableFrozenFocus ? config.focusLocation : undefined, 
                // onCellsChanged={handleChangesTest2} // TODO This handler should be allowed
                onCellsChanged: handleChanges, onColumnResized: handleColumnResize, customCellTemplates: { 'flag': new FlagCellTemplate() }, highlights: config.highlights, stickyLeftColumns: enableSticky ? config.stickyLeft : undefined, stickyRightColumns: enableSticky ? config.stickyRight : undefined, stickyTopRows: enableSticky ? config.stickyTop : undefined, stickyBottomRows: enableSticky ? config.stickyBottom : undefined, canReorderColumns: handleCanReorderColumns, canReorderRows: handleCanReorderRows, onColumnsReordered: handleColumnsReorder, onRowsReordered: handleRowsReorder, onContextMenu: handleContextMenu, onFocusLocationChanged: handleFocusLocationChanged, onFocusLocationChanging: handleFocusLocationChanging, enableRowSelection: enableColumnAndRowSelection || false, enableColumnSelection: enableColumnAndRowSelection || false, enableFullWidthHeader: config.enableFullWidthHeader || false, enableRangeSelection: config.enableRangeSelection, enableFillHandle: config.enableFillHandle, enableGroupIdRender: config.enableGroupIdRender, labels: config.labels, horizontalStickyBreakpoint: config.horizontalStickyBreakpoint, verticalStickyBreakpoint: config.verticalStickyBreakpoint }),
            config.additionalContent &&
                React.createElement("div", { style: { height: config.rgViewportHeight + "px", backgroundColor: '#fafff3' } },
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth }),
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth }),
                    React.createElement(Logo, { isPro: config.isPro, width: config.rgViewportWidth }))),
        !config.fillViewport &&
            React.createElement(React.Fragment, null,
                React.createElement("input", { type: 'text', "data-cy": 'outer-input' }),
                React.createElement(Logo, { isPro: config.isPro })),
        React.createElement(TestGridOptionsSelect, { isPro: config.isPro }),
        config.additionalContent &&
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
var Logo = function (_a) {
    var isPro = _a.isPro, width = _a.width;
    return React.createElement("div", { style: { display: 'flex', width: width + "px" } },
        React.createElement("h1", { style: { position: 'relative' } },
            "ReactGrid",
            isPro && React.createElement("div", { style: {
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
export var TestGridOptionsSelect = function (_a) {
    var isPro = _a.isPro;
    var navigate = function (eventValue) {
        window.location.pathname = eventValue;
    };
    return (React.createElement("form", null,
        React.createElement("select", { defaultValue: window.location.pathname, onChange: function (event) { return navigate(event.target.value); } },
            React.createElement("option", { value: '/' }, "/"),
            React.createElement("option", { value: '/enableHeaders' }, "Enable headers"),
            React.createElement("option", { value: '/enableSticky' }, "Enable sticky"),
            React.createElement("option", { value: '/enableFrozenFocus' }, "Enable frozen focus"),
            React.createElement("option", { value: '/enablePinnedToBody' }, "Enable pinned to body"),
            React.createElement("option", { value: '/enableStickyPinnedToBody' }, "Enable sticky pinned to body"),
            React.createElement("option", { value: '/enableAdditionalContent' }, "Enable additional content"),
            React.createElement("option", { value: '/enableSymetric' }, "Enable symetric"),
            React.createElement("option", { value: '/enableFrozenFocus' }, "Enable frozen focus"),
            React.createElement("option", { value: '/enableResponsiveSticky' }, "Enable responsive sticky"),
            React.createElement("option", { value: '/enableResponsiveStickyPinnedToBody' }, "Enable responsive sticky pinned to body"),
            isPro && React.createElement(React.Fragment, null,
                React.createElement("option", { value: '/enableColumnAndRowSelection' }, "Enable column and row selection"),
                React.createElement("option", { value: '/enableColumnAndRowSelectionWithSticky' }, "Enable column and row selection with sticky"),
                React.createElement("option", { value: '/enableResponsiveStickyPro' }, "Enable responsive sticky PRO"),
                React.createElement("option", { value: '/enableResponsiveStickyPinnedToBodyPro' }, "Enable responsive sticky pinned to body PRO")))));
};
export var withDiv = function (Component) {
    return function (_a) {
        var props = __rest(_a, []);
        Component.displayName = 'WithDivWrapperTestGrid';
        return (React.createElement("div", { style: __assign({}, props.config.withDivComponentStyles) },
            React.createElement(Component, __assign({}, props))));
    };
};
export var ExtTestGrid = withDiv(TestGrid);
