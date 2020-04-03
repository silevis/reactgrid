import { Cell, Uncertain } from '..';
export declare const getCellProperty: <TCell extends Cell, TKey extends keyof TCell>(uncertainCell: Uncertain<TCell>, propName: TKey, expectedType: string) => NonNullable<Uncertain<TCell>[TKey]>;
