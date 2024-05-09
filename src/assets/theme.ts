import { RGTheme } from "../types/Theme";

const lightTheme: RGTheme = {
  font: {
    family: "",
    size: "",
    weight: "",
  },
  grid: {
    templates: {
      columns: ({ widths }) => widths.join(" "),
      rows: ({ heights }) => heights.join(" "),
    },
    gap: {
      width: "1px",
      color: "#efefef",
    },
  },
  paneContainer: {
    top: {
      background: "#feffde",
    },
    right: {
      background: "#fcfceb",
    },
    bottom: {
      background: "#feffde",
    },
    left: {
      background: "#fcfceb",
    },
  },
  cellContainer: {
    padding: {
      top: "2px",
      right: "2px",
      bottom: "2px",
      left: "2px",
    },
    background: "white",
  },
  area: {
    border: {
      color: "lightblue",
      style: "solid",
      width: "2px",
    },
  },
  focusIndicator: {
    background: "transparent",
    border: {
      color: "#3bb6df",
      style: "solid",
      width: "2px",
    },
  },
  fillHandle: {
    background: "transparent",
    border: {
      color: "black",
      style: "dashed",
      width: "2px",
    },
  },
  selectionIndicator: {
    background: "#add8e630",
    border: {
      color: "lightblue",
      style: "solid",
      width: "2px",
    },
  },
};

export default lightTheme;
