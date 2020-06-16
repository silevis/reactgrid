import { State, TranslationsDictionary } from "../Model";

const defultTranslations: TranslationsDictionary = {
    legacyBrowserHeader: 'Please update to a modern browser.',
    legacyBrowserParagraph: 'Your current browser cannot run our content, please make sure you browser is fully updated or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, Firefox, Safari, and Opera browser',
    copyLabel: 'Copy',
    cutLabel: 'Cut',
    pasteLabel: 'Paste',
    macOsAlertText: '⌘ + c for copy, ⌘ + x for cut and ⌘ + v for paste.',
    otherBrowsersText: 'ctrl + c for copy, ctrl + x for cut and ctrl + v for paste.',
    alert: 'This action is not supported in this browser. Use',
}

export function i18n(state: State): TranslationsDictionary {
    const customTranslations = state.props?.translations!;
    const translationsLang = state.props?.lang!;
    const translations: TranslationsDictionary = {
        ...defultTranslations,
        ...customTranslations[translationsLang]
    }
    return translations;
}

