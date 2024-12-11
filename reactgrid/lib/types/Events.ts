import { ReactGridStore } from "./ReactGridStore.ts";

export type ReactGridEventNames = ReactGridComponentEvents | ReactGridPointerEvents;

type ReactGridPointerEvents = `pointer${RowEvents | ColumnEvents}`;

type RowEvents = "rowselection" | "rowresize" | "rowreorder";
type ColumnEvents = "columnselection" | "columnresize" | "columnreorder";

type ReactGridComponentEvents = "focuschange" | "selectionchange" | "fillhandle";

export type ReactGridEvent = Event & { reactgrid: RegisteredChanges };

export type ChangeObservedKeys = keyof Pick<
  ReactGridStore,
  | "cells"
  | "rows"
  | "columns"
  | "styledRanges"
  | "currentBehavior"
  | "focusedLocation"
  | "selectedArea"
  | "colMeasurements"
>;
export type EventKeyPair = [ReactGridEventNames, ChangeObservedKeys];
export type RegisteredChanges = {
  [key in ChangeObservedKeys]?: {
    before: ReactGridStore[ChangeObservedKeys];
    after: ReactGridStore[ChangeObservedKeys];
  };
};
