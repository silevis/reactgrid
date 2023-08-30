import React from "react";
import { ReactGridProps, TextCell, HeaderCell, ChevronCell } from './../reactgrid';
import { TestConfig } from './testEnvConfig';
import '../styles.scss';
interface TestGridProps {
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    enableFrozenFocus?: boolean;
    firstRowType?: TextCell["type"] | HeaderCell["type"];
    firstColType?: ChevronCell["type"] | HeaderCell["type"];
    cellType?: TextCell["type"] | HeaderCell["type"];
    config: TestConfig;
    component: React.ComponentClass<ReactGridProps>;
}
export declare const TestGrid: React.FC<TestGridProps>;
export declare const TestGridOptionsSelect: React.FC;
export declare const withDiv: <T extends Record<string, unknown> & TestGridProps>(Component: React.ComponentType<T>) => React.FC<T>;
export declare const ExtTestGrid: React.FC<Record<string, unknown> & TestGridProps>;
export {};
