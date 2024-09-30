import { useTheme as useEmotionContextTheme } from "@emotion/react";
import theme from "../assets/theme";
import merge from "lodash.merge";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "../components/ReactGridIdProvider";
import { RGTheme } from "../types/RGTheme";
import cloneDeep from "lodash.clonedeep";

export const useTheme = (): RGTheme => {
  const id = useReactGridId();
  const userStyles = useReactGridStore(id, (store) => store.styles);

  const clonedTheme = cloneDeep(theme);

  return merge(clonedTheme, useEmotionContextTheme(), userStyles);
};
