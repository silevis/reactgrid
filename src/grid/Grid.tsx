/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import {
    Column, Row, Id, MenuOption, SelectionMode, DropPosition, CellLocation,
    DefaultCellTypes, CellChange, ReactGridProps, TextCell, NumberCell, DateCell, DropdownCell, 
    CellStyle, HeaderCell, ChevronCell, Range, OptionType, CheckboxCell, TimeCell
} from '../reactgrid';
import { TestConfig } from './envConfig';
import '../styles.scss';
import { config } from "cypress/types/bluebird";

type GridCells = HeaderCell | TextCell | NumberCell | DropdownCell;

//type GridRow = Row<GridCells>;

interface GridProps {
  enableSticky?: boolean;
  enableColumnAndRowSelection?: boolean;
  enableFrozenFocus?: boolean;
  config: TestConfig;
  component: React.ComponentClass<ReactGridProps>;
  headerDataNames: string[];
  headerData: [{
    name?: string,
    type?: string,
    notNull?: boolean,
    maxLength?: number,
    values?: [{
      value: string,
      label: string
    }],
    errorMessages?: string[]
    
  }];
}

const myDateFormat = new Intl.DateTimeFormat("pl", {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const myTimeFormat = new Intl.DateTimeFormat("pl", {
  hour: "2-digit",
  minute: "2-digit",
});




export const Grid: React.FC<GridProps> = (props) => {
  const {
    config,
    component,
    headerData,
    headerDataNames,
    enableSticky,
    enableColumnAndRowSelection,
    enableFrozenFocus,
  } = props;
  config.columns = headerDataNames.length
  /*
  const [render, setRender] = React.useState(true);
  const [columns, setColumns] = React.useState(() =>
    new Array(config.columns)
      .fill({ columnId: 0, resizable: true, reorderable: true, width: -1 })
      .map<Column>((_, ci) => ({
        columnId: ci,
        resizable: true,
        reorderable: true,
        width: config.cellWidth,
      }))
  );
  
  function getCellConfigForType(type: string | undefined, ci: number){
    const commonConfig = {
      text: "",
      maxLength: headerData[ci]["maxLength"]
    }
    const configMapping: Record<string, any> = {
      "alphanumeric": {
        ...commonConfig,
        type: "text",
        restraintType: "alphanumeric"
      },
      "text": {
          ...commonConfig,
          type: "text"
      },
      "number": {
          ...commonConfig,
          type: "number",
          value: 0
      },
      "dropdown": {
          type: "dropdown",
          values: headerData[ci]["values"]!,
          isDisabled: false
      }
    };
    return type ? configMapping[type] : {...commonConfig, type: "text"}
  }
  
  const [rows, setRows] = React.useState(() =>
    new Array(config.rows).fill(0).map<GridRow>((_, ri) => ({
      rowId: ri,
      reorderable: true,
      height: config.cellHeight,
      cells: columns.map<GridCells>((_, ci) => {
        if (ri === 0) return { 
          type: firstRowType, 
          text: ci===0 ? "" : headerDataNames[ci],
          nonEditable: true
        };
        if (ci === 0) return {
          type: "number",
          value: ri,
          nanToZero: false,
          hideZero: true,
          nonEditable: true
        };

        const type = headerData[ci]["type"];
        return getCellConfigForType(type, ci);
      }),
    }))
  );
  
  const [cellChangesIndex, setCellChangesIndex] = React.useState(() => -1);

  const [cellChanges, setCellChanges] = React.useState<CellChange<TextCell>[][]>(() => []);
  
  const handleChanges = (changes: CellChange<GridCells>[]) => {
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

  const addRows = (
    selectedRowIds: Id[],
    above: boolean
  ) =>{ 
    const addingAmount = selectedRowIds.length;
    const indexToInsert = above ? Number(selectedRowIds[0]) : Number(selectedRowIds[selectedRowIds.length-1]) + 1;
    const addingArray = 
      Array.from({length: addingAmount}, (_, ri) => {
        const obj: GridRow = {
          rowId: ri + indexToInsert,
          reorderable: true,
          height: config.cellHeight,
          cells: columns.map<GridCells>((_, ci) => {
            if (ci === 0) return {
              type: "number",
              value: ri + indexToInsert,
              nanToZero: false,
              hideZero: true,
              nonEditable: true
            };
            const type = headerData[ci]["type"];
            return getCellConfigForType(type, ci);
          }),
        }
        return obj;
      });
    
    setRows((prevRows) => {
      const newArray = [...prevRows];
      newArray.splice(indexToInsert, 0, ...addingArray);
      for (let i = indexToInsert+addingAmount; i < newArray.length; i++){
        if(newArray[i].cells[0].type === "number"){
          newArray[i].rowId = i
        }
      }
      return [...newArray];
    })
  }

   

  const handleColumnResize = (
    columnId: Id,
    width: number,
    selectedColIds: Id[]
  ) => {
    setColumns((prevColumns) => {
      const setColumnWidth = (columnIndex: number) => {
        const resizedColumn = prevColumns[columnIndex];
        prevColumns[columnIndex] = { ...resizedColumn, width };
      };

      if (selectedColIds.includes(columnId)) {
        const stateColumnIndexes = prevColumns
          .filter((col) => selectedColIds.includes(col.columnId))
          .map((col) =>
            prevColumns.findIndex((el) => el.columnId === col.columnId)
          );
        stateColumnIndexes.forEach(setColumnWidth);
      } else {
        const columnIndex = prevColumns.findIndex(
          (col) => col.columnId === columnId
        );
        setColumnWidth(columnIndex);
      }
      return [...prevColumns];
    });
  };


  

  const reorderArray = <T extends unknown>(
    arr: T[],
    idxs: number[],
    to: number
  ) => {
    const movedElements: T[] = arr.filter((_: T, idx: number) =>
      idxs.includes(idx)
    );
    to =
      Math.min(...idxs) < to
        ? (to += 1)
        : (to -= idxs.filter((idx) => idx < to).length);
    const leftSide: T[] = arr.filter(
      (_: T, idx: number) => idx < to && !idxs.includes(idx)
    );
    const rightSide: T[] = arr.filter(
      (_: T, idx: number) => idx >= to && !idxs.includes(idx)
    );
    return [...leftSide, ...movedElements, ...rightSide];
  };

  const handleCanReorderColumns = (
    targetColumnId: Id,
    columnIds: Id[],
    dropPosition: DropPosition
  ): boolean => {
    return true;
  };

  const handleCanReorderRows = (
    targetColumnId: Id,
    rowIds: Id[],
    dropPosition: DropPosition
  ): boolean => {
    // const rowIndex = state.rows.findIndex((row: Row) => row.rowId === targetColumnId);
    // if (rowIndex === 0) return false;
    return true;
  };

  const handleColumnsReorder = (
    targetColumnId: Id,
    columnIds: Id[],
    dropPosition: DropPosition
  ) => {
    const to = columns.findIndex(
      (column: Column) => column.columnId === targetColumnId
    );
    const columnIdxs = columnIds.map((id: Id, idx: number) =>
      columns.findIndex((c: Column) => c.columnId === id)
    );
    setRows(
      rows.map((row) => ({
        ...row,
        cells: reorderArray(row.cells, columnIdxs, to),
      }))
    );
    setColumns(reorderArray(columns, columnIdxs, to));
  };

  const handleRowsReorder = (
    targetRowId: Id,
    rowIds: Id[],
    dropPosition: DropPosition
  ) => {
    setRows((prevRows) => {
      const to = rows.findIndex((row) => row.rowId === targetRowId);
      const columnIdxs = rowIds.map((id) =>
        rows.findIndex((r) => r.rowId === id)
      );
      return reorderArray(prevRows, columnIdxs, to);
    });
  };
  

  const handleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
    selectedRanges: Array<CellLocation[]>
  ): MenuOption[] => {
    if (selectionMode === "row") {
      menuOptions = [
        ...menuOptions,
        {
          id: "rowOption",
          label: "Custom menu row option",
          handler: (
            selectedRowIds: Id[],
            selectedColIds: Id[],
            selectionMode: SelectionMode
          ) => {},
        },
      ];
    }
    if (selectionMode === "column") {
      menuOptions = [
        ...menuOptions,
        {
          id: "columnOption",
          label: "Custom menu column option",
          handler: (
            selectedRowIds: Id[],
            selectedColIds: Id[],
            selectionMode: SelectionMode
          ) => {},
        },
      ];
    }
    return [
      ...menuOptions,
      {
        id: "addRowAbove",
        label: "Add Row Above",
        handler: (
          selectedRowIds: Id[],
          selectedColIds: Id[],
          selectionMode: SelectionMode
        ) => {
          addRows(selectedRowIds, true)
        },
      },
    ];
  };
  */
  

  
const getData = 
  Array.from({length:30}, (_, rowId) => {
    const obj: Record<string, string> = {}
    headerDataNames.forEach((name, columnId) => {
      obj[name] = columnId === 0 ? (rowId+1).toString() : "";
    })
    return obj
  })


const getColumns = (): Column[] => {
   return headerDataNames.map((headerDataName, id)=>(
     {
      columnId: headerDataName,
      width: id !== 0 ? 100 : 50,
      resizable: id !== 0 ? true : false
    }
   )
  )
}

const headerRow: Row<HeaderCell> = {
  rowId: "header",
  cells: headerDataNames.map((name) => ({ type: "header", text: name, nonEditable: false }))
};

function getCellConfigForType(type: string, ci: number){
  const commonConfig = {
    text: "",
    maxLength: headerData[ci]["maxLength"]
  }
  const configMapping: Record<string, any> = {
    "alphanumeric": {
      ...commonConfig,
      type: "text",
      restraintType: "alphanumeric"
    },
    "text": {
        ...commonConfig,
        type: "text"
    },
    "number": {
        ...commonConfig,
        type: "number",
        value: 0
    },
    "dropdown": {
        type: "dropdown",
        values: headerData[ci]["values"]!,
        isDisabled: false
    }
  };
  return type ? configMapping[type] : {...commonConfig, type: "text"}
}


const getRows = (data:any[]): Row<GridCells>[] => [
  headerRow,
  ...(Array.from({length: data.length}, (_, ri) => ri+1)).map<Row<Exclude<GridCells, HeaderCell>>>((value, ri) => (
    {
      rowId: ri,
      cells: headerDataNames.map((name, ci) => {
        
        if(ci === 0){
          return {type: "number", value: value}
        } else if(headerData[ci]["type"] === "alphanumeric"){
          return {type: "text", text: data[ri][name], restraintType: "alphanumeric", maxLength: headerData[ci]["maxLength"]}
        } else if(headerData[ci]["type"] === "text"){
          return {type: "text", text: data[ri][name], maxLength: headerData[ci]["maxLength"]}
        } else if(headerData[ci]["type"] === "number"){
          return {type: "number", value: !data[ri][name] ? 0 : Number(data[ri][name]), maxLength: headerData[ci]["maxLength"]}
        } else if(headerData[ci]["type"] === "dropdown"){
          return {type: "dropdown", values: headerData[ci]["values"]!, isDisabled: false}
        } else {
          return {type: "text", text: data[ri][name], maxLength: headerData[ci]["maxLength"]}
        }
    })
    }
   )
  )
];
  const [render, setRender] = React.useState(true);
  const [label, setLabel] = React.useState<any[]>(getData);
  const [columns, setColumns] = React.useState<Column[]>(getColumns());
  const rows = getRows(label);
  const [cellChangesIndex, setCellChangesIndex] = React.useState(() => -1);
  const [cellChanges, setCellChanges] = React.useState<CellChange<GridCells>[][]>(() => []);
  
  const applyNewValue = (
    changes: CellChange<GridCells>[],
    prevLabel: any[],
    usePrevValue  = false
  ) => {
    changes.forEach((change) => {
      const labelIndex = Number(change.rowId);
      const fieldName = change.columnId;
      const cell = usePrevValue ? change.previousCell : change.newCell;
      switch (cell.type){
        case "text":
          prevLabel[labelIndex][fieldName] = cell.text;
          break;
        case "number":
          prevLabel[labelIndex][fieldName] = cell.value;
          break;
        case "dropdown":
          break;
        case "header":
          break;
      }
    });
    return [...prevLabel];
  };

  const applyChangesToLabel = (
    changes: CellChange<GridCells>[],
    prevLabel: any[]
  ) => {
    const updated = applyNewValue(changes, prevLabel);
    setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  const handleChanges = (changes: CellChange<GridCells>[]) => { 
    setLabel((prevLabel) => applyChangesToLabel(changes, prevLabel)); 
  }; 
  
  const undoChanges = (
    changes: CellChange<GridCells>[],
    prevLabel: any[]
  ) => {
    const updated = applyNewValue(changes, prevLabel, true);
    setCellChangesIndex(cellChangesIndex - 1);
    return updated;
  };

  const handleUndoChanges = () => {
    if (cellChangesIndex >= 0) {
      setLabel((prevLabel) =>
        undoChanges(cellChanges[cellChangesIndex], prevLabel)
      );
    }
  };

  const redoChanges = (
    changes: CellChange<GridCells>[],
    prevLabel: any[]
  ) => {
    const updated = applyNewValue(changes, prevLabel);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  const handleRedoChanges = () => {
    if (cellChangesIndex + 1 <= cellChanges.length - 1) {
      setLabel((prevLabel) =>
        redoChanges(cellChanges[cellChangesIndex + 1], prevLabel)
      );
    }
  };
  
  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
        const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
        const resizedColumn = prevColumns[columnIndex];
        const updatedColumn = { ...resizedColumn, width };
        prevColumns[columnIndex] = updatedColumn;
        return [...prevColumns];
    });
  }

  const addRow = (
    changes: CellChange<GridCells>[],
    prevLabel: any[],
    selectedRowIds: Id[],
    above: boolean
  ) => {
    const addingAmount = selectedRowIds.length;
    const addingArray = 
      Array.from({length: addingAmount}, (_, rowId) => {
        const obj: Record<string, string> = {}
        headerDataNames.forEach((name, columnId) => {
          obj[name] = columnId === 0 ? (rowId+1).toString() : "";
        })
      return obj;
    })
    const indexToInsert = above ? Number(selectedRowIds[0]) : Number(selectedRowIds[selectedRowIds.length-1]) + 1;
    const newArray = [...prevLabel]
    newArray.splice(indexToInsert, 0, ...addingArray);
    return newArray;
  }

  const deleteRow = (
    changes: CellChange<GridCells>[],
    prevLabel: any[],
    selectedRowIds: Id[]
  )=>{
    return [...prevLabel.filter((label, idx) => !selectedRowIds.includes(idx))]
  }

  const handleAddRowButton = () =>{
    setLabel(prevLabel => {
      return addRow(cellChanges[cellChangesIndex], prevLabel, [prevLabel.length-1], false)
    })
  }

  const handleDeleteRowButton = () =>{
    setLabel(prevLabel => {
      return deleteRow(cellChanges[cellChangesIndex], prevLabel, [prevLabel.length-1])
    })
  }


  const handleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    if (selectionMode === "row") {
      menuOptions = [
        ...menuOptions,
        {
          id: "addRowAbove",
          label: "Add Row above",
          handler: () => {
            setLabel(prevLabel => {
              return addRow(cellChanges[cellChangesIndex], prevLabel, selectedRowIds, true)
            })
          }
        },
        {
          id: "addRowBelow",
          label: "Add Row below",
          handler: () => {
            setLabel(prevLabel => {
              return addRow(cellChanges[cellChangesIndex], prevLabel, selectedRowIds, false)
            })
          }
        },
        {
          id: "removeRow",
          label: "Remove Row",
          handler: () => {
            setLabel(prevLabel => {
              return deleteRow(cellChanges[cellChangesIndex], prevLabel, selectedRowIds)
            })
          }
        }
      ];
    }
    return menuOptions;
  }
  
  const Component = component;
  return (
      <>
          <div className='grid-container' data-cy='div-scrollable-element' style={{
              ...(!config.pinToBody && {
                  height: config.fillViewport ? `calc(100vh - 30px)` : config.rgViewportHeight,
                  width: config.fillViewport ? `calc(100vw - 45px)` : config.rgViewportWidth,
                  margin: config.margin,
                  overflow: 'auto',
              }),
              position: 'relative',
              ...(config.flexRow && {
                  display: 'flex',
                  flexDirection: 'row'
              }),
          }}>
             
              {render && <Component
                  rows={rows}
                  columns={columns}
                  onCellsChanged={handleChanges}
                  onColumnResized={handleColumnResize}
                  //canReorderColumns={handleCanReorderColumns}
                  //canReorderRows={handleCanReorderRows}
                  //onColumnsReordered={handleColumnsReorder}
                  //onRowsReordered={handleRowsReorder}
                  onContextMenu={handleContextMenu}
                  enableRowSelection
                  enableColumnSelection
                  enableRangeSelection
                  enableFillHandle
              />}
          </div>
          

        </>
    )
}

export const withDiv = <T extends Record<string, unknown> & GridProps>(
  Component: React.ComponentType<T>
): React.FC<T> => {
  Component.displayName = "WithDivWrapperTestGrid";
  const wrappedComponent = ({ ...props }: GridProps) => {
    return (
      <div style={{ ...props.config.withDivComponentStyles }}>
        <Component {...(props as T)} />
      </div>
    );
  };
  return wrappedComponent;
};

export const ExtGrid = withDiv(Grid);
