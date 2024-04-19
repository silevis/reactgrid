import { FC, useRef, useState } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";
import { useReactGridStoreApi } from "../../utils/reactGridStore";
import { useReactGridId } from "../ReactGridIdProvider";
import { useDoubleTouch } from "../../hooks/useDoubleTouch";

interface TextCellProps {
  value: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
}

const TextCell: FC<TextCellProps> = ({ value: initialValue, onTextChanged, reverse }) => {
  const id = useReactGridId();
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const hiddenFocusTargetRef = useReactGridStoreApi(id).getState().hiddenFocusTargetRef;
  const { handleDoubleTouch } = useDoubleTouch(ctx, setIsInEditMode);

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        setIsInEditMode(true);
        ctx.requestFocus();
      }}
      onKeyDown={(e) => {
        if (!isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus();
          setIsInEditMode(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {isInEditMode ? (
        <textarea
          defaultValue={initialValue}
          style={{
            resize: "none",
            overflowY: "hidden",
            boxSizing: "border-box",
            textAlign: "center",
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            padding: 0,
            outline: "none",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
          onBlur={(e) => {
            hiddenFocusTargetRef?.focus({ preventScroll: true });
            onTextChanged(e.currentTarget.value);
            setIsInEditMode(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              setIsInEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              hiddenFocusTargetRef?.focus({ preventScroll: true });
              onTextChanged(e.currentTarget.value);
              setIsInEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : reverse ? (
        initialValue.split?.("").reverse().join("")
      ) : (
        initialValue
      )}
    </CellWrapper>
  );
};

export default TextCell;
