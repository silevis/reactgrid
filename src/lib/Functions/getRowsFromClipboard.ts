import { Cell, Compatible } from "../Model/PublicModel";
import { parseLocaleNumber } from "./parseLocaleNumber";

async function getPlainTextFromClipboard() {
  const text = await navigator.clipboard.readText();
  const dataForCells = text
    .split("\n")
    .map((line) => line.split("\t").map((t) => ({ type: "text", text: t, value: parseLocaleNumber(t) })));
  return dataForCells;
}

export default async (): Promise<Compatible<Cell>[][]> => {
  // Pasted data from clipboard
  let pastedRows: Compatible<Cell>[][] = [];

  // A1. Check if clipboard contains plain/HTML type of data
  const clipboardItems = await navigator.clipboard.read();
  const HTMLItem = clipboardItems.find((item) => {
    if (item.types.includes("text/html")) {
      return true;
    }
  });
  // B. If it's plain data, then get it, and assign it to pastedRows
  if (!HTMLItem) {
    pastedRows = await getPlainTextFromClipboard();
  }
  // A2. If it's HTML data, then parse it, and assign it to pastedRows
  const HTMLString = (await HTMLItem?.getType("text/html")?.then((blob) => blob.text())) as string;
  const document = new DOMParser().parseFromString(HTMLString, "text/html");
  const hasReactGridAttribute = document.body.firstElementChild?.getAttribute("data-reactgrid") === "reactgrid-content";
  if (hasReactGridAttribute && document.body.firstElementChild?.firstElementChild) {
    const tableRows = document.body.firstElementChild.firstElementChild.children;
    for (let ri = 0; ri < tableRows.length; ri++) {
      const row: Compatible<Cell>[] = [];
      for (let ci = 0; ci < tableRows[ri].children.length; ci++) {
        const rawData = tableRows[ri].children[ci].getAttribute("data-reactgrid");
        const data = rawData && JSON.parse(rawData);
        const text = tableRows[ri].children[ci].innerHTML;
        row.push(data ? data : { type: "text", text, value: parseLocaleNumber(text) });
      }
      pastedRows.push(row);
    }
  }
  // A3. If it's HTML data, but not from ReactGrid, then get plain data, and assign it to pastedRows
  else {
    pastedRows = await getPlainTextFromClipboard();
  }
  return pastedRows;
};