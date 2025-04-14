import { State } from '../Model/State';
import { Compatible, Cell } from '../Model/PublicModel';
import { ClipboardEvent } from '../Model/domEventsTypes';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { pasteData } from './pasteData';
import { parseLocaleNumber } from './parseLocaleNumber';

export function handlePaste(event: ClipboardEvent, state: State): State {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
      return state;
    }
    let pastedRows: Compatible<Cell>[][] = [];
    const htmlData = event.clipboardData.getData("text/html");
    const document = new DOMParser().parseFromString(htmlData, "text/html");
    // TODO Do we need selection mode here ?
    //const selectionMode = parsedData.body.firstElementChild && parsedData.body.firstElementChild.getAttribute('data-selection') as SelectionMode;
    // TODO quite insecure! maybe do some checks ?
    const hasReactGridAttribute =
      document.body.firstElementChild?.getAttribute("data-reactgrid") ===
      "reactgrid-content";
    if (
      hasReactGridAttribute &&
      document.body.firstElementChild?.firstElementChild
    ) {
      const tableRows =
        document.body.firstElementChild.firstElementChild.children;
      for (let ri = 0; ri < tableRows.length; ri++) {
        const row: Compatible<Cell>[] = [];
        for (let ci = 0; ci < tableRows[ri].children.length; ci++) {
          const rawData =
            tableRows[ri].children[ci].getAttribute("data-reactgrid");
          const data = rawData && JSON.parse(rawData);
          const text = tableRows[ri].children[ci].innerHTML;
          row.push(data ? data : { type: "text", text, value: parseLocaleNumber(text) });
        }
        pastedRows.push(row);
      }
    } else {
      pastedRows = event.clipboardData
        .getData("text/plain")
        .replace(/(\r\n)$/, '')
        .split("\n")
        .map((line: string) => line.split("\t").map((t) => {
          const parsedDate = parseExcelDate(t);
          return parsedDate ? { type: "date", text: t, value: parsedDate.getTime() } : { type: "text", text: t, value: parseLocaleNumber(t) };
      }));
    }
    event.preventDefault();
    return { ...pasteData(state, pastedRows) };
  }
  
function parseExcelDate(excelDate: string): Date | null {
    const isDateString = excelDate?.split('.')?.length > 2;
    if(!isDateString) {
      return null;
    }
    const timestamp = Date.parse(excelDate);
    return isNaN(timestamp) ? null : new Date(timestamp);
}