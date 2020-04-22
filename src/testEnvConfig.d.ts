export interface Config {
    pinToBody: boolean;
    enableAdditionalContent: boolean;
    flexRow: boolean;

    rgViewportHeight: number;
    rgViewportWidth: number;
    margin: string;

    cellHeight: number;
    cellWidth: number;
    minCellWidth: number;
    fillHandleWidth: number;

    columns: number;
    rows: number;

    lineWidth: number;

    stickyTop: number;
    stickyBottom: number;
    stickyLeft: number;
    stickyRight: number;

    firstRowType: string;
}

export declare const config: Config;