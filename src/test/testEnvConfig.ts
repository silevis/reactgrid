import { CellLocation, Highlight, TextLabels } from './../core';

/**
 * All of the properties that cypress tests files can read
 */
export const config: TestConfig = {
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
    }
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

export interface TestConfig {
    pinToBody: boolean;
    additionalContent: boolean;
    flexRow: boolean;
    isPro: boolean;

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

    labels: TextLabels;
}
