import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { isBrowserIE, isBrowserEdge } from '../Functions';
var State = (function () {
    function State(update) {
        this.update = update;
        this.legacyBrowserMode = isBrowserIE() || isBrowserEdge();
        this.currentBehavior = new DefaultBehavior();
        this.queuedCellChanges = [];
        this.disableFloatingCellEditor = false;
        this.highlightLocations = [];
        this.minScrollTop = -1;
        this.maxScrollTop = -1;
        this.minScrollLeft = -1;
        this.maxScrollLeft = -1;
    }
    return State;
}());
export { State };
