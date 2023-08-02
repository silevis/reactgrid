import { Direction, PointerLocation } from './InternalModel';
import { KeyboardEvent, ClipboardEvent, PointerEvent } from './domEventsTypes';
import { State } from './State';
import { Range } from './Range';


// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export abstract class Behavior<PointerUpEvent = PointerEvent | MouseEvent> {

    handleKeyDown(event: KeyboardEvent, state: State): State {
        return state;
    }
    handlePointerUp(event: PointerUpEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handleKeyUp(event: KeyboardEvent, state: State): State {
        return state;
    }
    handleCompositionEnd(event: CompositionEvent, state: State): State {
        return state;
    }
    handleCopy(event: ClipboardEvent, state: State): State {
        return state;
    }
    handlePaste(event: ClipboardEvent, state: State): State {
        return state;
    }
    handleCut(event: ClipboardEvent, state: State): State {
        return state;
    }
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }
    handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State {
        return state;
    }

    handlePointerMove(
        event: PointerEvent,
        location: PointerLocation,
        state: State
      ): State {
        return state;
      }
    
      handlePointerEnter(
        event: PointerEvent,
        location: PointerLocation,
        state: State
      ): State {
        return state;
      }
    
      handleContextMenu(
        event: PointerEvent | MouseEvent,
        state: State
      ): State {
        return state;
      }
    
      renderPanePart(state: State, pane: Range): React.ReactNode {
        return undefined;
      }
    
      autoScrollDirection: Direction = "both";
} 
