import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior";
import { ReactGridStore } from "./reactGridStore";

export const updateStoreWithApiAndEventHandler = <TEvent extends React.SyntheticEvent<HTMLDivElement>>(
  storeApi: StoreApi<ReactGridStore>,
  event: TEvent,
  handler?: HandlerFn<TEvent>,
) => {
  const store = storeApi.getState();
  
  if (handler) {
    const newStore = handler(event, store);
    storeApi.setState(newStore);
  }
}