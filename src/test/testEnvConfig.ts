import React from 'react';
import { CellLocation, Highlight, TextLabels } from '../core';

/**
 * All of the properties that cypress tests files can read
 */
export const config: TestConfig = {
    pinToBody: false,
    additionalContent: false,
    flexRow: false,

    rgViewportHeight: 600,
    rgViewportWidth: 1150,
    margin: '0',
    enableRangeSelection: true,
    enableFillHandle: true,
    enableFullWidthHeader: false,
    enableGroupIdRender: true,
    disableVirtualScrolling: false,
    moveRightOnEnter: true,

    cellHeight: 40,
    cellWidth: 150,
    minCellWidth: 40,
    minCellHeight: 25,
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

    headerCells: [
        { idx: 10, idy: 3 },
        { idx: 10, idy: 4 },
        { idx: 10, idy: 5 },
        { idx: 10, idy: 24 },
        { idx: 10, idy: 149 },
        { idx: 11, idy: 3 },
        { idx: 11, idy: 4 },
        { idx: 11, idy: 5 },
        { idx: 11, idy: 24 },
        { idx: 11, idy: 149 },
        { idx: 12, idy: 3 },
        { idx: 12, idy: 4 },
        { idx: 12, idy: 5 },
        { idx: 12, idy: 24 },
        { idx: 12, idy: 149 },
        { idx: 29, idy: 3 },
        { idx: 29, idy: 4 },
        { idx: 29, idy: 5 },
        { idx: 29, idy: 24 },
        { idx: 29, idy: 149 },
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

}

/**
 * Optional properties to override main config
 */
export const enablePinnedToBodyConfig: TestConfig = {
    ...config,
    pinToBody: true,
    stickyTop: 5,
    stickyBottom: 5,
    stickyLeft: 3,
    stickyRight: 3,
}

export const disabledInitialFocusLocationConfig: TestConfig = {
    ...config,
    initialFocusLocation: undefined
}

export const enableAdditionalContentConfig: TestConfig = {
    ...config,
    additionalContent: true,
}

export const enableAdditionalContentWithFlexRowConfig: TestConfig = {
    ...config,
    additionalContent: true,
    flexRow: true,
}

export const enableSymetric: TestConfig = {
    ...config,
    cellHeight: 50,
    cellWidth: 50,
    stickyTop: 2,
    stickyBottom: 2,
    stickyLeft: 2,
    stickyRight: 2,
}

export const disableVirtualScrolling: TestConfig = {
    ...config,
    disableVirtualScrolling: true,
}

export const enableTopLeftResponsiveSticky: TestConfig = {
    ...config,
    fillViewport: true,
    stickyTop: 13,
    stickyLeft: 2,
    stickyRight: 0,
    stickyBottom: 0,
    horizontalStickyBreakpoint: 45,
    verticalStickyBreakpoint: 45,
}

export const enableBottomRightResponsiveSticky: TestConfig = {
    ...config,
    fillViewport: true,
    stickyTop: 0,
    stickyLeft: 0,
    stickyRight: 2,
    stickyBottom: 13,
    horizontalStickyBreakpoint: 45,
    verticalStickyBreakpoint: 45,
}

export const enableTopLeftResponsiveStickyPinnedToBody: TestConfig = {
    ...config,
    pinToBody: true,
    fillViewport: true,
    stickyTop: 13,
    stickyLeft: 2,
    stickyRight: 0,
    stickyBottom: 0,
    horizontalStickyBreakpoint: 45,
    verticalStickyBreakpoint: 45,
}

export const enableBottomRightResponsiveStickyPinnedToBody: TestConfig = {
    ...config,
    pinToBody: true,
    fillViewport: true,
    stickyTop: 0,
    stickyLeft: 0,
    stickyRight: 2,
    stickyBottom: 13,
    horizontalStickyBreakpoint: 45,
    verticalStickyBreakpoint: 45,
}

export const enableSpannedCells: TestConfig = {
    ...config,
    spannedCells: [
        { idx: 1, idy: 1, rowspan: 2, colspan: 2 },
        { idx: 2, idy: 3, colspan: 3 },
        { idx: 6, idy: 5, rowspan: 5 },
    ],
    headerCells: [
        { idx: 2, idy: 1 },
        { idx: 1, idy: 2 },
        { idx: 2, idy: 2 },
        { idx: 3, idy: 3 },
        { idx: 4, idy: 3 },
        { idx: 6, idy: 5 },
        { idx: 6, idy: 6 },
        { idx: 6, idy: 7 },
        { idx: 6, idy: 8 },
        { idx: 6, idy: 9 },
    ]
}

export interface TestConfig {
    pinToBody: boolean;
    additionalContent: boolean;
    flexRow: boolean;

    rgViewportHeight: number;
    rgViewportWidth: number;
    margin: string;

    cellHeight: number;
    cellWidth: number;
    minCellWidth: number;
    minCellHeight: number;
    fillHandleWidth: number;
    enableRangeSelection: boolean;
    enableFillHandle: boolean;
    enableFullWidthHeader: boolean;
    enableGroupIdRender: boolean;
    disableVirtualScrolling: boolean;
    moveRightOnEnter: boolean;

    columns: number;
    rows: number;

    lineWidth: number;

    stickyTop: number;
    stickyBottom: number;
    stickyLeft: number;
    stickyRight: number;

    focusLocation: CellLocation;
    initialFocusLocation?: CellLocation;
    highlights: Highlight[];
    spannedCells?: { idx: number, idy: number, colspan?: number, rowspan?: number }[];
    headerCells?: { idx: number, idy: number }[];


    labels: TextLabels;

    horizontalStickyBreakpoint?: number;
    verticalStickyBreakpoint?: number;

    fillViewport?: boolean;
    withDivComponentStyles: React.CSSProperties;

}
