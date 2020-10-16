import { SliceDirection, Range } from '../Model/Range';


const rangeSlicer = (direction: SliceDirection) => (range: Range) => (rangeToSlice: Range) => (): Range => range.slice(rangeToSlice, direction);

export const columnsSlicer = rangeSlicer('columns');
export const rowsSlicer = rangeSlicer('rows');