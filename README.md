
# ReactGrid MIT

### Add spreadsheet-like behavior to your React app 🚀

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/silevis/reactgrid/blob/develop/LICENSE) 
[![Build Status](https://dev.azure.com/Silevis/ReactGrid/_apis/build/status/GitHub-MIT/Upgrade%20version%20and%20publish?branchName=master)](https://dev.azure.com/Silevis/ReactGrid/_build/latest?definitionId=17&branchName=master) 
[![reactgrid](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/hwrqiy&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/hwrqiy/runs)

[![Gitter](https://badges.gitter.im/silevis-reactgrid/community.svg)](https://gitter.im/silevis-reactgrid/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) 
[![MIT license](https://david-dm.org/silevis/reactgrid/dev-status.svg)](https://david-dm.org/silevis/reactgrid?type=dev)   [![npm version](https://badge.fury.io/js/%40silevis%2Freactgrid.svg)](https://badge.fury.io/js/%40silevis%2Freactgrid)

<img alt="Sample app" src="https://reactgrid.com/sample.gif" height="240px" />

### [Browse our website & docs](https://www.reactgrid.com/)

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
  const [columns] = useState<Column[]>(() => [
    { columnId: "Name", width: 100 },
    { columnId: "Surname", width: 100 }
  ]);
  const [rows] = useState<Row[]>(() => [
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
      rows={rows}
      columns={columns}
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

# Browser support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge"  />](http://godban.github.io/browsers-support-badges/) Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox"  />](http://godban.github.io/browsers-support-badges/) Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome"  />](http://godban.github.io/browsers-support-badges/) Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" />](http://godban.github.io/browsers-support-badges/) Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" />](http://godban.github.io/browsers-support-badges/) iOS/iPadOs Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung"/>](http://godban.github.io/browsers-support-badges/) Samsung internet | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" />](http://godban.github.io/browsers-support-badges/) Opera |
| :-: | :-: | :-: | :-: | :-: | :-: | :-:|
| 80+ | 61+ | 57+ | 13.1+ | 13+ | 9+ | 45+ |

# Integrations

  - Next.js

  At the moment we propose to use `next-transpile-modules` plugin ([docs](https://www.npmjs.com/package/next-transpile-modules#usage)).
  Your `next.config.js` file should looks like on the listing below:

  ```ts
    const withCSS = require("@zeit/next-css");

    const withTM = require("next-transpile-modules")([
      "@silevis/reactgrid",
      "@silevis/reactgrid/styles.css"
    ]);

    module.exports = withTM(withCSS());  
  ```

# Docs

Explore ReactGrid docs: [here](http://reactgrid.com/docs/)

# Licensing

ReactGrid is available in two versions, [MIT](https://github.com/silevis/reactgrid/blob/develop/LICENSE) (this package) which serve 
the full interface but is limited in functionality and PRO which is fully functional version. You can compare versions
[here](http://reactgrid.com/feature-comparison/).

(c) 2020 Silevis Software Sp. z o.o.

# Authors

[Silevis Software](https://www.silevis.com/)

<p align="center">
  <a href="https://www.silevis.com/">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="200" />
  </a>
</p>