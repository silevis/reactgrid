import { isBrowserIE, isBrowserEdge } from '../Functions';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
export var defaultStateFields = {
    legacyBrowserMode: isBrowserIE() || isBrowserEdge(),
    focusedLocation: undefined,
    currentBehavior: new DefaultBehavior(),
    cellTemplates: undefined,
    hiddenFocusElement: undefined,
    reactGridElement: undefined,
    scrollableElement: undefined,
    queuedCellChanges: [],
    currentlyEditedCell: undefined,
    disableFloatingCellEditor: false,
    highlightLocations: [],
    visibleRange: undefined,
    topScrollBoudary: -1,
    bottomScrollBoudary: -1,
    leftScrollBoudary: -1,
    rightScrollBoudary: -1,
};
