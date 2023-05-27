import * as React from "react";
import { Range } from "../../core";
export interface PartialAreaProps {
    range: Range;
    pane: Range;
    style: React.CSSProperties;
    className?: string;
}
export declare const PartialArea: React.FC<PartialAreaProps>;
