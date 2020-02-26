// Based on light or dark modes
const themes = {
  light: parentTheme => {
    const { colors } = parentTheme;
    return {
      ...parentTheme,
      bgColors: {
        main: colors.grey7,
        sub: colors.borderGrey,
      },
      textColors: {
        main: colors.contentText,
        sub: colors.grey1,
        alt: colors.grey2,
      },
      accentColor: colors.blue,
    };
  },

  dark: parentTheme => {
    const { colors } = parentTheme;
    return {
      ...parentTheme,
      bgColors: {
        main: colors.grey0,
        sub: colors.contentText,
      },
      textColors: {
        main: colors.white,
        sub: colors.grey5,
        alt: colors.grey4,
      },
    };
  },
};

export default themes;
