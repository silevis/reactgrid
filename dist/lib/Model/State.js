import { isBrowserIE } from '../Functions/internetExplorer';
import { isBrowserEdge } from '../Functions/microsoftEdge';
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
    highlightLocations: [],
    visibleRange: undefined,
    topScrollBoudary: -1,
    bottomScrollBoudary: -1,
    leftScrollBoudary: -1,
    rightScrollBoudary: -1,
    enableGroupIdRender: false,
    leftStickyColumns: undefined,
    topStickyRows: undefined,
};
