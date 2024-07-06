import React from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";

const HiddenFocusTarget = () => {
  const id = useReactGridId();
  const assignHiddenFocusTargetRef = useReactGridStore(id, (store) => store.assignHiddenFocusTargetRef);
  const hiddenFocusTargetRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    assignHiddenFocusTargetRef(hiddenFocusTargetRef.current!);
  }, [hiddenFocusTargetRef]);

  return (
    <div style={{ position: "relative" }}>
      <input
        className="rgHiddenFocusTarget"
        style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0 }}
        ref={hiddenFocusTargetRef}
        inputMode="none"
        autoFocus
        onBlur={(e) => {
          if (!e.relatedTarget) {
            // prevents from losing focus on hidden element on mobile devices
            hiddenFocusTargetRef.current?.focus({ preventScroll: true });
          }
        }}
      />
    </div>
  );
};

export default HiddenFocusTarget;
