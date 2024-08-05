import * as React from "react";
import {
  CellTemplate,
  Cell,
  Compatible,
  getCellProperty,
  Uncertain,
  UncertainCompatible,
} from "@silevis/reactgrid";
import "./rate-cell-style.scss";

export interface RateCell extends Cell {
  type: "rate";
  value: number;
}

export class RateCellTemplate implements CellTemplate<RateCell> {
  STARS: number = 6;
  MIN_VAL: number = 1;

  getCompatibleCell(uncertainCell: Uncertain<RateCell>): Compatible<RateCell> {
    const value = getCellProperty(uncertainCell, "value", "number");
    const text = value.toString();
    return { ...uncertainCell, value, text };
  }

  textToCellData(cellvalue: number): number {
    if (isNaN(cellvalue) || cellvalue < this.MIN_VAL) return this.MIN_VAL;
    else if (cellvalue > this.STARS) return this.STARS;
    else return cellvalue;
  }

  handleKeyDown(
    cell: Compatible<RateCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ) {
    return { cell, enableEditMode: false };
  }

  update(
    cell: Compatible<RateCell>,
    cellToMerge: UncertainCompatible<RateCell>
  ): Compatible<RateCell> {
    return this.getCompatibleCell({ ...cell, value: cellToMerge.value });
  }

  render(
    cell: Compatible<RateCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<RateCell>, commit: boolean) => void
  ): React.ReactNode {
    let stars: any[] = [];
    const randNumber = Math.floor(Math.random() * 100000); // TODO get unique ID in grid
    for (let i = 1; i <= this.STARS; i++) {
      stars.push(
        <React.Fragment key={i}>
          <input
            type="radio"
            id={`star_${i}_input_${randNumber}`}
            name={`rate_${randNumber}`}
            value={i}
            checked={this.textToCellData(cell.value) === i}
            onChange={() => null}
          />
          <label
            htmlFor={`star_${i}_input_${randNumber}`}
            title="text"
            onClick={(e) => {
              e.preventDefault();
              onCellChanged({ ...cell, value: i }, true);
            }}
          />
        </React.Fragment>
      );
    }
    return <div className="rate">{stars.reverse()}</div>;
  }
}
