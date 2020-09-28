import React from 'react';
import { ReactGridProps } from './../reactgrid';
import { Config } from './testEnvConfig';
import '../styles.scss';
interface TestGridProps {
    containerHeight?: number;
    containerWidth?: number;
    containerMargin?: number;
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    config: Config;
    component: React.ComponentClass<ReactGridProps>;
}
export declare const TestGrid: React.FC<TestGridProps>;
export declare const withDiv: <T extends object>(Component: React.ComponentType<T>) => React.FC<T & TestGridProps>;
export declare const ExtTestGrid: React.FC<TestGridProps>;
export {};
