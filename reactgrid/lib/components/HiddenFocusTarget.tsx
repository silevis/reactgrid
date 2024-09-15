import { useEffect } from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { getHiddenTargetFocusByIdx } from "../utils/getHiddenTargetFocusByIdx";

const HiddenFocusTarget = ({ rowIdx, colIdx }: { colIdx: number; rowIdx: number }) => {
  const id = useReactGridId();
  const changedFocusedLocation = useReactGridStore(id, (store) => store.changedFocusedLocation);

  useEffect(() => {
    if (changedFocusedLocation) {
      getHiddenTargetFocusByIdx(changedFocusedLocation.rowIndex, changedFocusedLocation.colIndex)?.focus();
    }
  }, [changedFocusedLocation]);

  return (
    <div style={{ position: "absolute", bottom: 0, right: "50%" }}>
      <input
        onKeyDown={(e) => {
          // Let a 'tab' key to be triggered only by the GridWrapper onKeyDown event
          if (e.key === "Tab") e.preventDefault();
        }}
        className={`rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`}
        style={{ width: 1, height: 1, opacity: 0, cursor: "default" }}
        inputMode="none"
      />
    </div>
  );
};

export default HiddenFocusTarget;
