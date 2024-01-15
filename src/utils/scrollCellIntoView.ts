import { Cell } from "../types/PublicModel";
import { getCellContainer } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getScrollOfScrollableElement, getScrollableParent, getSizeOfScrollableElement } from "./scrollHelpers";

export function scrollCellIntoView(store: ReactGridStore, cell: Cell): void {
  const cellElement = getCellContainer(store, cell) as HTMLDivElement;
  if (!cellElement) return;
  if (!store.reactGridRef) throw new Error("No reactGridRef found in store!");

  const scrollableParent = getScrollableParent(store.reactGridRef, true);
  if (!scrollableParent) return;
  const { scrollTop, scrollHeight } = getScrollOfScrollableElement(scrollableParent);
  const { height: clientHeight } = getSizeOfScrollableElement(scrollableParent);
  
  // console.log(Math.abs(scrollHeight - scrollTop) - clientHeight <= scrollHeight - 5);
  
  
  // TODO: if last cell is in view, stop scrolling.
  if (Math.abs((scrollHeight - scrollTop) - clientHeight) <= 5) return;
  // console.log(scrollableParent.scrollTop, scrollableParent.scrollHeight, scrollableParent.clientHeight);

  // scrollableParent.scrollBy(0, cellElement.clientHeight);

  cellElement.scrollIntoView({
    behavior: "auto",
    block: "center",
    inline: "nearest",
  });
}
