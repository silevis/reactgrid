/**
 * Stores each cell's measurements [(content)width/height, top and left offset].
 * Structure/indexing is a little confusing at first, but it's done that way so that
 * we can, for example, quickly and easily look up highest width or height in a column or row.
 */

export type CellsMeasurements = {
  /**
   * Indexing!: measurements.byRowId[rowId].property[colId]
   */
  byRowId: {
    /**
     * The content area height (the same you would set with CSS `height` property).
     *
     * See more: {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model#content_area Content Area [MDN]}
     */
    contentHeights: number[];

    /**
     * Total element height returned by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect getBoundingClientRect [MDN]}.
     */
    heights: number[];

    /**
     * Distance from the top of the container
     *
     * See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop offsetTop [MDN]}
     */
    offsetsTop: number[];
  }[];

  /**
   * Indexing!: measurements.byColId[colId].property[rowId]
   */
  byColId: {
    /**
     * The content area width (the same you would set with CSS `width` property).
     *
     * See more: {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model#content_area Content Area [MDN]}
     */
    contentWidths: number[];

    /**
     * Total element width returned by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect getBoundingClientRect [MDN]}.
     */
    widths: number[];

    /**
     * Distance from the left of the container
     *
     * See more: {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft offsetLeft [MDN]}
     */
    offsetsLeft: number[];
  }[];
};
