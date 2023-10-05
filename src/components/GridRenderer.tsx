import React, { FC } from 'react'
import { useReactGridId } from './ReactGridIdProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { useReactGridStore } from '../utils/reactGridStore';
import { getScrollableParent } from '../utils/scrollHelpers';
import { recalcVisibleRange } from '../utils/recalcVisibleRange';

const GridRenderer: FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = useReactGridId();
  const { rows, columns } = useReactGridStore(id, store => store.measurements);
  const { totalWidth, totalHeight } = useReactGridStore(id, store => store.measurements);
  const assignRefs = useReactGridStore(id, store => store.assignRefs);
  const setVisibleRange = useReactGridStore(id, store => store.setVisibleRange);

  return (
    <ErrorBoundary>
      <div
        className={`ReactGrid-${id}`}
        style={{
          width: totalWidth || 'auto',
          height: totalHeight || 'auto',
        }}
        ref={
          el => {
            if (el) {
              const scrollableElement = getScrollableParent(el, true);
              assignRefs(el, scrollableElement);

              scrollableElement?.addEventListener('scroll', () => {
                console.log("scroll")
                // setVisibleRange(recalcVisibleRange(
                //   rows,
                //   columns,
                //   scrollableElement.scrollTop,
                //   scrollableElement.scrollLeft,
                //   scrollableElement.clientHeight,
                //   scrollableElement.clientWidth
                // ));
              });
            }
          }
        }
      >
        {children}
      </div>
    </ErrorBoundary>
  )
}

export default GridRenderer;