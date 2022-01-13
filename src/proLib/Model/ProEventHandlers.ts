import { EventHandlers } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { proRecalcVisibleRange } from "../Functions/proRecalcVisibleRange";
import { ProBehavior } from "./ProBehavior";
import { ProState } from "./ProState";

export class ProEventHandlers extends EventHandlers {
  handleContextMenu = (event: PointerEvent): void =>
    this.updateState((state) =>
      (state.currentBehavior as ProBehavior).handleContextMenu(
        event,
        state as ProState
      )
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  windowResizeHandler = (): void =>
    this.updateState(proRecalcVisibleRange as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactgridRefHandler = (reactGridElement: HTMLDivElement): void =>
    this.assignElementsRefs(reactGridElement, proRecalcVisibleRange as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollHandler: () => void = () =>
    this.scrollHandlerInternal(proRecalcVisibleRange as any);
}
