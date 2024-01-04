import { Cell, Compatible } from "../Model/PublicModel";
import { parseLocaleNumber } from "./parseLocaleNumber";

async function getCellsFromClipboardPlainText(): Promise<Compatible<Cell>[][]> {
  const text = await navigator.clipboard.readText().catch(() => {
    throw new Error("Failed to read textual data from clipboard!");
  });

  return text.split("\n").map((line) =>
    line.split("\t").map((textValue) => ({
      type: "text",
      text: textValue,
      value: parseLocaleNumber(textValue),
    }))
  );
}

async function getDocumentFromHTMLClipboardItem(HTMLItem: ClipboardItem): Promise<Document> {
  const HTMLBlob = await HTMLItem.getType("text/html").catch(() => {
    throw new Error("Failed to get HTML Blob data from clipboard!");
  });
  const HTMLString = await HTMLBlob.text().catch(() => {
    throw new Error("Failed to parse HTML Blob to text!");
  });

  try {
    const document = new DOMParser().parseFromString(HTMLString, "text/html");

    return document;
  } catch (e) {
    throw new Error("Failed to parse HTML string to DOM!");
  }
}

async function getCellsFromDocumentBody(documentBody: HTMLElement): Promise<Compatible<Cell>[][]> {
  const pastedRows: Compatible<Cell>[][] = [];

  if (!documentBody.firstElementChild?.firstElementChild) {
    return await getCellsFromClipboardPlainText();
  }

  const tableRows = documentBody.firstElementChild.firstElementChild.children;

  for (let rowIdx = 0; rowIdx < tableRows.length; rowIdx++) {
    const row: Compatible<Cell>[] = [];

    for (let colIdx = 0; colIdx < tableRows[rowIdx].children.length; colIdx++) {
      const rawData = tableRows[rowIdx].children[colIdx].getAttribute("data-reactgrid");
      const data = rawData && JSON.parse(rawData);
      const text = tableRows[rowIdx].children[colIdx].textContent ?? "";

      row.push(data ? data : { type: "text", text, value: parseLocaleNumber(text) });
    }

    pastedRows.push(row);
  }

  return pastedRows;
}

export default async (): Promise<Compatible<Cell>[][]> => {
  const clipboardItems = await navigator.clipboard.read();

  // TODO: Support multiple clipboard items
  // Find the first clipboard item that has HTML data
  const HTMLItem = clipboardItems.find((item) => item.types.includes("text/html"));

  // If the clipboard item with HTML data is found, try to parse it...
  const document = HTMLItem ? await getDocumentFromHTMLClipboardItem(HTMLItem) : null;
  const hasReactGridContent = document?.body.firstElementChild?.getAttribute("data-reactgrid") === "reactgrid-content";

  // If the parsed document has ReactGrid content, get the cells from the document body
  if (hasReactGridContent) {
    return getCellsFromDocumentBody(document.body);
  }

  // ...otherwise, get the cells from the clipboard's textual data
  return await getCellsFromClipboardPlainText();
};
