import { RGTheme } from "../types/Theme";

const lightTheme: RGTheme = {
  colors: {
    primary: "",
    secondary: "",
    background: "",
    shadow: ""
  },
  shadows: {
    sm: "",
    md: "",
    lg: ""
  },
  font: {
    family: "",
    size: "",
    weight: ""
  },
  grid: {
    templates: {
      columns: ({ widths }) => widths.join(" "),
      rows: ({ heights }) => heights.join(" ")
    },

    gap: {
      width: "2px",
      color: "#efefef"
    },
    // padding: {
    //   top: "",
    //   right: "",
    //   bottom: "",
    //   left: ""
    // },
    // margin: {
    //   top: "",
    //   right: "",
    //   bottom: "",
    //   left: ""
    // },
  },
  cellContainer: {
    padding: {
      top: "2px",
      right: "2px",
      bottom: "2px",
      left: "2px"
    },
    border: {
      width: "2px",
      style: "solid",
      color: "#000"
    }
  },
  area: {
    border: {
      color: "lightblue",
      style: "solid",
      width: "2px",
    }
  }
};

export const darkTheme: RGTheme = {
  colors: {
    primary: "#89cff0",
    secondary: "",
    background: "",
    shadow: ""
  },
  shadows: {
    sm: "",
    md: "",
    lg: ""
  },
  font: {
    family: "",
    size: "",
    weight: ""
  },
  grid: {
    gap: "",

    padding: {
      top: "",
      right: "",
      bottom: "",
      left: ""
    },
    margin: {
      top: "",
      right: "",
      bottom: "",
      left: ""
    },
    border: {
      width: "",
      style: "",
      color: ""
    }
  },
  cells: {
    padding: {
      top: "",
      right: "",
      bottom: "",
      left: ""
    },
    margin: {
      top: "",
      right: "",
      bottom: "",
      left: ""
    },
    border: {
      width: "",
      style: "",
      color: ""
    }
  }
};

export default lightTheme;