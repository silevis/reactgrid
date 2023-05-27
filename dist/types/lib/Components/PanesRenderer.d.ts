import * as React from "react";
import { CellRendererProps } from "../../core";
export interface PanesProps {
    cellRenderer: React.FC<CellRendererProps>;
}
export declare const PanesRenderer: React.FC<PanesProps>;
