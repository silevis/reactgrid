import { areLocationsEqual } from '../Functions/areLocationsEqual';
var AbstractPointerEventsController = /** @class */ (function () {
    function AbstractPointerEventsController(updateState) {
        this.updateState = updateState;
        this.eventTimestamps = [0, 0];
        this.eventLocations = [undefined, undefined];
        this.currentIndex = 0;
    }
    AbstractPointerEventsController.prototype.handlePointerDownInternal = function (event, currentLocation, state) {
        this.pointerDownLocation = currentLocation;
        var previousLocation = this.eventLocations[this.currentIndex];
        this.currentIndex = 1 - this.currentIndex;
        this.eventTimestamps[this.currentIndex] = new Date().valueOf();
        this.eventLocations[this.currentIndex] = currentLocation;
        var isFirstRowOrColumn = currentLocation.row.idx === 0 || currentLocation.column.idx === 0;
        if (event.pointerType === 'mouse' || isFirstRowOrColumn || areLocationsEqual(currentLocation, previousLocation)) {
            state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
        }
        return state;
    };
    AbstractPointerEventsController.prototype.shouldHandleDoubleClick = function (currentLocation, currentTimestamp, secondLastTimestamp) {
        return currentTimestamp - secondLastTimestamp < 500
            && areLocationsEqual(currentLocation, this.eventLocations[0])
            && areLocationsEqual(currentLocation, this.eventLocations[1]);
    };
    AbstractPointerEventsController.prototype.shouldHandleCellSelectionOnMobile = function (event, currentLocation, currentTimestamp) {
        // prevent from cell selection on first click on mobile devices
        return event.pointerType !== 'mouse' &&
            areLocationsEqual(currentLocation, this.pointerDownLocation) &&
            event.pointerType !== undefined && // !== undefined only for cypress tests
            currentTimestamp - this.eventTimestamps[this.currentIndex] < 500 &&
            (currentLocation.row.idx > 0 && currentLocation.column.idx > 0);
    };
    return AbstractPointerEventsController;
}());
export { AbstractPointerEventsController };
// TODO think about create as saparate function
export function isReadyToHandleEvent(event) {
    if ((event.button !== 0 && event.button !== undefined) ||
        (event.target.className === 'reactgrid-content' && event.pointerType !== undefined)) {
        return false;
    }
    return true;
}
// TODO think about create as saparate function
export function isOnClickableArea(event, state) {
    var left = state.reactGridElement.getBoundingClientRect().left;
    var viewportX = event.clientX - left;
    if (viewportX > state.cellMatrix.width) {
        return false;
    }
    return true;
}
