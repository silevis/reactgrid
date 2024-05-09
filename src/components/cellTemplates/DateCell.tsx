import { FC, forwardRef, useEffect, useRef } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";
import { formatDate } from "../../utils/formatDate";

interface DefaultCalendarProps {
  date: string;
  setIsInEditMode: (value: boolean) => void;
  onDateChanged: (data: { date?: Date; text?: string }) => void;
  style?: React.CSSProperties;
}

interface DateCellProps {
  value?: Date;
  formatter?: (date: Date) => string;
  onDateChanged: (data: { date?: Date; text?: string }) => void;
  format?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Calendar?: { Template: React.ComponentType<any>; props: { [key: string]: any } };
}

const DateCell: FC<DateCellProps> = ({ value, onDateChanged, formatter, Calendar }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);

  let formattedDate: string | undefined;

  if (!value) {
    formattedDate = "";
  } else if (!formatter) {
    formattedDate = formatDate(value, "DD-MM-YYYY");
  } else {
    formattedDate = formatter(value);
  }

  useEffect(() => {
    onDateChanged({ text: formattedDate, date: value });
  }, [value]);

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        ctx.setEditMode(true);
        ctx.requestFocus();
      }}
      onKeyDown={(e) => {
        if (!ctx.isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus();
          ctx.setEditMode(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {ctx.isInEditMode ? (
        Calendar?.Template ? (
          <Calendar.Template
            {...Calendar?.props}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                ctx.setEditMode(false);
              } else if (e.key === "Enter") {
                e.preventDefault();
                onDateChanged({ date: new Date(e.currentTarget.value) });
                ctx.setEditMode(false);
              }
            }}
            onBlur={(e: React.PointerEvent<HTMLInputElement>) => {
              const changedDate = e.currentTarget.value;
              changedDate && onDateChanged({ date: new Date(e.currentTarget.value) });
              ctx.setEditMode(false);
            }}
            onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => e.stopPropagation()}
          />
        ) : (
          <DefaultCalendar
            setIsInEditMode={ctx.setEditMode}
            ref={targetInputRef}
            date={formattedDate}
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
  ({ date, setIsInEditMode, onDateChanged }: DefaultCalendarProps, ref: React.ForwardedRef<HTMLInputElement>) => {
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
          const changedDate = e.currentTarget.value;
          changedDate && onDateChanged({ date: new Date(e.currentTarget.value) });
          setIsInEditMode(false);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            setIsInEditMode(false);
          } else if (e.key === "Enter") {
            e.preventDefault();
            onDateChanged({ date: new Date(e.currentTarget.value) });
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
