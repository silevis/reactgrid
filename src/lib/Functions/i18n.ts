import { State, TranslationsDictionary } from "../Model";

const defultTranslations: TranslationsDictionary = {
    legacyBrowserHeader: 'Please update to a modern browser.',
    legacyBrowserParagraph: 'Your current browser cannot run our content, please make sure you browser is fully updated or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, Firefox, Safari, and Opera browser',
    notification: 'Sorry, is not implemented in MIT version, buy ReactGrid Pro'
}

export function i18n(state: State): TranslationsDictionary {

    const customTranslationsLang = state.props?.translations!;
    const lang = state.props?.lang!;

    const translations: TranslationsDictionary = {
        ...defultTranslations,
        ...customTranslationsLang[lang]
    }
    return translations;
}

