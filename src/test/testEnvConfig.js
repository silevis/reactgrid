// TODO is necessary to export this file (export only definition)
export const config = {
    pinToBody: true,
    enableAdditionalContent: false,
    flexRow: false,

    rgViewportHeight: 600,
    rgViewportWidth: 1150,
    margin: '0',
    enableRangeSelection: true,
    enableFillHandle: true,

    cellHeight: 25,
    cellWidth: 150,
    minCellWidth: 40,
    fillHandleWidth: 18,

    columns: 9,
    rows: 150,

    lineWidth: 1,

    stickyTop: 1,
    stickyBottom: 3,
    stickyLeft: 1,
    stickyRight: 2,

    firstRowType: 'header'
}

if (typeof exports === "object" && typeof module === "object") { // added for backwards compability without ES6 imports
    module.exports = config;
}