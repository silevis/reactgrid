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
    gap: {
      width: "1px",
      color: "#000"
    }
  },
  // cells: {
  //   padding: {
  //     top: "2px",
  //     right: "2px",
  //     bottom: "2px",
  //     left: "2px"
  //   },
  //   margin: {
  //     top: "0",
  //     right: "0",
  //     bottom: "0",
  //     left: "0"
  //   },
  //   border: {
  //     width: "1px",
  //     style: "solid",
  //     color: "#000"
  //   }
  // }
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