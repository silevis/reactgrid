import { Range } from "../../core";

export function isRangeIntersects(range1: Range, range2: Range): boolean {
  return (
    range2.first.column.idx <= range1.last.column.idx &&
    range2.first.row.idx <= range1.last.row.idx &&
    range2.last.column.idx >= range1.first.column.idx &&
    range2.last.row.idx >= range1.first.row.idx
  );
}
