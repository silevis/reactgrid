import merge from "lodash.merge";
import theme from "../assets/theme";
import { ReactGridStore } from "../types/ReactGridStore";
import cloneDeep from "lodash.clonedeep";
import { RGTheme } from "../types/RGTheme";

export const getTheme = (store: ReactGridStore): RGTheme => {
  const clonedTheme = cloneDeep(theme);

  return merge(clonedTheme, store.styles);
};
