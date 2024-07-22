import { useTheme as useEmotionContextTheme } from "@emotion/react";
import theme from "../assets/theme";
import merge from "lodash.merge";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "../components/ReactGridIdProvider";
import { RGTheme } from "../types/RGTheme";

export const useTheme = (): RGTheme => {
  const id = useReactGridId();
  const userStyles = useReactGridStore(id, (store) => store.styles);

  return merge(theme, useEmotionContextTheme(), userStyles);
};
