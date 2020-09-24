<p align="center">
  <h1>ReactGrid MIT</h1>

  ### Add spreadsheet-like behavior to your React app. 
</p>
<p align="center">

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/silevis/reactgrid/blob/develop/LICENSE) 
[![Build Status](https://dev.azure.com/Silevis/ReactGrid/_apis/build/status/GitHub-MIT/Upgrade%20version%20and%20publish?branchName=master)](https://dev.azure.com/Silevis/ReactGrid/_build/latest?definitionId=17&branchName=master) 
[![reactgrid](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/hwrqiy&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/hwrqiy/runs)

[![npm downloads](https://img.shields.io/npm/dw/@silevis/reactgrid?label=npm%20downloads)](https://www.npmjs.com/package/@silevis/reactgrid) 
[![Gitter](https://badges.gitter.im/silevis-reactgrid/community.svg)](https://gitter.im/silevis-reactgrid/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) 
[![MIT license](https://david-dm.org/silevis/reactgrid/dev-status.svg)](https://david-dm.org/silevis/reactgrid?type=dev)   [![npm version](https://badge.fury.io/js/%40silevis%2Freactgrid.svg)](https://badge.fury.io/js/%40silevis%2Freactgrid)

</p>


<p align="center">
  <img alt="Sample app" src="https://reactgrid.com/sample.gif" height="240px" />
</p>

Before run you need to have installed:
- react": "^16.13.1"
- react-dom: "^16.13.1"

# 💾 Install

```shell
npm i @silevis/reactgrid
```

# 🧩 Usage

### Import ReactGrid component

```tsx
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
```

###  Import css styles

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
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

function App() {
  const [columns] = React.useState<Column[]>(() => [
    { columnId: "Name", width: 100 },
    { columnId: "Surname", width: 100 }
  ]);
  const [rows] = React.useState<Row[]>(() => [
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
      cells: [
        { type: "text", text: "" },
        { type: "text", text: "" }
      ]
    }
  ]);

  return (
    <ReactGrid
      rows={state.rows}
      columns={state.columns}
    />
  );
}
```

### Handling changes

To be able to change any value inside the grid you have to implement your own handler. 

Add `CellChange` interface to your imports:

```ts
import { ReactGrid, Column, Row, CellChange } from "@silevis/reactgrid";
```

There is a basic handler code:

```ts
const handleChanges = (changes: CellChange[]) => {
  setRows((prevRows) => {
    changes.forEach((change) => {
      const changeRowIdx = prevRows.findIndex(
        (el) => el.rowId === change.rowId
      );
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
    });
    return [...prevRows];
  });
};
```

Then update ReactGrid's component props:

```tsx
return (
  <ReactGrid
    rows={rows}
    columns={columns}
    onCellsChanged={handleChanges}
  />  
)
```

Open live demo on [codesandbox.io](https://codesandbox.io/s/reactgrid-handling-changes-crzfx?file=/src/index.tsx)

## Other examples:
* [Creating custom cell template](https://codesandbox.io/s/reactgrid-creating-new-cell-template-pdiux)
* [Sticky panes](https://codesandbox.io/s/reactgrid-sticky-panes-oikll)
* [Chevron cell example](https://codesandbox.io/s/reactgrid-group-cell-example-fh1di?file=/src/index.tsx)
* [Cell highlights](https://codesandbox.io/s/reactgrid-highlights-8o8gq)
* [Custom styles](https://codesandbox.io/s/reactgrid-custom-styling-buwuw)
* [and a lot more here](https://reactgrid.com/docs/3.1/2-implementing-core-features/)

# 📗 Docs

Explore ReactGrid docs: [here](http://reactgrid.com/docs/)

# 📝 Licensing

ReactGrid is available in two versions, [MIT](https://github.com/silevis/reactgrid/blob/develop/LICENSE) (this package) which serve 
the full interface but is limited in functionality and PRO which is fully functional version. You can compare versions
[here](http://reactgrid.com/feature-comparison/).

(c) 2020 Silevis Software Sp. z o.o.

# 🏢 Authors

[Silevis Software](https://www.silevis.com/)

<p align="center">
  <a href="https://www.silevis.com/">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="200" />
  </a>
</p>