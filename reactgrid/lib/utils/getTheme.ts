import merge from "lodash.merge";
import theme from "../assets/theme";
import { ReactGridStore } from "../types/ReactGridStore";

export const getTheme = (store: ReactGridStore) => {
  return merge(theme, store.styles);
};
