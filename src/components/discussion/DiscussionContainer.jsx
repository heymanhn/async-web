import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';

import HeaderBar from 'components/navigation/HeaderBar';
import Discussion from './Discussion';

const Content = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // 60px for the navigation bar
  margin: '0 auto',
  background: colors.bgGrey,
}));

const DiscussionContainer = ({ discussionId }) => {
  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <HeaderBar />
      <Content>
        <Discussion />
      </Content>
    </DiscussionContext.Provider>
  );
};

DiscussionContainer.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionContainer;
