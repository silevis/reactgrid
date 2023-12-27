import { getNavigatorLanguage } from "./getNavigatorLanguage";


function getLocaleSeparators(locale: string) {
  const testNumber = 123456.789;
  const localeFormattedNumber = Intl.NumberFormat(locale).format(testNumber);

  // Get the thousands separator of the locale
  const thousandsSeparator = localeFormattedNumber.split('123')[1][0]

  // Get the decimal separator of the locale
  const decimalSeparator = localeFormattedNumber.split('123')[1][4]
  return { thousandsSeparator, decimalSeparator }
}

export function parseLocaleNumber(stringNumber: string, locale = getNavigatorLanguage()): number {
  const { thousandsSeparator, decimalSeparator } = getLocaleSeparators(locale)
  const normalizedStringNumber = stringNumber.replace(/\u00A0/g, ' ') // Replace non-breaking space with normal space
  const numberString = normalizedStringNumber
    .replace(new RegExp(`[${thousandsSeparator}\\s]`, 'g'), '') // Replace thousands separator and white-space
    .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.') // Replace decimal separator
  
  const trimmedNumberString = numberString.replace(/^[^\d]+|[^\d]+$/g, ''); // Remove characters before first and after last number
  
  return Number(trimmedNumberString) 
}
