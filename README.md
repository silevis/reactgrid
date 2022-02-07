# ReactGrid MIT

### Add spreadsheet-like behavior to your React app 🚀

<div align="center">

&nbsp;

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/silevis/reactgrid/blob/develop/LICENSE)
[![Build Status](https://dev.azure.com/Silevis/ReactGrid/_apis/build/status/GitHub-MIT/Upgrade%20version%20and%20publish?branchName=master)](https://dev.azure.com/Silevis/ReactGrid/_build/latest?definitionId=17&branchName=master)
[![reactgrid](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/hwrqiy&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/hwrqiy/runs)
[![npm version](https://badge.fury.io/js/%40silevis%2Freactgrid.svg)](https://badge.fury.io/js/%40silevis%2Freactgrid)

<img alt="Sample app" src="https://reactgrid.com/sample.gif"/>

</div>
&nbsp;

Before running ReactGrid you need to have installed:

- react": "^16.13.1"
- react-dom: "^16.13.1"

# Docs

- [Demo](https://reactgrid.com/examples)
- [Documentation](https://reactgrid.com/docs/4.0/0-introduction/)
- [API Reference](https://reactgrid.com/docs/4.0/7-api/)

# Get started

Install package by running

```shell
npm i @silevis/reactgrid
```

In this particullar example we will display data in the same way like in a standard datatable.
Of course you can still **place yours cells anywhere**, but now we will focus on the basics.

### Import ReactGrid component

```tsx
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
```

### Import CSS styles

Import basic CSS styles. This file is necessary to correctly display ReactGrid.

```tsx
import "@silevis/reactgrid/styles.css";
```

### Create a cell matrix

It's a good idea to separate up our data (people list) from ReactGrid interface (especially `Row` and `Column`).
We encourage you to use Typescript features to prevent you from the possibly inconsistent data.

```tsx
interface Person {
  name: string;
  surname: string;
}

const getPeople = (): Person[] => [
  { name: "Thomas", surname: "Goldman" },
  { name: "Susie", surname: "Quattro" },
  { name: "", surname: "" },
];
```

In the next step we have defined an array of ReactGrid's `Column`s stored in `getColumns` function.
If you are interested how to do more complex operations related with columns like resizing or
reordering, please browse our [👉 docs](https://reactgrid.com/docs?utm_source=github&utm_medium=reactgriddocs&utm_campaign=docs)

```tsx
const getColumns = (): Column[] => [
  { columnId: "name", width: 150 },
  { columnId: "surname", width: 150 },
];
```

At the top of the datatable we are going to display static cells that contain `Name` and `Surname` so we can define them now.

```tsx
const headerRow: Row<HeaderCell> = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" },
  ],
};
```

ReactGrid `rows` prop expects an array of rows that are compatible with imported `Row`s interface.
As you see the function returns the header row and mapped people array to ReactGrid's `Rows`.

```tsx
const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname },
    ],
  })),
];
```

The last step is wrapping it all up in the `App` component. People were stored inside `people` variable as React hook.
ReactGrid component was fed with generated `rows` structure and previously defined `columns`

```tsx
function App() {
  const [people] = React.useState<Person[]>(getPeople());

  const rows = getRows(people);
  const columns = getColumns();

  return <ReactGrid rows={rows} columns={columns} />;
}
```

Open live demo on [codesandbox.io](https://codesandbox.io/s/reactgrid-getting-started-0754c?file=/src/index.tsx)

### Handling changes

Our code is currently read-only.
To be able to change any value inside the grid you have to implement your own handler.

Let's start with updating imports:

```ts
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
} from "@silevis/reactgrid";
```

Then define the function that applies changes to data and returns its copy.
We expect that incoming changes affect `TextCell`, so the changes were marked by a following interface: `CellChange<TextCell>[]`.
Given that information, we find the row and the column affected by each change,
and then replace an appropriate cell text with a new one.

```ts
const applyChangesToPeople = (
  changes: CellChange<TextCell>[],
  prevPeople: Person[]
): Person[] => {
  changes.forEach((change) => {
    const personIndex = change.rowId;
    const fieldName = change.columnId;
    prevPeople[personIndex][fieldName] = change.newCell.text;
  });
  return [...prevPeople];
};
```

It's time to update the `App` component. As you see the `handleChanges` function updates only data by setting
updated people from `applyChangesToPeople` function.

```tsx
function App() {
  const [people, setPeople] = React.useState<Person[]>(getPeople());

  const rows = getRows(people);
  const columns = getColumns();

  const handleChanges = (changes: CellChange<TextCell>[]) => {
    setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
  };

  return (
    <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} />
  );
}
```

Open live demo on [codesandbox.io](https://codesandbox.io/s/reactgrid-handling-changes-crzfx?file=/src/index.tsx)

## Other examples:

- [Creating custom cell template](https://codesandbox.io/s/reactgrid-creating-new-cell-template-pdiux)
- [Sticky panes](https://codesandbox.io/s/reactgrid-sticky-panes-oikll)
- [Chevron cell example](https://codesandbox.io/s/reactgrid-group-cell-example-fh1di?file=/src/index.tsx)
- [Cell highlights](https://codesandbox.io/s/reactgrid-highlights-8o8gq)
- [Custom styles](https://codesandbox.io/s/reactgrid-custom-styling-buwuw)
- [and a lot more here](https://reactgrid.com/docs/3.1/2-implementing-core-features/?utm_source=github&utm_medium=reactgriddocs&utm_campaign=docs)

# Browser support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge"  />](http://godban.github.io/browsers-support-badges/)<br> Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox"  />](http://godban.github.io/browsers-support-badges/)<br> Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome"  />](http://godban.github.io/browsers-support-badges/)<br> Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" />](http://godban.github.io/browsers-support-badges/)<br> Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" />](http://godban.github.io/browsers-support-badges/) <br>iOS/iPadOs Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung"/>](http://godban.github.io/browsers-support-badges/)<br> Samsung internet | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" />](http://godban.github.io/browsers-support-badges/)<br> Opera |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                     80+                                                                                     |                                                                                           61+                                                                                           |                                                                                         57+                                                                                         |                                                                                       13.1+                                                                                        |                                                                                                    13+                                                                                                    |                                                                                                        9+                                                                                                        |                                                                                      45+                                                                                       |

# Licensing

ReactGrid is published under the MIT License (MIT).

(c) 2022 Silevis Software Sp. z o.o.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Authors

[Silevis Software](https://www.silevis.com/?utm_source=github&utm_medium=reactgrdigit&utm_campaign=github)

<p align="center">
  <a href="https://www.silevis.com/?utm_source=github&utm_medium=reactgrdigit&utm_campaign=github">
    <img alt="Silevis" src="https://media.licdn.com/dms/image/C4D0BAQGgkonm5f80mA/company-logo_200_200/0?e=2159024400&v=beta&t=l5Nw-CF55OIxVORSAXOw79DlgSiDakhnYLlkBOMj7s8" width="200" />
  </a>
</p>
````
