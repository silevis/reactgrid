/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";
import { useRef } from "react";

/**
 * @param factory Factory function to create the cell matrix
 * @param dependencies  Dependencies to compare
 * @returns  Memoized value
 */
export function useDeepCompareMemo<T>(factory: () => T, dependencies: any[]): T {
  const currentDependenciesRef = useRef<any[]>();
  const memoizedValueRef = useRef<T>();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = cloneDeep(dependencies);
    memoizedValueRef.current = factory();
  }

  return memoizedValueRef.current as T;
}
