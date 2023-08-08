import { Cell, Uncertain } from '../Model/PublicModel';

// TODO: simplify if possible

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
export const getCellProperty = <TCell extends Cell, TKey extends keyof TCell>(
    uncertainCell: Uncertain<TCell>,
    propName: TKey,
    expectedType: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | 'symbol' | 'bigint'
) : any => {
    const prop = uncertainCell[propName];
    if (typeof prop === 'undefined' || prop === null)
        throw new Error(`Cell is missing property '${String(propName)}'`);
    if (typeof prop !== expectedType)
        throw new Error(`Property '${String(propName)}' expected to be of type '${expectedType}' but is '${typeof prop}'`);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return prop!; // TODO is '!' necessary ?
}