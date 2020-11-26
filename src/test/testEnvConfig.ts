import { TextCell, HeaderCell, CellLocation, Highlight, TextLabels } from './../core';

export const config: TestConfig = {
    pinToBody: false,
    enableAdditionalContent: false,
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
    stickyLeft: 1,
    stickyRight: 2,

    firstRowType: 'text',

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

export interface TestConfig {
    pinToBody: boolean;
    enableAdditionalContent: boolean;
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

    focusLocation: CellLocation | undefined;
    initialFocusLocation: CellLocation | undefined;

    highlights: Highlight[] | undefined;

    labels: TextLabels | undefined;

    firstRowType: TextCell['type'] | HeaderCell['type'];
}