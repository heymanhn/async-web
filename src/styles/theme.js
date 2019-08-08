// Media query helper methods. Add this method into the theme object for easy reuse.
export const breakpoints = [
  ['mobileOnly', 599],
  ['tabletUp', 600],
  ['laptopUp', 900],
  ['desktopUp', 1200],
];

const mq = (n) => {
  const [result] = breakpoints.reduce((acc, [name, size]) => {
    const mediaProp = name === 'mobileOnly' ? 'max-width' : 'min-width';
    if (n === name) return [...acc, `@media (${mediaProp}: ${size}px)`];
    return acc;
  }, []);

  return result;
};

export const theme = {
  mq,

  fontStack: [
    'Helvetica Neue',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ].join(','),

  codeFontStack: [
    'Source Code Pro',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Courier New"',
    'monospace',
  ].join(','),

  containerMargin: '50px auto',
  documentContainerMargin: '60px auto',
  shortMargin: '30px auto',
  maxViewport: '740px',
  wideViewport: '1220px',
  discussionWidth: '700px',

  // Update with new colors for Project Async once ready
  colors: {
    blue: '#19a5e4',
    white: '#fff',

    grey1: '#54636d',
    grey2: '#70828e',
    grey3: '#8798a4',
    grey4: '#a7b6c0',
    grey5: '#c3c4c5',
    grey6: '#dadcde',
    grey7: '#f0f3f6',

    mainText: '#313f48',

    bgBlue: '#eff9fd',
    hoverBlue: '#eaf9ff',
    selectedValueBlue: '#beeafe',
    lightestBlue: '#f3f9ff',

    buttonGrey: '#f1f1f1',
    bgGrey: '#fafbfc',
    borderGrey: '#e4e9ec',
    codeBlockBorderGrey: '#dce1e4',
    formGrey: '#f8f9fa',
    formBorderGrey: '#c3cdd4',
    formPlaceholderGrey: '#c3c3c3',

    titlePlaceholder: '#dbdddf',
    textPlaceholder: '#c9cfd4',

    codeBlockRed: '#ec1e4a',
    errorRed: '#ca0b0b',
  },
};
