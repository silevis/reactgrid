import { FC, forwardRef, useRef, useState } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";
import { formatDate } from "../../utils/formatDate";
import { useReactGridStore } from "../../utils/reactGridStore";
import { useReactGridId } from "../ReactGridIdProvider";

interface DefaultCalendarProps {
  date: string;
  setIsInEditMode: (value: boolean) => void;
  onDateChanged: (newDate: Date) => void;
  hiddenFocusTargetRef: HTMLDivElement | undefined;
}

interface DateCellProps {
  value: Date;
  formatter?: (date: Date) => string;
  onDateChanged: (newDate: Date) => void;
  format?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Calendar?: { Template: React.ComponentType<any>; props: { [key: string]: any } };
}

const DateCell: FC<DateCellProps> = ({ value, onDateChanged, formatter, Calendar }) => {
  const id = useReactGridId();
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const hiddenFocusTargetRef = useReactGridStore(id, (store) => store.hiddenFocusTargetRef);

  let formattedDate: string | undefined;

  if (!formatter) {
    formattedDate = formatDate(value, "DD-MM-YYYY");
  } else {
    formattedDate = formatter(value);
  }

  return (
    <CellWrapper
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
        Calendar?.Template ? (
          <Calendar.Template
            {...Calendar?.props}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                setIsInEditMode(false);
              } else if (e.key === "Enter") {
                e.preventDefault();
                hiddenFocusTargetRef?.focus({ preventScroll: true });
                onDateChanged(new Date(e.currentTarget.value));
                setIsInEditMode(false);
              }
            }}
            onBlur={(e: React.PointerEvent<HTMLInputElement>) => {
              const changedDate = e.currentTarget.value;
              changedDate && onDateChanged(new Date(e.currentTarget.value));
              setIsInEditMode(false);
            }}
            onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => e.stopPropagation()}
          />
        ) : (
          <DefaultCalendar
            setIsInEditMode={setIsInEditMode}
            ref={targetInputRef}
            date={formattedDate}
            hiddenFocusTargetRef={hiddenFocusTargetRef}
            onDateChanged={onDateChanged}
          />
        )
      ) : (
        formattedDate
      )}
    </CellWrapper>
  );
};

const DefaultCalendar = forwardRef(
  (
    { date, hiddenFocusTargetRef, setIsInEditMode, onDateChanged }: DefaultCalendarProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        type="date"
        defaultValue={date}
        style={{
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
          const changedDate = e.currentTarget.value;
          changedDate && onDateChanged(new Date(e.currentTarget.value));
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            setIsInEditMode(false);
          } else if (e.key === "Enter") {
            e.preventDefault();
            hiddenFocusTargetRef?.focus({ preventScroll: true });
            onDateChanged(new Date(e.currentTarget.value));
            setIsInEditMode(false);
          }
        }}
        autoFocus
        ref={ref}
      />
    );
  }
);

export default DateCell;
