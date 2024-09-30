import merge from "lodash.merge";
import theme from "../assets/theme";
import { ReactGridStore } from "../types/ReactGridStore";
import cloneDeep from "lodash.clonedeep";

export const getTheme = (store: ReactGridStore) => {
  const clonedTheme = cloneDeep(theme);

  return merge(clonedTheme, store.styles);
};
