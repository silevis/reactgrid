import { IDatagridState } from './VirtualEnv';
import { DatagridDataGenerator } from './DatagridDataGenerator';


export class VirtualUser {

  constructor(public borderColor: string, private highlightColumnIdx: number, private highlightRowIdx: number) {
    this.borderColor = borderColor;
    this.highlightColumnIdx = highlightColumnIdx;
    this.highlightRowIdx = highlightRowIdx;
  }

  private count: number = 0;
  private currectLetterCount = -1;
  private drawData: string = '';
  private dataGen = new DatagridDataGenerator();

  getHighlightedCell(state: IDatagridState) {
    return this.getHighlightedRow(state).cells[this.highlightColumnIdx];
  }

  getHighlightedColumn(state: IDatagridState) {
    return state.columns[this.highlightColumnIdx];
  }

  getHighlightedRow(state: IDatagridState) {
    return state.rows[this.highlightRowIdx];
  }

  drawHighlight(state: IDatagridState) {
    const moveFactor = 2;
    this.highlightColumnIdx = DatagridDataGenerator.getRandomInt(Math.max(0, this.highlightColumnIdx - moveFactor), Math.min(this.highlightColumnIdx + moveFactor, state.columns.length));
    this.highlightRowIdx = DatagridDataGenerator.getRandomInt(Math.max(1, this.highlightRowIdx - moveFactor), Math.min(this.highlightRowIdx + moveFactor, state.rows.length));
  }

  updateHighlightsState(state: IDatagridState): IDatagridState {
    const highlightLocations = [...state.highlights].filter(highlight => highlight.borderColor !== this.borderColor);

    if (state.rows.length > 0 && this.getHighlightedColumn(state)) {
      const highlight = {
        columnId: this.getHighlightedColumn(state).columnId,
        rowId: this.getHighlightedRow(state).rowId,
        borderColor: this.borderColor
      };
      return { ...state, highlights: [...highlightLocations, highlight] };
    }
    return { ...state }
  }

  makeChanges(state: IDatagridState): IDatagridState {

    if (this.currectLetterCount === -1) {
      this.drawData = this.dataGen.getDataAttrByKey(this.getHighlightedColumn(state).columnId) as string;
      this.drawHighlight(state);
      state = this.updateHighlightsState(state);
    }

    this.currectLetterCount += 1;

    state = this.updateHighlightsState(state);

    if (this.drawData && this.drawData.length < this.currectLetterCount) {
      this.currectLetterCount = 0;
      this.drawHighlight(state);
      this.drawData = this.dataGen.getDataAttrByKey(this.getHighlightedColumn(state).columnId) as string;
    }

    const removeChars = DatagridDataGenerator.getRandomInt(0, 1);

    for (let i = 0; i < this.currectLetterCount; i++) {

      if (removeChars) {
        // this.currectLetterCount -= removeChars;
        break;
      }

      state = {
        ...state,
        rows: state.rows.map((row, rIdx) => {
          if (rIdx === this.highlightRowIdx) {
            return {
              ...row,
              cells: row.cells.map((cell, cIdx) => {
                if (cIdx === this.highlightColumnIdx) {
                  return { ...cell, text: this.drawData.slice(0, this.currectLetterCount), value: parseInt(this.drawData.slice(0, this.currectLetterCount), 10) };
                }
                return cell;
              })
            }
          }
          return row;
        })
      }

    }

    this.count++;
    return state;
  }

}