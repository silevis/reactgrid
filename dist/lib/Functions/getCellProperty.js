/**
 * Gets property cell's value
 *
 * @param uncertainCell Cell to extract its property
 * @param propName Property name to extract
 * @param expectedType Expected `typeof` of extracted property from "uncertain" cell
 * @returns Value of property of given cell
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export var getCellProperty = function (uncertainCell, propName, expectedType) {
    var prop = uncertainCell[propName];
    if (typeof prop === 'undefined' || prop === null)
        throw new Error("Cell is missing property '" + propName + "'");
    if (typeof prop !== expectedType)
        throw new Error("Property '" + propName + "' expected to be of type '" + expectedType + "' but is '" + typeof prop + "'");
    return prop; // TODO is '!' necessary ?
};
