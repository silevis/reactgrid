## 1. Install ReactGrid from npm repository

```shell
npm i @silevis/reactgrid
```

## 2. Import ReactGrid component

```tsx
import { ReactGrid } from "@silevis/reactgrid";
```

## 3. Import css styles

Import file from `node_modules` directory. This file is necessary to correctly displaying.

```tsx
import "@silevis/reactgrid/dist/lib/assets/core.css";
```

## 4. Create a cell matrix

Time to define our data. It will be stored in [React Hook](https://reactjs.org/docs/hooks-intro.html). 
`useState` hook will be initialized with object that contains two keys - `columns` and `rows`. 
Both of them must be valid ReactGrid objects: `Columns` `Rows`.

```tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/dist/lib/assets/core.css";

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
        rowId: 2,
        cells: [{ type: "text", text: "" }, { type: "text", text: "" }]
      }
    ]
  }));

  return (
    <ReactGrid
      rows={state.rows}
      columns={state.columns}
      license={"non-commercial"}
    />
  );
}
```

## 4. Render your component
a
```tsx
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Open example on [codesandbox.io](https://codesandbox.io/s/reactgrid-getting-started-0754c)

## Docs

Browse docs: [click](http://reactgrid.com/docs/2.0.9/0-introduction/)

## Licensing

ReactGrid is distributed under [MIT](link) license.

(c) 2020 Silevis Sorftware

## Author

[Silevis Software](https://www.silevis.com/)

<p align="center">
  <a href="https://www.silevis.com/">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="120" />
  </a>
</p>