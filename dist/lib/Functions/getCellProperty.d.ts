import { Cell, Uncertain } from '..';
export declare const getCellProperty: <TCell extends Cell, TKey extends keyof TCell>(uncertainCell: Uncertain<TCell>, propName: TKey, expectedType: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | string) => NonNullable<Uncertain<TCell>[TKey]>;
