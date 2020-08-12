# ReactGrid MIT [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/silevis/reactgrid/blob/develop/LICENSE) [![npm downloads](https://img.shields.io/npm/dw/@silevis/reactgrid?label=npm%20downloads)](https://www.npmjs.com/package/@silevis/reactgrid) [![Gitter](https://badges.gitter.im/silevis-reactgrid/community.svg)](https://gitter.im/silevis-reactgrid/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Add spreadsheet-like behavior to your React app.

Before run you need to have installed:
- react": "^16.13.1"
- react-dom: "^16.13.1"

# Install

```shell
npm i @silevis/reactgrid
```

# Usage

### Import ReactGrid component

```tsx
import { ReactGrid } from "@silevis/reactgrid";
```

### Import css styles

Import basic CSS styles. This file is necessary to correctly display.

```tsx
import "@silevis/reactgrid/styles.css";
```

### Create a cell matrix

Time to define our data. It will be stored in [React Hook](https://reactjs.org/docs/hooks-intro.html). 
`useState` hook will be initialized with an object that contains two keys - `columns` and `rows`. 
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

### Handling changes

To be able to change any value inside the grid you have to implement your own handler. There is a basic handler code:

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

Open live demo on [codesandbox.io](https://codesandbox.io/s/reactgrid-handling-changes-crzfx?file=/src/index.tsx)

# Docs

Browse docs: [here](http://reactgrid.com/docs/)

# Licensing

ReactGrid is available in two versions, [MIT](https://github.com/silevis/reactgrid/blob/develop/LICENSE) (this package) which serve 
the full interface but is limited in functionality and PRO which is fully functional version. You can compare versions
[here](http://reactgrid.com/feature-comparison/).

(c) 2020 Silevis Software Sp. z o.o.

# Author

[Silevis Software](https://www.silevis.com/)

<p align="center">
  <a href="https://www.silevis.com/">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="200" />
  </a>
</p>