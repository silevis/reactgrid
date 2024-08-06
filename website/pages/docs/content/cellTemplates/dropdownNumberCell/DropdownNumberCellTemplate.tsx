import * as React from 'react';
import { CellTemplate, Cell, Compatible, CellStyle, getCellProperty, Uncertain, UncertainCompatible } from '@silevis/reactgrid';
import './number-dropdown-cell-style.scss';


export interface DropdownNumberCell extends Cell {
  type: 'dropdownNumber';
  isOpened: boolean;
  value: number;
}

export const CellComponent: React.FC<{cell:Compatible<DropdownNumberCell>, onChange: (e: React.FormEvent<HTMLInputElement>) => void}> = ({cell, onChange}) => {
    const [isOpen, setOpen] = React.useState<boolean>(false);
    return (
        <>
          <div className="wrapper">
            <div className="value">{cell.value}</div>
            <div
              className="chevron"
              onClick={() => {
                setOpen(!isOpen)
              }}
            >
              <div
                style={{
                  transform: !isOpen ? "rotate(0deg)" : "rotate(90deg)",
                  transitionDuration: "200ms",
                }}
              >
                {" "}
                ❯
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="dropdown">
              <input
                type="range"
                min={DropdownNumberCellTemplate.MIN_VAL}
                max={DropdownNumberCellTemplate.MAX_VAL}
                step={DropdownNumberCellTemplate.STEP}
                defaultValue={cell.value.toString()}
                onPointerDown={(e) => e.stopPropagation()}
                onChange={onChange}
              />
            </div>
          )}
        </>
    )
}
 
export class DropdownNumberCellTemplate implements CellTemplate<DropdownNumberCell> {

  static MIN_VAL: number = 0
  static MAX_VAL: number = 100
  static STEP: number = 2

  getCompatibleCell(uncertainCell: Uncertain<DropdownNumberCell>): Compatible<DropdownNumberCell> {
    const value = getCellProperty(uncertainCell, 'value', 'number');
    const isOpened = getCellProperty(uncertainCell, 'isOpened', 'boolean');
    const limitedValue = this.getLimitedValue(value);
    return { ...uncertainCell, value: limitedValue, text: limitedValue.toString(), isOpened };
  }

  getLimitedValue(value: number): number {
    if (Number.isNaN(value) || value < DropdownNumberCellTemplate.MIN_VAL)
      return DropdownNumberCellTemplate.MIN_VAL;
    else if (value > DropdownNumberCellTemplate.MAX_VAL)
      return DropdownNumberCellTemplate.MAX_VAL;
    else return value;
  }

  handleKeyDown(cell: Compatible<DropdownNumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownNumberCell>, enableEditMode: boolean } {
    return { cell, enableEditMode: false }
  }

  update(cell: Compatible<DropdownNumberCell>, cellToMerge: UncertainCompatible<DropdownNumberCell>): Compatible<DropdownNumberCell> {
    if (cellToMerge.value !== undefined && !isNaN(cellToMerge.value))
      return this.getCompatibleCell({ ...cell, value: cellToMerge.value });
    const parsed = parseFloat(cellToMerge.text);
    return this.getCompatibleCell({ ...cell, value: (parsed > 0 || parsed < 0) ? parsed : 0 });
  }

  getStyle(cell: Compatible<DropdownNumberCell>, isInEditMode: boolean): CellStyle {
    return ({ overflow: 'unset' }) as CellStyle
  };

  render(cell: Compatible<DropdownNumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DropdownNumberCell>, commit: boolean) => void): React.ReactNode {
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        onCellChanged(
          this.getCompatibleCell({
            ...cell,
            value: parseInt(e.currentTarget.value, 10),
          }),
          true
        )
      }
    return <CellComponent onChange={onChange} cell={cell}/>
  }
}