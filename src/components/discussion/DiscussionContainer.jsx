import React from 'react';
import PropTypes from 'prop-types';

import { DiscussionContext } from 'utils/contexts';

import HeaderBar from 'components/navigation/HeaderBar';
import Discussion from './Discussion';

const DiscussionContainer = ({ discussionId }) => {
  const value = {
    discussionId,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <HeaderBar />
      <Discussion />
    </DiscussionContext.Provider>
  );
};

DiscussionContainer.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionContainer;
