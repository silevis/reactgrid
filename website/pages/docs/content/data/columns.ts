import { Column } from '@silevis/reactgrid-4';
export const columns = (reorderable: boolean, resizable: boolean): Column[] => [
  { columnId: 'company', reorderable, resizable, width: 130 }, // text
  { columnId: 'country', reorderable, resizable, width: 70 }, // flag
  { columnId: 'creation-date', reorderable, resizable, width: 130 }, // date
  { columnId: 'revenues', reorderable, resizable, width: 110 }, // number
  { columnId: 'rate', reorderable, resizable, width: 140 }, // rate
];

export default function Def() {
  return null;
}
