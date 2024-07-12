import React from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { getHiddenTargetFocusByIdx } from "../utils/getHiddenTargetFocusByIdx";

const HiddenFocusTarget = ({ rowIdx, colIdx }: { colIdx: number; rowIdx: number }) => {
  // const id = useReactGridId();
  // const assignHiddenFocusTargetRef = useReactGridStore(id, (store) => store.assignHiddenFocusTargetRef);
  // const hiddenFocusTargetRef = React.useRef<HTMLInputElement>(null);

  // React.useEffect(() => {
  //   assignHiddenFocusTargetRef(hiddenFocusTargetRef.current!);
  // }, [hiddenFocusTargetRef]);
  console.log("HiddenFocusTarget render");

  return (
    <div style={{ position: "relative" }}>
      <input
        className={`rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`}
        style={{ position: "absolute", top: 0, left: 0, width: 5, height: 5, opacity: 1 }}
        // ref={hiddenFocusTargetRef}
        onBlur={(e) => {
          if (!e.relatedTarget) {
            // prevents from losing focus on hidden element on mobile devices
            getHiddenTargetFocusByIdx(rowIdx, colIdx)?.blur();
          }
        }}
      />
    </div>
  );
};

export default HiddenFocusTarget;
