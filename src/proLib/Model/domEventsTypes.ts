import * as React from 'react';

export type ClipboardEvent = React.ClipboardEvent<HTMLDivElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLDivElement>;
export type PointerEvent = React.PointerEvent<HTMLDivElement> | globalThis.PointerEvent;
// export type FocusEvent = React.FocusEvent<HTMLDivElement>;
