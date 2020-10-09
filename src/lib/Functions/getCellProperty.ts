import { Cell, Uncertain } from '..';


/**
 * Gets property value from `uncertainCell`
 * 
 * @param uncertainCell Incoming cell to extract its property
 * @param propName Extracted property name
 * @param expectedType Expected type of incoming cells property value 
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
export const getCellProperty = <TCell extends Cell, TKey extends keyof TCell>(
    uncertainCell: Uncertain<TCell>,
    propName: TKey,
    expectedType: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | string
) => {
    const prop = uncertainCell[propName];
    if (typeof prop === 'undefined' || prop === null)
        throw new Error(`Cell is missing property '${propName}'`);

    if (typeof prop !== expectedType)
        throw new Error(`Property '${propName}' expected to be of type '${expectedType}' but is '${typeof prop}'`);

    return prop!;
}