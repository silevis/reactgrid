import * as React from "react";
import { ReactGrid, Column, Row, Id } from "@silevis/reactgrid";
import "./styling.scss";

interface Person {
    name: string;
    surname: string;
}

const getPeople = (): Person[] => [
    { name: "Thomas", surname: "Goldman" },
    { name: "Susie", surname: "Quattro" },
    { name: "", surname: "" }
];

const getColumns = (): Column[] => [
    { columnId: "name", width: 150, resizable: true },
    { columnId: "surname", width: 150, resizable: true }
];

const headerRow: Row = {
    rowId: "header",
    cells: [
        { type: "header", text: "Name" },
        { type: "header", text: "Surname" }
    ]
};

const getRows = (people: Person[]): Row[] => [
    headerRow,
    ...people.map<Row>((person, idx) => ({
        rowId: idx,
        cells: [
            { type: "text", text: person.name },
            { type: "text", text: person.surname }
        ]
    }))
];

export function ColumnResizingSample() {
    const [people] = React.useState<Person[]>(getPeople());
    const [columns, setColumns] = React.useState<Column[]>(getColumns());

    const rows = getRows(people);

    const handleColumnResize = (ci: Id, width: number) => {
        setColumns((prevColumns) => {
            const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
            const resizedColumn = prevColumns[columnIndex];
            const updatedColumn = { ...resizedColumn, width };
            prevColumns[columnIndex] = updatedColumn;
            return [...prevColumns];
        });
    }

    return <ReactGrid rows={rows} columns={columns} onColumnResized={handleColumnResize} />;
}