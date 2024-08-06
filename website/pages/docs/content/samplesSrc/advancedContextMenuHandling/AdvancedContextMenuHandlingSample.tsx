import * as React from "react";
import {
    ReactGrid,
    CellChange,
    Id,
    MenuOption,
    SelectionMode,
    Column,
    Row,
} from "@silevis/reactgrid";
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

export const AdvancedContextMenuHandlingSample = () => {
    const [people, setPeople] = React.useState<Person[]>(getPeople());
    const [columns] = React.useState<Column[]>(getColumns());

    const rows = getRows(people);

    const handleChanges = (changes: CellChange[]) => {
        setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    };

    const handleContextMenu = (
        selectedRowIds: Id[],
        selectedColIds: Id[],
        selectionMode: SelectionMode,
        menuOptions: MenuOption[]
    ): MenuOption[] => {
        if (selectionMode === "row") {
            menuOptions = [
                ...menuOptions,
                {
                    id: "removePerson",
                    label: "Remove person",
                    handler: () => {
                        setPeople(prevPeople => {
                            return [...prevPeople.filter((person, idx) => !selectedRowIds.includes(idx))]
                        })
                    }
                }
            ];
        }
        return menuOptions;
    }

    return (
        <ReactGrid
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
            onContextMenu={handleContextMenu}
            enableFillHandle
            enableRangeSelection
            enableRowSelection
        />
    );
}