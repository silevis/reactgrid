import { ColumnReorderBehavior } from "../behaviors/ColumnReorderBehavior";
import { RowReorderBehavior } from "../behaviors/RowReorderBehavior";

export const isReorderBehavior = (behaviorId: string) => {
  return behaviorId === RowReorderBehavior.id || behaviorId === ColumnReorderBehavior.id;
};
