export type RowMeasurement = {
  /**
   * Total element height returned by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect getBoundingClientRect [MDN]}.
   */
  height: number;

  /** 
   * Row offset from the top of the container.
   * Calculated by summing up heights (and gap widths) of all rows above this one.
   */
  offsetTop: number;
}