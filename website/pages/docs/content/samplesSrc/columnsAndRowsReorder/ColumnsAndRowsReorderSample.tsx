import * as React from "react";
import { ReactGrid, Column, Row, Id } from "@silevis/reactgrid";
import "./styling.scss";


interface Person {
    id: number;
    name: string;
    surname: string;
}

const getPeople = (): Person[] => [
    { id: 1, name: "Thomas", surname: "Goldman" },
    { id: 2, name: "Susie", surname: "Quattro" },
    { id: 3, name: "", surname: "" }
];

interface ColumnMap {
    name: 'Name';
    surname: 'Surname';
}

const columnMap: ColumnMap = {
    name: 'Name',
    surname: 'Surname'
};

type ColumnId = keyof ColumnMap;

const getColumns = (): Column[] => [
    { columnId: 'name', width: 150, reorderable: true },
    { columnId: 'surname', width: 200, reorderable: true }
];

const getRows = (people: Person[], columnsOrder: ColumnId[]): Row[] => {
    return [
        {
            rowId: "header",
            cells: [
                { type: "header", text: columnMap[columnsOrder[0]] },
                { type: "header", text: columnMap[columnsOrder[1]] }
            ]
        },
        ...people.map<Row>((person, idx) => ({
            rowId: person.id,
            reorderable: true,
            cells: [
                { type: "text", text: person[columnsOrder[0]] },
                { type: "text", text: person[columnsOrder[1]] }
            ]
        }))
    ]
};

const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
    const movedElements = arr.filter((_, idx) => idxs.includes(idx));
    const targetIdx = Math.min(...idxs) < to ? to += 1 : to -= idxs.filter(idx => idx < to).length;
    const leftSide = arr.filter((_, idx) => idx < targetIdx && !idxs.includes(idx));
    const rightSide = arr.filter((_, idx) => idx >= targetIdx && !idxs.includes(idx));
    return [...leftSide, ...movedElements, ...rightSide];
}

const handleCanReorderRows = (targetRowId: Id, rowIds: Id[]): boolean => {
    return targetRowId !== 'header';
}

export const ColumnsAndRowsReorderSample = () => {
    const [people, setPeople] = React.useState<Person[]>(getPeople());
    const [columns, setColumns] = React.useState<Column[]>(getColumns());

    const rows = getRows(people, columns.map(c => c.columnId as ColumnId));

    const handleColumnsReorder = (targetColumnId: Id, columnIds: Id[]) => {
        const to = columns.findIndex((column) => column.columnId === targetColumnId);
        const columnIdxs = columnIds.map((columnId) => columns.findIndex((c) => c.columnId === columnId));
        setColumns(prevColumns => reorderArray(prevColumns, columnIdxs, to));
    }

    const handleRowsReorder = (targetRowId: Id, rowIds: Id[]) => {
        setPeople((prevPeople) => {
            const to = people.findIndex(person => person.id === targetRowId);
            const rowsIds = rowIds.map((id) => people.findIndex(person => person.id === id));
            return reorderArray(prevPeople, rowsIds, to);
        });
    }

    return <ReactGrid
        rows={rows}
        columns={columns}
        onColumnsReordered={handleColumnsReorder}
        onRowsReordered={handleRowsReorder}
        canReorderRows={handleCanReorderRows}
        enableRowSelection
        enableColumnSelection
    />;
}
