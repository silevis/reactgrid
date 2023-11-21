import { State } from '../Model/State';
import { Compatible, Cell } from '../Model/PublicModel';
import { ClipboardEvent } from '../Model/domEventsTypes';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { pasteData } from './pasteData';

const decimalSeparator = (1.1).toLocaleString().substring(1, 2);
const thousandSeparator = (1000).toLocaleString().substring(1, 2);

function parseFloatLocale(text: string): number {
    return parseFloat(
      text
        .replace(thousandSeparator, "")
        .replace(decimalSeparator, ".")
        .replace(/[^0-9.-]/g, "")
    );
}

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
          row.push(data ? data : { type: "text", text, value: parseFloatLocale(text) });
        }
        pastedRows.push(row);
      }
    } else {
      pastedRows = event.clipboardData
        .getData("text/plain")
        .split("\n")
        .map((line: string) =>
          line
            .split("\t")
            .map((t) => ({ type: "text", text: t, value: parseFloatLocale(t) }))
        );
    }
    event.preventDefault();
    return { ...pasteData(state, pastedRows) };
}
