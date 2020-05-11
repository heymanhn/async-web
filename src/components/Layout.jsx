import React from 'react';
import PropTypes from 'prop-types';

import useMediaQuery from 'hooks/shared/useMediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

const Layout = ({ children }) => {
  useMediaQuery();

  return (
    <Theme>
      <GlobalStyles />
      <div>{children}</div>
    </Theme>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
