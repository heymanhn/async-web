import React from 'react';
import PropTypes from 'prop-types';

import useMediaQuery from 'utils/hooks/useMediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

const Layout = ({ children }) => {
  useMediaQuery();

  // TEMP CODE
  const isDocument = window.location.pathname.includes('/documents/');

  return (
    <Theme>
      <GlobalStyles bgColor={isDocument ? 'white' : null} />
      <div>{children}</div>
    </Theme>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
