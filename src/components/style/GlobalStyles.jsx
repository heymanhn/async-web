import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { withTheme } from 'emotion-theming';

const GlobalStyles = ({ bgColor, theme: { colors, fontStack, mq } }) => (
  <Global
    styles={{
      '*': {
        boxSizing: 'border-box',
        fontFamily: fontStack,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      'html, body': {
        background: colors[bgColor],
        color: colors.mainText,
        fontWeight: 400,
        margin: 0,
        height: '100%',
      },
      h1: {
        fontSize: '42px',
        fontWeight: 600,
        margin: 0,

        [mq('mobileOnly')]: {
          fontSize: '36px',
        },
      },
      h2: {
        fontSize: '32px',
        fontWeight: 600,
        margin: 0,

        [mq('mobileOnly')]: {
          fontSize: '28px',
        },
      },
      h3: {
        fontSize: '22px',
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          fontSize: '20px',
        },
      },
      h4: {
        fontSize: '20px',
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          fontSize: '18px',
        },
      },
      h5: {
        fontSize: '18px',
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          fontSize: '17px',
        },
      },
      p: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '26px',
      },
      a: {
        textDecoration: 'none',
        color: colors.blue,

        ':hover, :visited, :active': {
          color: colors.blue,
        },
      },
    }}
  />
);

GlobalStyles.propTypes = {
  bgColor: PropTypes.string,
  theme: PropTypes.object.isRequired,
};

GlobalStyles.defaultProps = {
  bgColor: 'bgGrey',
};

export default withTheme(GlobalStyles);
