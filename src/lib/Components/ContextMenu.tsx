import * as React from "react";
import { State } from "../Model/State";
import {
  MenuOption,
  isBrowserFirefox,
  i18n,
  isIOS,
  isIpadOS,
  getCompatibleCellAndTemplate,
  isMacOs,
  Compatible,
  Cell,
} from "../../core";
import { copySelectedRangeToClipboard } from "../Functions/copySelectedRangeToClipboard";
import { pasteData } from "../Functions/pasteData";
import { getActiveSelectedRange } from "../Functions/getActiveSelectedRange";
import { getSelectedLocations } from "../Functions/getSelectedLocations";
import { useReactGridState } from "./StateProvider";
import getRowsFromClipboard from "../Functions/getRowsFromClipboard";

export const ContextMenu: React.FC = () => {
  const contextMenuElRef = React.useRef<HTMLDivElement>(null);
  const state = useReactGridState();
  const { contextMenuPosition, selectedIds, selectionMode } = state;

  const clickPositionX = contextMenuPosition.left;
  const clickPositionY = contextMenuPosition.top;

  if (clickPositionY !== -1 && clickPositionX !== -1 && contextMenuElRef.current) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const menuWidth = contextMenuElRef.current.offsetWidth;
    const menuHeight = contextMenuElRef.current.offsetHeight;
    const SAFETY_OFFSET = 20;

    // Check to see if it's near the bottom
    if (screenHeight - clickPositionY < menuHeight) {
      contextMenuPosition.top = screenHeight - menuHeight - SAFETY_OFFSET;
    } else {
      contextMenuPosition.top = clickPositionY;
    }

    // Check to see if it's close to the right
    if (screenWidth - clickPositionX < menuWidth) {
      contextMenuPosition.left = screenWidth - menuWidth - SAFETY_OFFSET;
    } else {
      contextMenuPosition.left = clickPositionX;
    }
  }

  let contextMenuOptions = customContextMenuOptions(state);

  const onContextMenu = (menuOptions: MenuOption[]) =>
    state.props?.onContextMenu?.(
      state.selectionMode === "row" ? state.selectedIds : [],
      state.selectionMode === "column" ? state.selectedIds : [],
      state.selectionMode,
      menuOptions,
      getSelectedLocations(state)
    ) ?? [];

  const options = onContextMenu(contextMenuOptions);

  if (options.length >= 0) contextMenuOptions = options;

  return (
    <div
      ref={contextMenuElRef}
      className="rg-context-menu"
      style={{
        // Visually disappear but keep the element to retrieve the width and height
        visibility: clickPositionY === -1 && clickPositionX === -1 ? "hidden" : "visible",
        top: contextMenuPosition.top + "px",
        left: contextMenuPosition.left + "px",
      }}
    >
      {contextMenuOptions.map(({ handler, id, label }, idx) => (
        <div
          key={idx}
          className="rg-context-menu-option"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            handler(
              selectionMode === "row" ? selectedIds : [],
              selectionMode === "column" ? selectedIds : [],
              selectionMode,
              getSelectedLocations(state)
            );
            state.update((state) => ({
              ...state,
              contextMenuPosition: { top: -1, left: -1 },
              ...((id === "copy" || id === "cut") && {
                copyRange: getActiveSelectedRange(state as State),
              }),
            }));
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

function customContextMenuOptions(state: State): MenuOption[] {
  const { copyLabel, cutLabel, pasteLabel } = i18n(state);
  return [
    {
      id: "copy",
      label: copyLabel,
      handler: () => handleContextMenuCopy(state, false),
    },
    {
      id: "cut",
      label: cutLabel,
      handler: () => handleContextMenuCopy(state, true),
    },
    {
      id: "paste",
      label: pasteLabel,
      handler: () => handleContextMenuPaste(state),
    },
  ];
}

function handleContextMenuCopy(state: State, removeValues = false): void {
  copySelectedRangeToClipboard(state, removeValues);
}

function handleContextMenuPaste(state: State) {
  const isAppleMobileDevice = isIOS() || isIpadOS();
  if (isBrowserFirefox() || isAppleMobileDevice) {
    const { appleMobileDeviceContextMenuPasteAlert, otherBrowsersContextMenuPasteAlert, actionNotSupported } =
      i18n(state);
    alert(
      `${actionNotSupported} ${
        isAppleMobileDevice ? appleMobileDeviceContextMenuPasteAlert : otherBrowsersContextMenuPasteAlert
      }`
    );
  } else {
    // ? This works only in Chrome, and other browsers that fully support Clipboard API
    getRowsFromClipboard().then((rows) => {
      state.update((state) => pasteData(state as State, rows));
    });
  }
}