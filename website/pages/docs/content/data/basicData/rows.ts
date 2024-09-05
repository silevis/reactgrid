export const rows = (): any[] => [
    {
        rowId: 0,
        cells: [
            { type: "header", text: "Name" },
            { type: "header", text: "Surname" }
        ]
    },
    {
        rowId: 1,
        cells: [
            { type: "text", text: "Thomas" },
            { type: "text", text: "Goldman" }
        ]
    },
    {
        rowId: 2,
        cells: [
            { type: "text", text: "Susie" },
            { type: "text", text: "Spencer" }
        ]
    },
    {
        rowId: 3,
        cells: [{ type: "text", text: "" }, { type: "text", text: "" }]
    }
]