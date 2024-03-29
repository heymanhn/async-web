import { letterSpacing, lineHeight } from './dynamicMetrics';

// Media query helper methods. Add this method into the theme object for easy reuse.
export const breakpoints = [
  ['mobileOnly', 599],
  ['tabletUp', 600],
  ['laptopUp', 900],
  ['desktopUp', 1200],
];

const mq = n => {
  const [result] = breakpoints.reduce((acc, [name, size]) => {
    const mediaProp = name === 'mobileOnly' ? 'max-width' : 'min-width';
    if (n === name) return [...acc, `@media (${mediaProp}: ${size}px)`];
    return acc;
  }, []);

  return result;
};

// convenient way to generate all the required properties for
// a given font size
const fontProps = ({ size, weight, type }) => {
  const props = {
    fontSize: `${size}px`,
    letterSpacing: `${letterSpacing(size)}em`,
    lineHeight: `${lineHeight(size, type)}px`,
  };

  if (weight) props.fontWeight = weight;

  return props;
};

export const theme = {
  mq,
  letterSpacing,
  lineHeight,
  fontProps,

  fontStack: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Helvetica Neue',
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
  documentViewport: '740px',
  discussionViewport: '740px',
  workspaceViewport: '740px',
  modalViewport: '800px',
  inboxViewport: '600px',
  wideViewport: '1220px',
  sidebarWidth: '240px',

  colors: {
    blue: '#19a5e4',
    white: '#fff',
    yellow: '#df9401',

    grey0: '#3a4b56',
    grey1: '#54636d',
    grey2: '#70828e',
    grey3: '#8798a4',
    grey4: '#a7b6c0',
    grey5: '#c3d5e0',
    grey6: '#d1dae3',
    grey7: '#f0f3f6',

    mainText: '#313f48',
    contentText: '#232d34',

    altBlue: '#0a90dc',
    bgBlue: '#eff9fd',
    darkBlue: '#2d4d62',
    darkHoverBlue: '#1f3a4d',
    hoverBlue: '#eaf9ff',
    secondaryBlue: '#86d9ff',
    selectedValueBlue: '#beeafe',
    lightestBlue: '#f3f9ff',
    unreadBlue: '#f4fcff',

    highlightYellow: '#fff495',

    buttonGrey: '#f1f1f1',
    bgGrey: '#fafbfc',
    borderGrey: '#e4e9ec',
    codeBlockBorderGrey: '#dce1e4',
    formGrey: '#f8f9fa',
    formBorderGrey: '#c3cdd4',
    formPlaceholderGrey: '#c3c3c3',
    headerBarGrey: '#fcfdfe',
    lightestGrey: '#fafdff',

    successGreen: '#4CA423',

    titlePlaceholder: '#dbdddf',
    textPlaceholder: '#c9cfd4',

    codeBlockRed: '#ec1e4a',
    errorRed: '#ca0b0b',
  },
};
