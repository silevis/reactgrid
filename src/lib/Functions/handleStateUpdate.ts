import { ReactGridProps } from '../Model/PublicModel';
import { State, StateModifier } from '../Model/State';


export function handleStateUpdate<TState extends State = State>(
    mod: StateModifier,
    state: TState,
    onCellsChanged: ReactGridProps['onCellsChanged'],
    // setState: (state: TState) => void
    setState: (state: any) => void
) {
    const newState = mod(state);
    const changes = [...newState.queuedCellChanges];
    if (changes.length > 0) {
        if (onCellsChanged) {
            onCellsChanged(changes);
        };
        newState.queuedCellChanges.length = 0;
    }
    if (newState !== state) {
        setState(newState);
    }
}
