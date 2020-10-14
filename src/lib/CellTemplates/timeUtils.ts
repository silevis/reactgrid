import { isIOS, isIpadOS } from '../Functions';

export const getTimestamp = (time: string, defaultDate?: string): number => {
    if (defaultDate !== '') {
        defaultDate = getDefaultDate();
    }
    const textDate = `${defaultDate && `${defaultDate} `}${time}`;
    return Date.parse(textDate);
};

export const getFormattedTimeUnit = (timeUnit: number): string => timeUnit.toString().padStart(2, '0');

export const getDefaultDate = () => isIOS() || isIpadOS() ? '1970/01/01' : '1970-01-01';