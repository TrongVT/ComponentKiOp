import color from 'color';
import colors from './colors';
import fonts from './fonts';

export default {
  dark: false,
  roundness: 4,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: colors.white,
    error: '#B00020',
    text: colors.black,
    disabled: color(colors.black)
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(colors.black)
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color(colors.black)
      .alpha(0.5)
      .rgb()
      .string(),
  },
  fonts,
};
