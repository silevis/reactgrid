import { create, useStore } from 'zustand';
import { ReactGridProps } from '../types/PublicModel';

interface ReactGridStore {
  props: ReactGridProps;

  setProps: (props: ReactGridProps) => void;
}

type ReactGridStores = Record<string, ReactGridStore>;

const reactGridStores = create<ReactGridStores>((set) => ({}));

export function useReactGridStore<T>(id: string, selector: (state: ReactGridStore) => T): T {
  return useStore(reactGridStores, (state) => selector(state[id]))
}
