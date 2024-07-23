import React, { FC, forwardRef, useRef, useState } from "react";
import { useCellContext } from "../../lib/components/CellContext";
import { formatDate } from "../utils/formatDate";
import CellWrapper from "../../lib/components/CellWrapper";
import { CellContextType } from "../../lib/main";

interface DefaultCalendarProps {
  ctx: CellContextType;
  value: string | undefined;
  setIsInEditMode: (value: boolean) => void;
  onValueChanged: (data: Date) => void;
  style?: React.CSSProperties;
}

interface DateCellProps {
  value: Date;
  formatter?: (date: Date) => string;
  onValueChanged: (data: Date) => void;
  format?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Calendar?: { Template: React.ComponentType<any>; props: { [key: string]: any } };
}

export const DateCell: FC<DateCellProps> = ({ value, onValueChanged, formatter, Calendar }) => {
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

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        setEditMode(true);
      }}
      onKeyDown={(e) => {
        if (!isEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
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
                onValueChanged(new Date(e.currentTarget.value));
                setEditMode(false);
              }
            }}
            onBlur={(e: React.PointerEvent<HTMLInputElement>) => {
              const changedDate = e.currentTarget.value;
              changedDate && onValueChanged(new Date(e.currentTarget.value));
              setEditMode(false);
            }}
            onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => e.stopPropagation()}
          />
        ) : (
          <DefaultCalendar
            ctx={ctx}
            setIsInEditMode={setEditMode}
            ref={targetInputRef}
            value={formattedDate}
            onValueChanged={onValueChanged}
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
    { ctx, value, setIsInEditMode, onValueChanged }: DefaultCalendarProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        type="date"
        defaultValue={value}
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
          changedDate && onValueChanged(new Date(e.currentTarget.value));
          setIsInEditMode(false);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            setIsInEditMode(false);
          } else if (e.key === "Enter") {
            e.preventDefault();
            onValueChanged(new Date(e.currentTarget.value));
            setIsInEditMode(false);
          }
        }}
        autoFocus
        ref={ref}
      />
    );
  }
);
