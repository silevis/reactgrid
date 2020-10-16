import { Range } from '../Model/Range';
export declare const columnsSlicer: (range: Range) => (rangeToSlice: Range) => () => Range;
export declare const rowsSlicer: (range: Range) => (rangeToSlice: Range) => () => Range;
