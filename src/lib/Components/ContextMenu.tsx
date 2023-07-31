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

export const ContextMenu: React.FC = () => {
  const state = useReactGridState();

  if (
    state.contextMenuPosition.top === -1 &&
    state.contextMenuPosition.left === -1
  )
    return null;

  const { contextMenuPosition, selectedIds, selectionMode } = state;

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
      className="rg-context-menu"
      style={{
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
    const {
      appleMobileDeviceContextMenuPasteAlert,
      otherBrowsersContextMenuPasteAlert,
      actionNotSupported,
    } = i18n(state);
    alert(
      `${actionNotSupported} ${
        isAppleMobileDevice
          ? appleMobileDeviceContextMenuPasteAlert
          : otherBrowsersContextMenuPasteAlert
      }`
    );
  } else {
    navigator.clipboard
      ?.readText()
      .then((e) =>
        state.update((state) => {
          const proState = state as State;
          const { copyRange } = proState;
          let applyMetaData = false;
          const clipboardRows = isMacOs() ? e.split("\n") : e.split("\r\n");
          const clipboard = clipboardRows.map((line) => line.split("\t"));
          if (copyRange && copyRange.rows && copyRange.columns) {
            const isSizeEqual =
              copyRange.rows.length === clipboardRows.length &&
              copyRange.columns.length === clipboard[0].length;
            if (isSizeEqual) {
              applyMetaData = copyRange.rows.some((row, rowIdx) => {
                return copyRange.columns.some((column, colIdx) => {
                  // need to avoid difference beetwen whitespace and space char
                  return (
                    clipboard[rowIdx][colIdx].trim() ===
                    getCompatibleCellAndTemplate(proState, { row, column })
                      .cell.text.replaceAll(
                        String.fromCharCode(160),
                        String.fromCharCode(32)
                      )
                      .trim()
                  );
                });
              });
            }
          }
          return pasteData(
            proState,
            clipboardRows.map((line, rowIdx) => {
              return line.split("\t").map<Compatible<Cell>>((text, colIdx) => {
                if (!copyRange) {
                  return {
                    type: "text",
                    text,
                    value: parseFloat(text),
                  };
                }
                const { cell } = getCompatibleCellAndTemplate(proState, {
                  row: copyRange.rows[rowIdx],
                  column: copyRange.columns[colIdx],
                });
                return {
                  type: "text",
                  // probably this ternanary and spread operator is no longer needed
                  text: text,
                  value: parseFloat(text),
                  ...(applyMetaData && {
                    groupId: cell.groupId,
                  }),
                };
              });
            })
          );
        })
      )
      .catch(({ message }) => {
        console.error(
          `An error occurred while pasting data by context menu: '${message}'`
        );
      });
  }
}
