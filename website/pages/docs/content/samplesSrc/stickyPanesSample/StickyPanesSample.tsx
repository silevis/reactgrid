import * as React from "react";
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "./styling.scss";
import "@silevis/reactgrid/styles.css";

interface Person {
    name: string;
    surname: string;
    birth: Date | undefined;
    mobile: number;
    company: string;
    occupation: string;
}

const getPeople = (): Person[] => [
    {
        name: "Thomas",
        surname: "Goldman",
        birth: new Date("1970-12-02"),
        mobile: 574839457,
        company: "Snatia Ebereum",
        occupation: "CEO"
    },
    {
        name: "Mathew Lawrence",
        surname: "Joshua",
        birth: new Date("1943-12-02"),
        mobile: 684739283,
        company: "De-Jaiz Mens Clothing",
        occupation: "Technical recruiter"
    },
    {
        name: "Susie Evelyn",
        surname: "Spencer",
        birth: new Date("1976-01-23"),
        mobile: 684739283,
        company: "Harold Powell",
        occupation: "Concrete paving machine operator"
    },
    {
        name: "",
        surname: "",
        birth: undefined,
        mobile: NaN,
        company: "",
        occupation: ""
    }
];

const getColumns = (): Column[] => [
    { columnId: "Name", width: 150 },
    { columnId: "Surname", width: 100 },
    { columnId: "Birth Data", width: 100 },
    { columnId: "Phone", width: 100 },
    { columnId: "Company", width: 150 },
    { columnId: "Occupation", width: 230 }
];

const headerRow: Row = {
    rowId: "header",
    cells: [
        { type: "header", text: "Name" },
        { type: "header", text: "Surname" },
        { type: "header", text: "Birth Data" },
        { type: "header", text: "Phone" },
        { type: "header", text: "Company" },
        { type: "header", text: "Occupation" }
    ]
};

const getRows = (people: Person[]): Row[] => [
    headerRow,
    ...people.map<Row>((person, idx) => ({
        rowId: idx,
        cells: [
            { type: "text", text: person.name },
            { type: "text", text: person.surname },
            { type: "date", date: person.birth },
            { type: "number", value: person.mobile },
            { type: "text", text: person.company },
            { type: "text", text: person.occupation }
        ]
    }))
];

export function StickyPanesSample() {
    const [people] = React.useState<Person[]>(getPeople());

    const rows = getRows(people);
    const columns = getColumns();

    return (
        <ReactGrid
            rows={rows}
            columns={columns}
            stickyLeftColumns={1}
            stickyRightColumns={1}
            stickyTopRows={1}
            stickyBottomRows={1}
            enableFillHandle
            enableRangeSelection
        />
    );
}