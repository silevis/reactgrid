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
    rgViewportWidth: 800,
    margin: '0',
    enableRangeSelection: true,
    enableFillHandle: true,
    enableFullWidthHeader: false,
    enableGroupIdRender: true,
    disableVirtualScrolling: false,
    moveRightOnEnter: true,

    cellHeight: 25,
    cellWidth: 150,
    minCellWidth: 40,
    fillHandleWidth: 18,

    columns: 100,
    rows: 20,

    lineWidth: 1,

    stickyTop: 3,
    stickyBottom: 3,
    stickyLeft: 2,
    stickyRight: 2,

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

    focusLocation?: CellLocation;
    initialFocusLocation?: CellLocation;
    highlights?: Highlight[];
    spannedCells?: { idx: number, idy: number, colspan?: number, rowspan?: number }[];
    headerCells?: { idx: number, idy: number }[];


    labels: TextLabels;

    horizontalStickyBreakpoint?: number;
    verticalStickyBreakpoint?: number;

    fillViewport?: boolean;
    withDivComponentStyles: React.CSSProperties;

}
