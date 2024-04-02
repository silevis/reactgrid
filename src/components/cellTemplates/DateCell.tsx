import { FC, forwardRef, useRef } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";
import { formatDate } from "../../utils/formatDate";
import { CellContextType } from "../../types/PublicModel";

interface DefaultCalendarProps {
  ctx: CellContextType;
  date: string;
  onDateChanged: (newDate: Date) => void;
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
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);

  let formattedDate: string | undefined;

  if (!formatter) {
    formattedDate = formatDate(value, "DD.MM.YYYY");
  } else {
    formattedDate = formatter(value);
  }

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => ctx.requestFocus(true)}
      onPointerDown={(e) => ctx.isInEditMode && e.stopPropagation()}
      onKeyDown={(e) => {
        if (!ctx.isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {ctx.isInEditMode ? (
        Calendar?.Template ? (
          <Calendar.Template
            {...Calendar?.props}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Escape") {
                ctx.disableEditMode();
              } else if (e.key === "Enter") {
                e.preventDefault();
                onDateChanged(new Date(e.currentTarget.value));
                ctx.disableEditMode();
              }
            }}
            onBlur={(e: React.PointerEvent<HTMLInputElement>) => {
              const changedDate = e.currentTarget.value;
              changedDate && onDateChanged(new Date(e.currentTarget.value));
            }}
            onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => e.stopPropagation()}
          />
        ) : (
          <DefaultCalendar ctx={ctx} ref={targetInputRef} date={formattedDate} onDateChanged={onDateChanged} />
        )
      ) : (
        formattedDate
      )}
    </CellWrapper>
  );
};

const DefaultCalendar = forwardRef(
  ({ ctx, date, onDateChanged }: DefaultCalendarProps, ref: React.ForwardedRef<HTMLInputElement>) => {
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
          changedDate && onDateChanged(new Date(e.currentTarget.value));
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            ctx.disableEditMode();
          } else if (e.key === "Enter") {
            e.preventDefault();
            onDateChanged(new Date(e.currentTarget.value));
            ctx.disableEditMode();
          }
        }}
        autoFocus
        ref={ref}
      />
    );
  }
);

export default DateCell;
