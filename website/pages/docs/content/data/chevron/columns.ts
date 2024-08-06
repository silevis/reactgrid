import { Column } from '@silevis/reactgrid';

export const columns = (reorderable: boolean, resizable: boolean): Column[] => [
  { columnId: 'id', reorderable, resizable, width: 250 },
  { columnId: 'branchName', reorderable, resizable, width: 150 },
  { columnId: 'commitHash', reorderable, resizable, width: 400 },
  { columnId: 'added', reorderable, resizable, width: 100 },
  { columnId: 'removed', reorderable, resizable, width: 100 },
  { columnId: 'author', reorderable, resizable, width: 150 },
  { columnId: 'date', reorderable, resizable, width: 100 },
];

