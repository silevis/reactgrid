# ReactGrid [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![npm downloads](https://img.shields.io/npm/dw/@silevis/reactgrid?label=npm%20downloads)](https://www.npmjs.com/package/@silevis/reactgrid)

Add spreadsheet-like behavior to your React app.

Before run you need to have installed:
- react": "^16.13.1"
- react-dom: "^16.13.1"

# Installation

```shell
npm i @silevis/reactgrid
```

# Usage

### Import ReactGrid component

```tsx
import { ReactGrid } from "@silevis/reactgrid";
```

### Import css styles

Import file from `node_modules` directory. This file is necessary to correctly displaying.

```tsx
import "@silevis/reactgrid/styles.css";
```

### Create a cell matrix

Time to define our data. It will be stored in [React Hook](https://reactjs.org/docs/hooks-intro.html). 
`useState` hook will be initialized with object that contains two keys - `columns` and `rows`. 
Both of them must be valid ReactGrid objects: `Columns` `Rows`.

```tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

function App() {
  const [state, setState] = useState(() => ({
    columns: [
      { columnId: "Name", width: 100 },
      { columnId: "Surname", width: 100 }
    ],
    rows: [
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
  }));

  return (
    <ReactGrid
      rows={state.rows}
      columns={state.columns}
    />
  );
}
```

Open live demo on [stackblitz.com](https://stackblitz.com/edit/reactgrid-getting-started)

### Handling changes

To be able to change any value inside grid you have to implement your own handler. There is a basic handler code:

```ts
const handleChanges = (changes: CellChange[]) => {
  const newState = { ...state };
  changes.forEach(change => {
    const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
    const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
    newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
  });
  setState(newState);
};
```

Then update ReactGrid's component props:

```tsx
return (
  <ReactGrid
    rows={state.rows}
    columns={state.columns}
    onCellsChanged={handleChanges}
  />  
)
```

Open live demo on [stackblitz.com](https://stackblitz.com/edit/reactgrid-handling-changes)

# Docs

Browse docs: [here](http://reactgrid.com/)

# Licensing

ReactGrid is distributed under [MIT](https://github.com/silevis/reactgrid/blob/develop/LICENSE) license.

(c) 2020 Silevis Software

# Author

[Silevis Software](https://www.silevis.com/)

<p align="center">
  <a href="https://www.silevis.com/">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="200" />
  </a>
</p>