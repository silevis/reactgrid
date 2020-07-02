import * as React from 'react';
import { Pane, PaneContent } from './Pane';
import { State } from '../Model';
import { isBrowserFirefox } from '../Functions';
import { CellRendererProps, } from './CellRenderer';
import {
    shouldRenderTopSticky, shouldRenderMiddleRange, shouldRenderLeftSticky, shouldRenderCenterRange
} from '../Functions/paneRendererPredicates';


export interface PanesProps<TState extends State = State> {
    state: TState;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}

export const PanesRenderer: React.FunctionComponent<PanesProps> = props => {
    const { state, cellRenderer } = props;
    const cellMatrix = state.cellMatrix;
    const renderTopSticky = shouldRenderTopSticky(state),
        renderMiddleRange = shouldRenderMiddleRange(state),
        renderLeftSticky = shouldRenderLeftSticky(state),
        renderCenterRange = shouldRenderCenterRange(state);

    if (!renderTopSticky && !renderMiddleRange && !renderLeftSticky && !renderCenterRange) {
        return null;
    }

    const visibleScrollableRange = renderMiddleRange && cellMatrix.scrollableRange.slice(state.visibleRange!, 'rows');

    return (
        <>
            <Pane
                renderChildren={renderMiddleRange && renderCenterRange}
                className={'rg-pane-center-middle'}
                style={{
                    position: 'relative',
                    width: cellMatrix.scrollableRange.width,
                    height: (cellMatrix.ranges.stickyTopRange.rows.length === cellMatrix.rows.length ||
                        cellMatrix.ranges.stickyLeftRange.columns.length === cellMatrix.columns.length)
                        ? 0
                        : cellMatrix.scrollableRange.height,
                    order: 3,
                }}
            >
                <PaneContent
                    state={state}
                    range={visibleScrollableRange}
                    rangeToSlice={state.visibleRange!}
                    direction={'columns'}
                    borders={{ right: false, bottom: false }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <Pane
                renderChildren={renderMiddleRange && renderLeftSticky}
                className={'rg-pane-left'}
                style={{
                    height: cellMatrix.scrollableRange.height,
                    width: (cellMatrix.ranges.stickyLeftRange.columns.length === cellMatrix.columns.length)
                        ? cellMatrix.ranges.stickyLeftRange.width
                        : cellMatrix.width - cellMatrix.scrollableRange.width,
                    order: 2,
                    ...(isBrowserFirefox() && { zIndex: 1 })
                }}
            >
                <PaneContent
                    state={state}
                    range={cellMatrix.ranges.stickyLeftRange}
                    rangeToSlice={visibleScrollableRange}
                    direction={'rows'}
                    borders={{ bottom: true, right: true }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <Pane
                renderChildren={renderTopSticky && renderCenterRange}
                className={'rg-pane-top'}
                style={{
                    width: cellMatrix.scrollableRange.width,
                    height: cellMatrix.ranges.stickyTopRange.height,
                    order: 1,
                    ...(isBrowserFirefox() && { zIndex: 1 })
                }}
            >
                <PaneContent
                    state={state}
                    range={cellMatrix.ranges.stickyTopRange}
                    rangeToSlice={state.visibleRange!}
                    direction={'columns'}
                    borders={{ right: false, bottom: false }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <Pane
                renderChildren={renderTopSticky && renderLeftSticky}
                className={'rg-pane-top rg-pane-left'}
                style={{
                    height: cellMatrix.ranges.stickyTopRange.height,
                    width: cellMatrix.width - cellMatrix.scrollableRange.width,
                    order: 0,
                    ...(isBrowserFirefox() && { zIndex: 2 })
                }}
            >
                <PaneContent
                    state={state}
                    range={cellMatrix.ranges.stickyLeftRange}
                    rangeToSlice={cellMatrix.ranges.stickyTopRange}
                    direction={'rows'}
                    borders={{ bottom: true, right: true }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
        </>
    )
}

