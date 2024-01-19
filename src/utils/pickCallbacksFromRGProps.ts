import { ReactGridCallbacks, ReactGridProps } from "../types/PublicModel";

const pickCallbacksFromRGProps = (props: ReactGridProps): ReactGridCallbacks => ({
  onFocusLocationChanging: props.onFocusLocationChanging,
  onFocusLocationChanged: props.onFocusLocationChanged,
  onSelectionChanging: props.onSelectionChanging,
  onSelectionChanged: props.onSelectionChanged,
  onFillHandle: props.onFillHandle,
  onRowSelection: props.onRowSelection,
  onRowResize: props.onRowResize,
  onRowReorder: props.onRowReorder,
  onColumnSelection: props.onColumnSelection,
  onColumnResize: props.onColumnResize,
  onColumnReorder: props.onColumnReorder,
})

export default pickCallbacksFromRGProps;