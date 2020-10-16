import { TextLabels } from '../Model/PublicModel'
import { State } from '../Model/State'

const defultTranslations: Required<TextLabels> = {
    legacyBrowserHeader: 'Please update to a modern browser.',
    legacyBrowserText: 'Your current browser cannot run our content, please make sure you browser is fully updated or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, Firefox, Safari, and Opera browser',
    copyLabel: 'Copy',
    cutLabel: 'Cut',
    pasteLabel: 'Paste',
    appleMobileDeviceContextMenuPasteAlert: 'Use ⌘ + c for copy, ⌘ + x for cut and ⌘ + v for paste.',
    otherBrowsersContextMenuPasteAlert: ' Use ctrl + c for copy, ctrl + x for cut and ctrl + v for paste.',
    actionNotSupported: 'This action is not supported in this browser.'
}

export function i18n(state: State): Required<TextLabels> {
    return {
        ...defultTranslations,
        ...state.props?.labels
    }
}