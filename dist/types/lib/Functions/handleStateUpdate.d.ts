import { ReactGridProps } from '../Model/PublicModel';
import { State } from '../Model/State';
export declare function handleStateUpdate<TState extends State = State>(newState: TState, state: TState, props: ReactGridProps, setState: (state: TState) => void): void;
