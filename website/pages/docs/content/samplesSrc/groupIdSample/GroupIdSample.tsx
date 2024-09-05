import * as React from "react";
import { ReactGrid, Column, Row, CellChange, MenuOption, SelectionMode, Id } from "@silevis/reactgrid";
import "./styling.scss";
import "@silevis/reactgrid/styles.css";


export const GroupIdSample: React.FC = () => {
    const [columns] = React.useState<Column[]>(() => [
        { columnId: "Name", width: 200 },
        { columnId: "Surname" },
        { columnId: "Birth Data", width: 100 },
    ]);

    const [rows, setRows] = React.useState<Row[]>(() => [
        {
            rowId: 0,
            cells: [
                { type: "header", text: 'Name' },
                { type: "header", text: "Surname" },
                { type: "header", text: "Birth Data" },
            ]
        },
        {
            rowId: 1,
            cells: [
                { type: "text", text: "Thomas Anthony", groupId: 'group: A' },
                { type: "text", text: "Goldman", groupId: 'group: B' },
                { type: "date", date: new Date("1989-04-01") },
            ]
        },
        {
            rowId: 2,
            cells: [
                { type: "text", text: "Susie Evelyn", groupId: 'group: A' },
                { type: "text", text: "Spencer", groupId: 'group: B' },
                { type: "date", date: new Date("1967-11-02") },
            ]
        },
        {
            rowId: 3,
            cells: [
                { type: "text", text: "Nancy" },
                { type: "text", text: "Gibbons", groupId: 'group: C' },
                { type: "date", date: new Date("1976-02-08") },
            ]
        },
        {
            rowId: 4,
            cells: [
                { type: "text", text: "Jose" },
                { type: "text", text: "Bell", groupId: 'group: C' },
                { type: "date", date: new Date("1966-10-12") },
            ]
        },
        {
            rowId: 5,
            cells: [
                { type: "text", text: "Jim", groupId: 'group: A' },
                { type: "text", text: "Hurst", groupId: 'group: C' },
                { type: "date", date: new Date("1976-08-30") },
            ]
        },
        {
            rowId: 6,
            cells: [
                { type: "text", text: "Laura" },
                { type: "text", text: "Pepper", groupId: 'group: C' },
                { type: "date", date: new Date("1956-05-01") },
            ]
        },
        {
            rowId: 7,
            cells: [
                { type: "text", text: "Sandra" },
                { type: "text", text: "Pollock", groupId: 'group: C' },
                { type: "date", date: new Date("1956-05-01") },
            ]
        },
        {
            rowId: 8,
            cells: [
                { type: "text", text: "" },
                { type: "text", text: "" },
                { type: "date", date: undefined },
            ]
        }
    ]);

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        return menuOptions;
    }

    const handleChanges = (changes: CellChange[]) => {
        setRows((prevRows) => {
            changes.forEach(change => {
                const changeRowIdx = prevRows.findIndex(el => el.rowId === change.rowId);
                const changeColumnIdx = columns.findIndex(el => el.columnId === change.columnId);
                prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
            });
            return [...prevRows];
        });
    };

    return (
        <ReactGrid
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
            onContextMenu={handleContextMenu}
            enableFillHandle
            enableRangeSelection
            enableGroupIdRender
        />
    );
}


