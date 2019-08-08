import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import LargeReply from 'components/discussion/LargeReply';
import FeedItemHeader from './FeedItemHeader';

const Container = styled.div(({ theme: { colors, discussionWidth } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: 'default',
  margin: '25px 0',
  width: discussionWidth,
}));

const TopLevelDiscussion = ({ conversation, meeting, ...props }) => {
  return (
    <Container {...props}>
      <FeedItemHeader conversation={conversation} meeting={meeting} />
    </Container>
  );
};

TopLevelDiscussion.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default TopLevelDiscussion;
