import * as React from "react";
import { ReactGrid, CellChange, Id, MenuOption, SelectionMode, Row, Column } from "@silevis/reactgrid";
import "./styling.scss";
import "@silevis/reactgrid/styles.css";

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
    { columnId: "name", width: 150 },
    { columnId: "surname", width: 150 }
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

const applyChangesToPeople = (
    changes: CellChange[],
    prevPeople: Person[]
): Person[] => {
    changes.forEach((change) => {
        if (change.newCell.type === 'text') {
            const personIndex = change.rowId;
            const fieldName = change.columnId;
            prevPeople[personIndex][fieldName] = change.newCell.text;
        }
    });
    return [...prevPeople];
};

export const SimpleContextMenuHandlingSample = () => {
    const [people, setPeople] = React.useState<Person[]>(getPeople());

    const rows = getRows(people);
    const columns = getColumns();

    const handleChanges = (changes: CellChange[]) => {
        setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    };

    const simpleHandleContextMenu = (
        selectedRowIds: Id[],
        selectedColIds: Id[],
        selectionMode: SelectionMode,
        menuOptions: MenuOption[]
    ): MenuOption[] => {
        return menuOptions;
    }

    return (
        <ReactGrid
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
            onContextMenu={simpleHandleContextMenu}
        />
    );
}