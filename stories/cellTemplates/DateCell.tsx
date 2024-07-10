import React, { FC, forwardRef, useEffect, useRef, useState } from "react";
import { useCellContext } from "../../lib/components/CellContext";
import { formatDate } from "../utils/formatDate";
import CellWrapper from "../../lib/components/CellWrapper";
import { CellContextType } from "../../lib/main";

interface DefaultCalendarProps {
  ctx: CellContextType;
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

export const DateCell: FC<DateCellProps> = ({ value, onDateChanged, formatter, Calendar }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);

  let formattedDate: string | undefined;

  if (!value) {
    formattedDate = "";
  } else if (!formatter) {
    formattedDate = formatDate(value, "DD-MM-YYYY");
  } else {
    formattedDate = formatter(value);
  }

  useEffect(() => {
    onDateChanged({ date: value, text: formattedDate });
  }, [value]);

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        setEditMode(true);
        ctx.requestFocus();
      }}
      onKeyDown={(e) => {
        if (!isEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus();
          setEditMode(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {isEditMode ? (
        Calendar?.Template ? (
          <Calendar.Template
            {...Calendar?.props}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                setEditMode(false);
              } else if (e.key === "Enter") {
                e.preventDefault();
                onDateChanged({ date: new Date(e.currentTarget.value) });
                setEditMode(false);
                ctx.requestFocus("Bottom");
              }
            }}
            onBlur={(e: React.PointerEvent<HTMLInputElement>) => {
              const changedDate = e.currentTarget.value;
              changedDate && onDateChanged({ date: new Date(e.currentTarget.value) });
              setEditMode(false);
            }}
            onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => e.stopPropagation()}
          />
        ) : (
          <DefaultCalendar
            ctx={ctx}
            setIsInEditMode={setEditMode}
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
  ({ ctx, date, setIsInEditMode, onDateChanged }: DefaultCalendarProps, ref: React.ForwardedRef<HTMLInputElement>) => {
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
            ctx.requestFocus("Bottom");
          }
        }}
        autoFocus
        ref={ref}
      />
    );
  }
);
