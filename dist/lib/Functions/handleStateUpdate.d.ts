import { State, ReactGridProps } from '../Model';
export declare function handleStateUpdate<TState extends State = State>(newState: TState, state: TState, props: ReactGridProps, setState: (state: TState) => void): void;
