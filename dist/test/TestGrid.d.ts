import React from 'react';
import { ReactGridProps, TextCell, HeaderCell, ChevronCell } from './../reactgrid';
import { TestConfig } from './testEnvConfig';
import '../styles.scss';
interface TestGridProps {
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    enableFrozenFocus?: boolean;
    firstRowType?: TextCell['type'] | HeaderCell['type'];
    firstColType?: ChevronCell['type'] | HeaderCell['type'];
    config: TestConfig;
    component: React.ComponentClass<ReactGridProps>;
}
export declare const TestGrid: React.FC<TestGridProps>;
export declare const TestGridOptionsSelect: React.FC<{
    isPro?: boolean;
}>;
export declare const withDiv: <T extends object>(Component: React.ComponentType<T>) => React.FC<T & TestGridProps>;
export declare const ExtTestGrid: React.FC<TestGridProps>;
export {};
