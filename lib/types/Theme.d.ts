import { RGTheme } from "./RGTheme";

// Makes all properties in T optional, including nested properties, but excluding functions
type DeepPartial<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof T]?: T[P] extends (...args: any[]) => any ? T[P] : DeepPartial<T[P]>;
};

// This tells Emotion's ThemeProvider that the theme object is of type RGTheme
declare module "@emotion/react" {
  export interface Theme extends DeepPartial<RGTheme> {}
}
