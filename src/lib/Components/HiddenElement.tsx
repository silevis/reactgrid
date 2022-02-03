import * as React from "react";
import { useReactGridState } from "./StateProvider";
interface HiddenElementProps {
  hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

export const HiddenElement: React.FC<HiddenElementProps> = ({
  hiddenElementRefHandler,
}) => {
  const { hiddenFocusElement } = useReactGridState();
  return (
    <input
      className="rg-hidden-element"
      ref={hiddenElementRefHandler}
      inputMode="none"
      onBlur={(e) => {
        if (!e.relatedTarget) {
          // prevents from losing focus on hidden element on mobile devices
          hiddenFocusElement?.focus({ preventScroll: true });
        }
      }}
    />
  );
};
