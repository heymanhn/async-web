import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import FeedItemHeader from './FeedItemHeader';

// TODO(HN): DRY up these component styles in the future
const Container = styled.div(({ theme: { colors, discussionWidth } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: 'default',
  margin: '25px 0',
  width: discussionWidth,
}));

const ThreadedDiscussion = ({ conversation, meeting, ...props }) => {
  return (
    <Container {...props}>
      <FeedItemHeader conversation={conversation} meeting={meeting} />
    </Container>
  );
};

ThreadedDiscussion.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default ThreadedDiscussion;
