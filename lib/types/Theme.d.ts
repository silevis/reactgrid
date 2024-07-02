import React, { CSSProperties } from "react";

type ColumnsTemplateFunction = ({ amount, widths }: { amount: number; widths: string[] }) => string;
type RowsTemplateFunction = ({ amount, heights }: { amount: number; heights: string[] }) => string;

export type Offset = { top?: number; right?: number; bottom?: number; left?: number };

export type Border = {
  width: CSSProperties["borderWidth"];
  style: CSSProperties["borderStyle"];
  color: CSSProperties["borderColor"];
};

type Font = {
  family: CSSProperties["fontFamily"];
  size: CSSProperties["fontSize"];
  weight: CSSProperties["fontWeight"];
};

type Padding = {
  top: CSSProperties["paddingTop"];
  right: CSSProperties["paddingRight"];
  bottom: CSSProperties["paddingBottom"];
  left: CSSProperties["paddingLeft"];
};

export interface RGTheme {
  font: Font;
  grid: {
    templates: {
      columns: ColumnsTemplateFunction;
      rows: RowsTemplateFunction;
    };
    gap: {
      width: React.CSSProperties["width"];
      /** Changes grid's background color for the gap to appear colored */
      color: React.CSSProperties["color"];
    };
  };
  paneContainer: {
    top: {
      background: React.CSSProperties["backgroundColor"];
    };
    right: {
      background: React.CSSProperties["backgroundColor"];
    };
    bottom: {
      background: React.CSSProperties["backgroundColor"];
    };
    left: {
      background: React.CSSProperties["backgroundColor"];
    };
  };
  cellContainer: {
    padding: Padding;
    background: React.CSSProperties["backgroundColor"];
  };
  area: {
    border: Border;
  };
  focusIndicator: {
    background: React.CSSProperties["backgroundColor"];
    border: Border;
  };
  fillHandle: {
    background: React.CSSProperties["backgroundColor"];
    border: Border;
  };
  line: { backgroundColor: React.CSSProperties["backgroundColor"]; size: number | string };
  shadow: { backgroundColor: React.CSSProperties["backgroundColor"] };
  resizeColumn: {
    default: React.CSSProperties;
    hover: React.CSSProperties;
  };
  selectionIndicator: {
    background: React.CSSProperties["backgroundColor"];
    border: Border;
  };
  gridWrapper?: React.CSSProperties;
}

// Makes all properties in T optional, including nested properties, but excluding functions
type DeepPartial<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof T]?: T[P] extends (...args: any[]) => any ? T[P] : DeepPartial<T[P]>;
};

// This tells Emotion's ThemeProvider that the theme object is of type RGTheme
declare module "@emotion/react" {
  export interface Theme extends DeepPartial<RGTheme> {}
}
