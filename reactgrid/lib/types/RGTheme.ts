import React, { CSSProperties } from "react";

export type Offset = { top?: number; right?: number; bottom?: number; left?: number };

export type Border = {
  width: CSSProperties["borderWidth"];
  style: CSSProperties["borderStyle"];
  color: CSSProperties["borderColor"];
};

type Padding = {
  top: CSSProperties["paddingTop"];
  right: CSSProperties["paddingRight"];
  bottom: CSSProperties["paddingBottom"];
  left: CSSProperties["paddingLeft"];
};

export interface RGTheme {
  gap: {
    width: React.CSSProperties["width"];
    /** Changes grid's background color for the gap to appear colored */
    color: React.CSSProperties["color"];
  };
  paneContainer: {
    top: {
      background?: React.CSSProperties["backgroundColor"];
      boxShadow?: React.CSSProperties["boxShadow"];
    };
    right: {
      background?: React.CSSProperties["backgroundColor"];
      boxShadow?: React.CSSProperties["boxShadow"];
    };
    bottom: {
      background?: React.CSSProperties["backgroundColor"];
      boxShadow?: React.CSSProperties["boxShadow"];
    };
    left: {
      background?: React.CSSProperties["backgroundColor"];
      boxShadow?: React.CSSProperties["boxShadow"];
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
