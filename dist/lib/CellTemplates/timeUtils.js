import { isIOS, isIpadOS } from '../Functions/operatingSystem';
export var getTimestamp = function (time, defaultDate) {
    if (defaultDate !== '') {
        defaultDate = getDefaultDate();
    }
    var textDate = "" + (defaultDate && defaultDate + " ") + time;
    return Date.parse(textDate);
};
export var getFormattedTimeUnit = function (timeUnit) { return timeUnit.toString().padStart(2, '0'); };
export var getDefaultDate = function () { return isIOS() || isIpadOS() ? '1970/01/01' : '1970-01-01'; };
