import * as React from 'react';
import { Pane, PaneContent } from './Pane';
import {
    shouldRenderCenterRange, shouldRenderLeftSticky, shouldRenderMiddleRange, shouldRenderTopSticky
} from '../Functions/paneRendererPredicates';
import { Range } from '../Model/Range';
import { isBrowserFirefox } from '../Functions/firefox';
import { columnsSlicer, rowsSlicer } from '../Functions/rangeSlicer';
import { State } from '../Model/State';
import { CellRendererProps } from './CellRenderer';
import { PaneShadow } from './PaneShadow';


export interface PanesProps<TState extends State = State> {
    state: TState;
    cellRenderer: React.FC<CellRendererProps>;
}

export const PanesRenderer: React.FC<PanesProps> = ({ state, cellRenderer }) => {
    const cellMatrix = state.cellMatrix;
    const renderTopSticky = shouldRenderTopSticky(state),
        renderMiddleRange = shouldRenderMiddleRange(state),
        renderLeftSticky = shouldRenderLeftSticky(state),
        renderCenterRange = shouldRenderCenterRange(state);

    if (!renderTopSticky && !renderMiddleRange && !renderLeftSticky && !renderCenterRange) {
        return null;
    }

    let visibleScrollableRange: Range | undefined = undefined;
    if (renderMiddleRange) {
        visibleScrollableRange = cellMatrix.scrollableRange.slice(state.visibleRange!, 'rows');
    }

    const areOnlyStickyRows = cellMatrix.ranges.stickyTopRange.rows.length === cellMatrix.rows.length;
    const areOnlyStickyCols = cellMatrix.ranges.stickyLeftRange.columns.length === cellMatrix.columns.length;

    return (
        <>
            <Pane
                renderChildren={renderMiddleRange && renderCenterRange}
                className={'rg-pane-center-middle'}
                style={{
                    position: 'relative',
                    width: state.props?.enableFullWidthHeader
                        ? `calc(100% - ${cellMatrix.ranges.stickyLeftRange.width}px)`
                        : cellMatrix.scrollableRange.width,
                    height: (areOnlyStickyRows || areOnlyStickyCols) ? 0 : cellMatrix.scrollableRange.height,
                    order: 3,
                }}
            >
                <PaneContent
                    state={state}
                    range={columnsSlicer(visibleScrollableRange as Range)(state.visibleRange!)}
                    borders={{
                        bottom: true,
                        right: true,
                        left: !renderLeftSticky,
                        top: !renderTopSticky
                    }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <PaneShadow renderCondition={renderLeftSticky} className={'shadow-left'} zIndex={1} style={{
                width: cellMatrix.ranges.stickyLeftRange.width,
                height: cellMatrix.height,
                marginTop: -cellMatrix.height,
                order: 5,
            }} />
            <PaneShadow renderCondition={renderTopSticky} className={'shadow-top'} zIndex={1} style={{
                width: cellMatrix.width,
                height: cellMatrix.ranges.stickyTopRange.height,
                marginTop: -cellMatrix.height,
                order: 4,
            }} />
            <Pane
                renderChildren={renderMiddleRange && renderLeftSticky}
                className={'rg-pane-left'}
                style={{
                    height: areOnlyStickyRows && areOnlyStickyCols ? 0 : cellMatrix.scrollableRange.height,
                    width: areOnlyStickyRows
                        ? 0
                        : areOnlyStickyCols ? cellMatrix.ranges.stickyLeftRange.width : cellMatrix.width - cellMatrix.scrollableRange.width,
                    order: 2,
                    ...(isBrowserFirefox() && { zIndex: 1 })
                }}
            >
                <PaneContent
                    state={state}
                    range={rowsSlicer(cellMatrix.ranges.stickyLeftRange)(visibleScrollableRange as Range)}
                    borders={{
                        bottom: true,
                        left: true,
                        top: !renderTopSticky
                    }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <Pane
                renderChildren={renderTopSticky && renderCenterRange}
                className={'rg-pane-top'}
                style={{
                    width: state.props?.enableFullWidthHeader
                        ? `calc(100% - ${cellMatrix.ranges.stickyLeftRange.width}px)`
                        : areOnlyStickyRows && areOnlyStickyCols ? 0 : cellMatrix.scrollableRange.width,
                    height: cellMatrix.ranges.stickyTopRange.height,
                    order: 1,
                    ...(isBrowserFirefox() && { zIndex: 1 })
                }}
            >
                <PaneContent
                    state={state}
                    range={columnsSlicer(cellMatrix.ranges.stickyTopRange)(state.visibleRange!)}
                    borders={{
                        right: true,
                        top: true,
                        bottom: true,
                        left: !renderLeftSticky
                    }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
            <Pane
                renderChildren={renderTopSticky && renderLeftSticky}
                className={'rg-pane-top rg-pane-left shadow shadow-top-left-corner'}
                style={{
                    height: cellMatrix.ranges.stickyTopRange.height,
                    width: (areOnlyStickyRows && areOnlyStickyCols)
                        ? cellMatrix.ranges.stickyLeftRange.width
                        : cellMatrix.width - cellMatrix.scrollableRange.width,
                    order: 0,
                    ...(isBrowserFirefox() && { zIndex: 2 })
                }}
            >
                <PaneContent
                    state={state}
                    range={rowsSlicer(cellMatrix.ranges.stickyLeftRange)(cellMatrix.ranges.stickyTopRange)}
                    borders={{
                        left: true,
                        top: true,
                        right: true,
                        bottom: true
                    }}
                    cellRenderer={cellRenderer}
                />
            </Pane>
        </>
    )
}
