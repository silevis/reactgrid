import { useTheme as useEmotionContextTheme } from '@emotion/react';
import theme from '../assets/theme';
import { RGTheme } from '../types/Theme';
import merge from 'lodash.merge';

export const useTheme = (): RGTheme => {
  return merge(theme, useEmotionContextTheme());
}
