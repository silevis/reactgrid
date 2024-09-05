export type ColumnMeasurement = {
  /**
   * Total element width returned by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect getBoundingClientRect [MDN]}.
   */
  width: number;

  /** 
   * Column offset from the left of the container.
   * Calculated by summing up widths (and gap widths) of all columns left of this one.
   */
  offsetLeft: number;
}