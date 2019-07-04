import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { withTheme } from 'emotion-theming';

const GlobalStyles = ({ theme: { colors, fontStack, codeFontStack, mq } }) => (
  <Global
    styles={{
      '*': {
        boxSizing: 'border-box',
        fontFamily: fontStack,
        letterSpacing: '-0.01em',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      'html, body': {
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
        lineHeight: '25px',
      },
      a: {
        textDecoration: 'none',
        color: colors.blue,

        ':hover, :visited, :active': {
          color: colors.blue,
        },
      },
      code: {
        background: colors.grey6,
        border: `1px solid ${colors.codeBlockBorderGrey}`,
        borderRadius: '3px',
        color: colors.codeBlockRed,
        fontFamily: `${codeFontStack}`,
        padding: '1px 4px',

        span: {
          fontFamily: `${codeFontStack}`,
        },
      },
      pre: {
        background: colors.bgGrey,
        border: `1px solid ${colors.borderGrey}`,
        borderRadius: '5px',
        fontFamily: `${codeFontStack}`,
        padding: '7px 12px',

        span: {
          fontFamily: `${codeFontStack}`,
        },
      },
    }}
  />
);

GlobalStyles.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme(GlobalStyles);
