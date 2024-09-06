import { GridLookup, GridLookupCallbacks } from "../../lib/types/InternalModel";
import { NumericalRange } from "../../lib/types/PublicModel";
import { findGridLookupCallbacks } from "../../lib/utils/findGridLookupCallbacks";
import { generateClipboardHtml } from "../../lib/utils/generateClipboardHtml";

export const handleCut = (event, cellsRange: NumericalRange, gridLookup: GridLookup) => {
  const gridLookupCallbacks: GridLookupCallbacks[] = findGridLookupCallbacks(cellsRange, gridLookup);

  const values = gridLookupCallbacks.map((element) => element.onStringValueRequsted());

  gridLookupCallbacks.forEach((element) => element.onStringValueReceived(""));

  const htmlData = generateClipboardHtml(cellsRange, gridLookup);

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));
};
