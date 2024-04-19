import { FC, useRef, useState } from "react";
import { useCellContext } from "../CellContext";
import CellWrapper from "../CellWrapper";
import { useReactGridStore } from "../../utils/reactGridStore";
import { useReactGridId } from "../ReactGridIdProvider";
import { useDoubleTouch } from "../../hooks/useDoubleTouch";

interface NumberCellProps {
  value: number;
  onValueChanged: (newValue: number) => void;
  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
  format?: Intl.NumberFormat;
}

const NumberCell: FC<NumberCellProps> = ({
  value: initialValue,
  onValueChanged,
  validator,
  errorMessage,
  hideZero,
  format,
}) => {
  const id = useReactGridId();
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const hiddenFocusTargetRef = useReactGridStore(id, (store) => store.hiddenFocusTargetRef);
  const { handleDoubleTouch } = useDoubleTouch(ctx, setIsInEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  const textToDisplay =
    hideZero && initialValue === 0
      ? ""
      : format
      ? format.format(initialValue)
      : !isValid && errorMessage
      ? errorMessage
      : initialValue.toString();

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
          defaultValue={initialValue.toString()}
          onBlur={(e) => {
            hiddenFocusTargetRef?.focus({ preventScroll: true });
            onValueChanged(Number(e.currentTarget.value));
            setIsInEditMode(false);
          }}
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
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              setIsInEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              hiddenFocusTargetRef?.focus({ preventScroll: true });
              onValueChanged(Number(e.currentTarget.value));
              setIsInEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        textToDisplay
      )}
    </CellWrapper>
  );
};

export default NumberCell;
