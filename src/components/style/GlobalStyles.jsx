import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { withTheme } from 'emotion-theming';

const GlobalStyles = ({
  bgColor,
  theme: { colors, fontStack, fontProps, mq },
}) => (
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
        ...fontProps(42),
        fontWeight: 600,
        margin: 0,

        [mq('mobileOnly')]: {
          ...fontProps(36),
        },
      },
      h2: {
        ...fontProps(32),
        fontWeight: 600,
        margin: 0,

        [mq('mobileOnly')]: {
          ...fontProps(28),
        },
      },
      h3: {
        ...fontProps(22),
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          ...fontProps(20),
        },
      },
      h4: {
        ...fontProps(20),
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          ...fontProps(18),
        },
      },
      h5: {
        ...fontProps(18),
        fontWeight: 500,
        margin: 0,

        [mq('mobileOnly')]: {
          ...fontProps(17),
        },
      },
      p: {
        ...fontProps(16),
        fontWeight: 400,
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
