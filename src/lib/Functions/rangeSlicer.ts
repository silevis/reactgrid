import { SliceDirection, Range } from '../Model';


const rangeSlicer = (direction: SliceDirection) => (range: Range) => (rangeToSlice: Range) => (): Range => range.slice(rangeToSlice, direction);

export const columnsSlicer = rangeSlicer('columns');
export const rowsSlicer = rangeSlicer('rows');