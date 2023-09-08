export interface RGTheme {
  colors: {
    primary: string;
    secondary: string;

    background: string;

    shadow: string;
  },
  shadows: {
    sm: string;
    md: string;
    lg: string;
  },
  font: {
    family: string;
    size: string;
    weight: string;
  },
  grid: {
    gap: string;

    templates: {
      columns: ({ amount, widths, ...other }: { amount?: number, widths?: number[], other?: unknown }) => string;
      rows: ({ amount, widths, ...other }: { amount?: number, widths?: number[], other?: unknown }) => string;
    }

    padding: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    margin: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    border: {
      width: string;
      style: string;
      color: string;
    };

  }
  cells: {
    padding: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    margin: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    border: {
      width: string;
      style: string;
      color: string;
    };
  }
}

// Makes all properties in T optional, including nested properties
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// This tells Emotion's ThemeProvider that the theme object is of type RGTheme
declare module '@emotion/react' {
  export interface Theme extends DeepPartial<RGTheme> {}
}
