import { KeyboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { handleCompositionEndOnCellTemplate } from "./handleCompositionEndOnCellTemplate";


export function handleCompositionEnd(event: CompositionEvent, state: State): State {
  const newState = handleCompositionEndOnCellTemplate(state, event);
  if (newState !== state) {
    event.stopPropagation();
    event.preventDefault();
  }
  return newState;
}