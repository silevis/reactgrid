import logo from './logo.svg';
import './App.css';
import * as React from "react";
import { render } from "react-dom";
import "@silevis/reactgrid/styles.css";
import axios from 'axios';
import { ReactGrid, Column, Row, CellChange, TextCell, OptionType, DropdownCell} from "@silevis/reactgrid";

const getPeople = async () => {
  const response = await axios.get('http://localhost:8000/people');
  return response.data;
};

const getColumns = () => [
  { columnId: "name", width: 150, resizable: true },
  { columnId: "surname", width: 150 , resizable: true}
];

const headerRow = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" }
  ]
};

const getRows = (people) => [
  headerRow,
  ...people.map((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname }
    ]
  }))
];

const applyChangesToPeople = async (changes, prevPeople) => {
  changes.forEach(change => {
      const personIndex = change.rowId;
      const fieldName = change.columnId;
      prevPeople[personIndex][fieldName] = change.newCell.text;
  });
  const updatedPeople = await axios.put('http://localhost:8000/people', prevPeople);
  return updatedPeople.data;
};


function App() {
  const [people, setPeople] = React.useState([]);

  React.useEffect(() => {
    getPeople().then(data => {
      setPeople(data);
    }).catch(error => console.error('Failed to load people:', error));
  }, []);

  const rows = getRows(people);
  const [columns, setColumns] = React.useState(getColumns());

  const handleChanges = (changes) => { 
    applyChangesToPeople(changes, people).then(setPeople); 
  };


  const handleColumnResize = (ci, width) => {
    setColumns((prevColumns) => {
        const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
        const resizedColumn = prevColumns[columnIndex];
        const updatedColumn = { ...resizedColumn, width };
        prevColumns[columnIndex] = updatedColumn;
        return [...prevColumns];
    });
}
  return <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges}  onColumnResized={handleColumnResize} />;
}

render(<App />, document.getElementById("root"));

export default App;
