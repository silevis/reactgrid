import { RGTheme } from "../types/RGTheme";

const lightTheme: RGTheme = {
  gap: {
    width: "1px",
    color: "rgb(230 230 230)",
  },
  paneContainer: {
    top: {},
    right: {},
    bottom: {},
    left: {},
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
  line: {
    backgroundColor: "lightblue",
    size: "3px",
  },
  shadow: {
    backgroundColor: "#E5E5E5AF",
  },
  resizeColumn: {
    default: {
      position: "absolute",
      top: 0,
      right: 0,
      background: "transparent",
      width: "5px",
      height: "100%",
    },
    hover: {
      backgroundColor: "lightblue",
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
