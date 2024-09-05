import { Column } from '@silevis/reactgrid';

export const columns = (): Column[] => [
    { columnId: "Name", resizable: true, width: 100 },
    { columnId: "Surname", resizable: true, width: 100 }
];

