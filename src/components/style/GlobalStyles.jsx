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
        ...fontProps({ size: 42, weight: 600 }),
        margin: 0,

        [mq('mobileOnly')]: fontProps({ size: 36 }),
      },
      h2: {
        ...fontProps({ size: 32, weight: 600 }),
        margin: 0,

        [mq('mobileOnly')]: fontProps({ size: 28 }),
      },
      h3: {
        ...fontProps({ size: 22, weight: 500 }),
        margin: 0,

        [mq('mobileOnly')]: fontProps({ size: 20 }),
      },
      h4: {
        ...fontProps({ size: 20, weight: 500 }),
        margin: 0,

        [mq('mobileOnly')]: fontProps({ size: 18 }),
      },
      h5: {
        ...fontProps({ size: 18, weight: 500 }),
        margin: 0,

        [mq('mobileOnly')]: fontProps({ size: 17 }),
      },
      p: fontProps({ size: 16, weight: 400 }),
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
