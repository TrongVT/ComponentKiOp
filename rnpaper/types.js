const Theme = {
  dark: false,
  roundness: 0,
  colors: {
    primary: '',
    background: '',
    surface: '',
    accent: '',
    error: '',
    text: '',
    disabled: '',
    placeholder: '',
    backdrop: '',
  },
  fonts: {
    regular: '',
    medium: '',
    light: '',
    thin: '',
  },
};

const ThemeShape = {
  ...Theme,
  colors: Theme.colors,
  fonts: Theme.fonts,
};

export { Theme, ThemeShape };
