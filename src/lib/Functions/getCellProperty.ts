import { Cell, Uncertain } from '..';

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