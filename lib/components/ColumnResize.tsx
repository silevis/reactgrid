import theme from "../assets/theme";
import { ResizeColumnBehavior } from "../behaviors/ResizeColumnBehavior";
import { useReactGridStore } from "../utils/reactGridStore";
import { useCellContext } from "./CellContext";
import { useReactGridId } from "./ReactGridIdProvider";

export const ColumnResize = () => {
  const id = useReactGridId();
  const ctx = useCellContext();

  const resizingColId = useReactGridStore(id, (store) => store.resizingColId);
  const columns = useReactGridStore(id, (store) => store.columns);
  const shadowSize = useReactGridStore(id, (store) => store.shadowSize);

  const onResizeColumn = useReactGridStore(id, (store) => store.onResizeColumn);
  const setCurrentBehavior = useReactGridStore(id, (store) => store.setCurrentBehavior);
  const setResizingColId = useReactGridStore(id, (store) => store.setResizingColId);

  const cellColumn = columns.find((col) => col.id === ctx.colId);

  const shouldEnableColumnResize =
    resizingColId === undefined && onResizeColumn && cellColumn?.resizable && !shadowSize;

  return (
    shouldEnableColumnResize && (
      <div
        className="rg-resize-column"
        onPointerDown={() => {
          setResizingColId(ctx.colId);
          setCurrentBehavior(ResizeColumnBehavior);
        }}
        css={{
          cursor: "col-resize",
          ...theme.resizeColumn.default,
          "&:hover": {
            ...theme.resizeColumn.hover,
          },
        }}
      />
    )
  );
};
