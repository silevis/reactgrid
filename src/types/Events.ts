export type ReactGridEvents = ReactGridComponentEvents | ReactGridPointerEvents

type ReactGridPointerEvents = `pointer${RowEvents | ColumnEvents}`;

type RowEvents = "rowselection" | "rowresize" | "rowreorder";
type ColumnEvents = "columnselection" | "columnresize" | "columnreorder";

type ReactGridComponentEvents = "focuschange" | "selectionchange" | "fillhandle"
