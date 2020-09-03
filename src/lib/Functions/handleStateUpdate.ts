import { State, ReactGridProps } from '../Model';


export function handleStateUpdate<TState extends State = State>(newState: TState, state: TState, props: ReactGridProps, setState: (state: TState) => void) {
    const changes = [...newState.queuedCellChanges];
    if (changes.length > 0) {
        if (props.onCellsChanged) {
            props.onCellsChanged([...changes]);
        };
        changes.forEach(() => newState.queuedCellChanges.pop());
    }
    if (newState !== state) {
        setState(newState);
    }
}