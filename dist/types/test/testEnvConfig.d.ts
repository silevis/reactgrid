import React from 'react';
import { CellLocation, Highlight, TextLabels } from './../core';
/**
 * All of the properties that cypress tests files can read
 */
export declare const config: TestConfig;
/**
 * Optional properties to override main config
 */
export declare const enablePinnedToBodyConfig: TestConfig;
export declare const disabledInitialFocusLocationConfig: TestConfig;
export declare const enableAdditionalContentConfig: TestConfig;
export declare const enableAdditionalContentWithFlexRowConfig: TestConfig;
export declare const enableSymetric: TestConfig;
export declare const enableResponsiveSticky: TestConfig;
export declare const enableResponsiveStickyPinnedToBody: TestConfig;
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
    horizontalStickyBreakpoint?: number;
    verticalStickyBreakpoint?: number;
    fillViewport?: boolean;
    withDivComponentStyles: React.CSSProperties;
}
