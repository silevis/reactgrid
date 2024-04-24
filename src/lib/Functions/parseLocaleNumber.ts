import { getNavigatorLanguage } from "./getNavigatorLanguage";

// ! Won't work with locales using characters different than Arabic numerals (e.g. *Eastern* Arabic numerals: ١٢٣٬٤٥٦٫٧٨٩)
// TODO: If possible add support for locales using characters different than Arabic numerals
function getLocaleSeparators(locale: string) {
  const testNumber = 123456.789;
  const localeFormattedNumber = Intl.NumberFormat(locale).format(testNumber);

  // Get the thousands separator of the locale
  const thousandsSeparator = localeFormattedNumber.split("123")[1][0];

  // Get the decimal separator of the locale
  const decimalSeparator = localeFormattedNumber.split("123")[1][4];
  return { thousandsSeparator, decimalSeparator };
}

export function parseLocaleNumber(stringNumber: string, locale = getNavigatorLanguage()): number {
  if (!stringNumber.trim()) return NaN;
  const { thousandsSeparator, decimalSeparator } = getLocaleSeparators(locale);
  const normalizedStringNumber = stringNumber.replace(/\u00A0/g, " "); // Replace non-breaking space with normal space
  const numberString = normalizedStringNumber
    .replace(new RegExp(`[${thousandsSeparator}\\s]`, "g"), "") // Replace thousands separator and white-space
    .replace(new RegExp(`\\${decimalSeparator}`, "g"), "."); // Replace decimal separator

  const trimmedNumberString = numberString.replace(/^(?!-)\D+|\D+$/g, ""); // Remove characters before first and after last number, but keep negative sign
  if (trimmedNumberString === null || trimmedNumberString.trim().length === 0) {
    return NaN;
  }
  return Number(trimmedNumberString);
}
