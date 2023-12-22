export const getNavigatorLanguage = (): string => navigator.languages && navigator.languages.length
  ? navigator.languages[0]
  :
  // .userLanguage is a IE feature...
  // navigator.userLanguage || 
  navigator.language ||
  // navigator.browserLanguage ||
  "en-US";
