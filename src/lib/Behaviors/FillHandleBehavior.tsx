import React from "react";
import {
  Location,
  Compatible,
  Cell,
  Range,
  GridRow,
  GridColumn,
  getCompatibleCellAndTemplate,
  CellMatrix,
  tryAppendChangeHavingGroupId,
  isMacOs,
} from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { State } from "../Model/State";
import { Behavior } from "../Model/Behavior";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { PartialArea } from "../Components/PartialArea";
import { isRangeIntersects } from "../Functions/isRangeIntersectsWith";
import { newLocation } from "../Functions/newLocation";

type Direction = "" | "left" | "right" | "up" | "down";

export class FillHandleBehavior extends Behavior {
  private fillDirection: Direction = "";
  private fillRange?: Range;

  handlePointerEnter(
    event: PointerEvent,
    location: Location,
    state: State
  ): State {
    const selectedRange = getActiveSelectedRange(state);
    this.fillDirection = this.getFillDirection(selectedRange, location);
    this.fillRange = this.getFillRange(
      state.cellMatrix,
      selectedRange,
      location,
      this.fillDirection
    );
    return { ...state };
  }

  handlePointerUp(
    event: PointerEvent,
    location: Location,
    state: State
  ): State {
    const activeSelectedRange = getActiveSelectedRange(state);
    const cellMatrix = state.cellMatrix;
    if (!activeSelectedRange || this.fillRange === undefined) {
      return state;
    }
    const isKeyPressed = isMacOs() ? event.altKey : event.ctrlKey;
    this.fillRange = state.cellMatrix.validateRange(this.fillRange);
    const getCompatibleCell = (location: Location) =>
      getCompatibleCellAndTemplate(state, location);

    const fillCellsWithPredictedValues = (
      selectedCells: Compatible<Cell>[],
      cellsToFill: Compatible<Cell>[]
    ): Compatible<Cell>[] => {
      const numbers = selectedCells.map((cell) => cell.value);
      const parameters = this.findRegressionFunction(
        numbers,
        Array.from({ length: numbers.length }, (_, index) => index + 1)
      );
      const areParametersNaNs = isNaN(parameters.a) && isNaN(parameters.b);
      return cellsToFill.map((cell, i) => {
        const x = this.calculateXForRegressionFunction(
          i + numbers.length + 1,
          parameters.a,
          parameters.b
        );
        const selectedCell = selectedCells[i % selectedCells.length];
        return {
          ...cell,
          text:
            areParametersNaNs || isKeyPressed
              ? selectedCell.text
              : x.toString(),
          groupId: selectedCell.groupId,
          value: areParametersNaNs || isKeyPressed ? selectedCell.value : x,
        };
      });
    };

    const fillVertically = (
      state: State,
      activeSelectedRange: Range,
      direction: "up" | "down"
    ): State => {
      activeSelectedRange.columns.forEach((column) => {
        let selectedCells = activeSelectedRange.rows.map(
          (row) => getCompatibleCell(newLocation(row, column)).cell
        );
        selectedCells =
          direction === "up" ? selectedCells.reverse() : selectedCells;
        if (this.fillRange) {
          let cellsToFill = this.fillRange.rows.map(
            (row) => getCompatibleCell(newLocation(row, column)).cell
          );
          cellsToFill = fillCellsWithPredictedValues(
            selectedCells,
            cellsToFill
          );
          cellsToFill =
            direction === "up" ? cellsToFill.reverse() : cellsToFill;
          state = this.fillColumn(state, column, cellsToFill);
        }
      });
      return state;
    };

    const fillHorizontally = (
      state: State,
      activeSelectedRange: Range,
      direction: "left" | "right"
    ): State => {
      activeSelectedRange.rows.forEach((row) => {
        let selectedCells = activeSelectedRange.columns.map(
          (column) => getCompatibleCell(newLocation(row, column)).cell
        );
        selectedCells =
          direction === "left" ? selectedCells.reverse() : selectedCells;
        if (this.fillRange) {
          let cellsToFill = this.fillRange.columns.map(
            (column) => getCompatibleCell(newLocation(row, column)).cell
          );
          cellsToFill = fillCellsWithPredictedValues(
            selectedCells,
            cellsToFill
          );
          cellsToFill =
            direction === "left" ? cellsToFill.reverse() : cellsToFill;
          state = this.fillRow(state, row, cellsToFill);
        }
      });
      return state;
    };

    switch (this.fillDirection) {
      case "right": {
        const newRange = cellMatrix.getRange(
          activeSelectedRange.first,
          newLocation(activeSelectedRange.last.row, location.column)
        );

        state = fillHorizontally(state, activeSelectedRange, "right");

        if (state?.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {
          return state;
        }

        state = {
          ...state,
          selectedRanges: [newRange],
          selectedIds: [
            ...activeSelectedRange.columns.map((col) => col.columnId),
            ...this.fillRange.columns.map((col) => col.columnId),
          ],
        };

        state.props?.onSelectionChanged && state.props.onSelectionChanged(state.selectedRanges);
        
        break;
      }
      case "left": {
        const newRange = cellMatrix.getRange(
          activeSelectedRange.last,
          newLocation(activeSelectedRange.first.row, location.column)
        );

        state = fillHorizontally(state, activeSelectedRange, "left");

        if (state?.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {
          return state;
        }

        state = {
          ...state,
          selectedRanges: [newRange],
          selectedIds: [
            ...activeSelectedRange.columns.map((col) => col.columnId),
            ...this.fillRange.columns.map((col) => col.columnId),
          ],
        };

        state.props?.onSelectionChanged && state.props.onSelectionChanged(state.selectedRanges);

        break;
      }
      case "up": {
        const newRange = cellMatrix.getRange(activeSelectedRange.last, {
          row: location.row,
          column: activeSelectedRange.first.column,
        });

        state = fillVertically(state, activeSelectedRange, "up");

        if (state?.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {
          return state;
        }

        state = {
          ...state,
          selectedRanges: [newRange],
          selectedIds: [
            ...activeSelectedRange.rows.map((row) => row.rowId),
            ...this.fillRange.rows.map((row) => row.rowId),
          ],
        };

        state.props?.onSelectionChanged && state.props.onSelectionChanged(state.selectedRanges);

        break;
      }
      case "down": {
        const newRange = cellMatrix.getRange(
          activeSelectedRange.first,
          newLocation(location.row, activeSelectedRange.last.column)
        );

        state = fillVertically(state, activeSelectedRange, "down");

        if (state?.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {
          return state;
        }

        state = {
          ...state,
          selectedRanges: [newRange],
          selectedIds: [
            ...activeSelectedRange.rows.map((row) => row.rowId),
            ...this.fillRange.rows.map((row) => row.rowId),
          ],
        };

        state.props?.onSelectionChanged && state.props.onSelectionChanged(state.selectedRanges);

        break;
      }
    }

    return state;
  }

  calculateXForRegressionFunction(y: number, a: number, b: number): number {
    return Math.round(((y - a) / b) * 1e5) / 1e5;
  }

  findRegressionFunction(
    valuesX: number[],
    valuesY: number[]
  ): { a: number; b: number } {
    const sumX = this.sumArray(valuesX);
    const sumY = this.sumArray(valuesY);
    const sumXY = this.sumArray(this.multipleArrays(valuesX, valuesY));
    const sumPowX = this.sumArray(this.powerArray(valuesX, 2));
    const n = valuesX.length;
    const upValue = Math.fround(n * sumXY - sumX * sumY);
    const downValue = Math.fround(n * sumPowX - Math.pow(sumX, 2));
    const b = upValue / downValue;
    const a = sumY / n - b * (sumX / n);
    return { a, b };
  }

  sumArray(arr: number[]): number {
    return arr.reduce((a, b) => a + b);
  }

  multipleArrays(first: number[], second: number[]): number[] {
    const result = [];
    const stopCondition =
      first.length <= second.length ? first.length : second.length;
    for (let i = 0; i < stopCondition; ++i) {
      result.push(first[i] * second[i]);
    }
    return result;
  }

  powerArray(arr: number[], power: number): number[] {
    return arr.map((x) => Math.pow(x, power));
  }

  renderPanePart(state: State, pane: Range): React.ReactNode {
    return (
      this.fillDirection &&
      this.fillRange &&
      isRangeIntersects(pane, this.fillRange) && (
        <PartialArea
          range={state.cellMatrix.validateRange(this.fillRange)}
          className="rg-partial-area-part"
          pane={pane}
          style={{
            backgroundColor: "",
            borderTop:
              this.fillDirection === "down" ? "0px solid transparent" : "",
            borderBottom:
              this.fillDirection === "up" ? "0px solid transparent" : "",
            borderLeft:
              this.fillDirection === "right" ? "0px solid transparent" : "",
            borderRight:
              this.fillDirection === "left" ? "0px solid transparent" : "",
          }}
        />
      )
    );
  }

  private getFillDirection(selectedRange: Range, pointerLocation: Location) {
    // active selection
    const differences: { direction: Direction; value: number }[] = [];
    differences.push({ direction: "", value: 0 });
    differences.push({
      direction: "up",
      value:
        pointerLocation.row.idx < selectedRange.first.row.idx
          ? selectedRange.first.row.idx - pointerLocation.row.idx
          : 0,
    });
    differences.push({
      direction: "down",
      value:
        pointerLocation.row.idx > selectedRange.last.row.idx
          ? pointerLocation.row.idx - selectedRange.last.row.idx
          : 0,
    });
    differences.push({
      direction: "left",
      value:
        pointerLocation.column.idx < selectedRange.first.column.idx
          ? selectedRange.first.column.idx - pointerLocation.column.idx
          : 0,
    });
    differences.push({
      direction: "right",
      value:
        pointerLocation.column.idx > selectedRange.last.column.idx
          ? pointerLocation.column.idx - selectedRange.last.column.idx
          : 0,
    });
    return differences.reduce((prev, current) =>
      prev.value >= current.value ? prev : current
    ).direction;
  }

  private getFillRange(
    cellMatrix: CellMatrix,
    selectedRange: Range,
    location: Location,
    fillDirection: Direction
  ) {
    switch (fillDirection) {
      case "right":
        return cellMatrix.getRange(
          cellMatrix.getLocation(
            selectedRange.first.row.idx,
            cellMatrix.last.column.idx < selectedRange.last.column.idx + 1
              ? cellMatrix.last.column.idx
              : selectedRange.last.column.idx + 1
          ),
          newLocation(selectedRange.last.row, location.column)
        );
      case "left":
        return cellMatrix.getRange(
          newLocation(selectedRange.first.row, location.column),
          cellMatrix.getLocation(
            selectedRange.last.row.idx,
            cellMatrix.first.column.idx > selectedRange.first.column.idx - 1
              ? cellMatrix.first.column.idx
              : selectedRange.first.column.idx - 1
          )
        );
      case "up":
        return cellMatrix.getRange(
          newLocation(location.row, selectedRange.first.column),
          cellMatrix.getLocation(
            cellMatrix.first.row.idx > selectedRange.first.row.idx - 1
              ? cellMatrix.first.row.idx
              : selectedRange.first.row.idx - 1,
            selectedRange.last.column.idx
          )
        );
      case "down":
        return cellMatrix.getRange(
          cellMatrix.getLocation(
            cellMatrix.last.row.idx < selectedRange.last.row.idx + 1
              ? cellMatrix.last.row.idx
              : selectedRange.last.row.idx + 1,
            selectedRange.first.column.idx
          ),
          newLocation(location.row, selectedRange.last.column)
        );
    }
    return undefined;
  }

  private fillRow(
    state: State,
    row: GridRow,
    values: Compatible<Cell>[]
  ): State {
    this.fillRange?.columns.forEach((col, i) => {
      state = tryAppendChangeHavingGroupId(
        state,
        newLocation(row, col),
        values[i]
      ) as State;
    });
    return state;
  }

  private fillColumn(
    state: State,
    column: GridColumn,
    values: Compatible<Cell>[]
  ): State {
    this.fillRange?.rows.forEach((row, i) => {
      state = tryAppendChangeHavingGroupId(
        state,
        newLocation(row, column),
        values[i]
      ) as State;
    });
    return state;
  }
}
