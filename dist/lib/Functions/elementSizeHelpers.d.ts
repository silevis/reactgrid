import { State } from '../Model';
export declare function getSizeOfElement(element: any): {
    width: number;
    height: number;
};
export declare function getOffsetsOfElement(element: any): {
    offsetLeft: number;
    offsetTop: number;
};
export declare function getReactGridOffsets(state: State): {
    left: number;
    top: number;
};
export declare function getReactGridOffsetsForCellEditor(state: State): {
    left: number;
    top: number;
};
export declare function getVisibleSizeOfReactGrid(state: State): {
    width: number;
    height: number;
    visibleOffsetRight: number;
    visibleOffsetBottom: number;
};
export declare const getStickyOffset: (scroll: number, offset: number) => number;
