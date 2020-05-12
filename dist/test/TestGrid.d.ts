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
    component?: any;
}
export declare const TestGrid: React.FunctionComponent<TestGridProps>;
export {};
