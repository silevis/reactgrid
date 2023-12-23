import { getNavigatorLanguage } from "./getNavigatorLanguage";

/**
 * Parses a locale-formatted number string into a JavaScript number.
 *
 * This function uses the Intl.NumberFormat API to handle locale-specific number formatting.
 * It replaces thousands separators and adjusts decimal separators based on the provided locale.
 *
 * @param {string} stringNumber - The locale-formatted number string to parse.
 * @param {string} [locale=getNavigatorLanguage()] - The locale to use for formatting. Defaults to the user's browser locale.
 * @returns {number} The parsed number, or NaN if parsing fails.
 *
 * @example
 * // Parse a number with the default locale
 * const result = parseLocaleNumber("1,234.56");
 * console.log(result); // Output: 1234.56
 *
 * @example
 * // Parse a number with a specific locale
 * const result = parseLocaleNumber("1.234,56", "de-DE");
 * console.log(result); // Output: 1234.56
 */


export function parseLocaleNumber(stringNumber: string, locale = getNavigatorLanguage()): number {
  try {
    // Use Intl.NumberFormat to get locale-specific separators
    const numberFormat = new Intl.NumberFormat(locale);
    const formatSample = numberFormat.formatToParts(12345.6);

    // Check if the decimal separator is a comma
    const decimalSeparatorIsComma = formatSample.some((part) => part.type === "decimal" && part.value === ",");

    // Replace thousands separator and adjust decimal separator
    const sanitizedNumberString = stringNumber
      .replace(decimalSeparatorIsComma ? /[^\d,]/g : /[^\d.]/g, "")
      .replace(decimalSeparatorIsComma ? "," : ".", ".");

    // Parse the sanitized string to a number
    const parsedNumber = Number.parseFloat(sanitizedNumberString);

    return parsedNumber;
  } catch (error) {
    console.error(`Error parsing number: ${stringNumber}`, error);
    return NaN;
  }
}

