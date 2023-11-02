import { Cell, Uncertain } from '../Model/PublicModel';
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
export declare const getCellProperty: <TCell extends Cell, TKey extends keyof TCell>(uncertainCell: Uncertain<TCell>, propName: TKey, expectedType: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | 'symbol' | 'bigint') => any;
