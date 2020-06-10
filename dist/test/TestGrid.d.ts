import React from 'react';
import { Config } from './../test/testEnvConfig';
import './../lib/assets/core.scss';
interface TestGridProps {
    containerHeight?: number;
    containerWidth?: number;
    containerMargin?: number;
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    disableFloatingCellEditor?: boolean;
    isPro?: boolean;
    config: Config;
    component: React.ComponentClass<any>;
}
export declare const TestGrid: React.FunctionComponent<TestGridProps>;
export declare const withDiv: <T extends object>(Component: React.ComponentType<T>) => React.FC<T & TestGridProps>;
export declare const ExtTestGrid: React.FC<TestGridProps>;
export {};
