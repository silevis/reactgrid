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
/**
 * All of the properties that cypress tests files can read
 */
export var config = {
    pinToBody: false,
    additionalContent: false,
    flexRow: false,
    isPro: false,
    rgViewportHeight: 600,
    rgViewportWidth: 1150,
    margin: '0',
    enableRangeSelection: true,
    enableFillHandle: true,
    enableFullWidthHeader: false,
    enableGroupIdRender: true,
    cellHeight: 25,
    cellWidth: 150,
    minCellWidth: 40,
    fillHandleWidth: 18,
    columns: 30,
    rows: 150,
    lineWidth: 1,
    stickyTop: 3,
    stickyBottom: 3,
    stickyLeft: 2,
    stickyRight: 2,
    focusLocation: { columnId: 'col-1', rowId: 'row-3' },
    initialFocusLocation: { columnId: 'col-1', rowId: 'row-2' },
    highlights: [
        { columnId: 'col-1', rowId: 'row-1', borderColor: '#00ff00' },
        { columnId: 'col-0', rowId: 'row-1', borderColor: 'red' },
    ],
    labels: {
        copyLabel: 'Copy me!',
        pasteLabel: 'Paste me!',
        cutLabel: 'Cut me!',
    },
    horizontalStickyBreakpoint: 100,
    verticalStickyBreakpoint: 100,
    withDivComponentStyles: {
        padding: 20,
        position: 'relative',
    },
};
/**
 * Optional properties to override main config
 */
export var enablePinnedToBodyConfig = __assign(__assign({}, config), { pinToBody: true, stickyTop: 5, stickyBottom: 5, stickyLeft: 3, stickyRight: 3 });
export var disabledInitialFocusLocationConfig = __assign(__assign({}, config), { initialFocusLocation: undefined });
export var enableAdditionalContentConfig = __assign(__assign({}, config), { additionalContent: true });
export var enableAdditionalContentWithFlexRowConfig = __assign(__assign({}, config), { additionalContent: true, flexRow: true });
export var enableSymetric = __assign(__assign({}, config), { cellHeight: 50, cellWidth: 50, stickyTop: 2, stickyBottom: 2, stickyLeft: 2, stickyRight: 2 });
export var enableResponsiveSticky = __assign(__assign({}, config), { fillViewport: true, stickyTop: 13, horizontalStickyBreakpoint: 45, verticalStickyBreakpoint: 45 });
export var enableResponsiveStickyPinnedToBody = __assign(__assign({}, config), { pinToBody: true, fillViewport: true, stickyTop: 13, horizontalStickyBreakpoint: 45, verticalStickyBreakpoint: 45 });
