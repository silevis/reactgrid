var rangeSlicer = function (direction) { return function (range) { return function (rangeToSlice) { return function () { return range.slice(rangeToSlice, direction); }; }; }; };
export var columnsSlicer = rangeSlicer('columns');
export var rowsSlicer = rangeSlicer('rows');
