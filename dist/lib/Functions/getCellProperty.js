export var getCellProperty = function (uncertainCell, propName, expectedType) {
    var prop = uncertainCell[propName];
    if (typeof prop === 'undefined' || prop === null)
        throw new Error("Cell is missing property '" + propName + "'");
    if (typeof prop !== expectedType)
        throw new Error("Property '" + propName + "' expected to be of type '" + expectedType + "' but is '" + typeof prop + "'");
    return prop;
};
