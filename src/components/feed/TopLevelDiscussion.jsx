import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import LargeReply from 'components/discussion/LargeReply';
import ReplyComposer from 'components/discussion/ReplyComposer';
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

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
}));

const TopLevelDiscussion = ({ conversation, meeting, ...props }) => {
  const { messages } = conversation;
  const { id: meetingId } = meeting;
  const { author } = messages[0];
  return (
    <Container {...props}>
      <FeedItemHeader conversation={conversation} meeting={meeting} />
      <LargeReply
        author={author}
        conversationId={messages[0].conversationId}
        message={messages[0]}
        mode="display"
        replyCount={0}
      />
      <Separator />
      <ReplyComposer
        afterSubmit={() => {}}
        conversationId={messages[0].conversationId}
        meetingId={meetingId}
        roundedCorner
      />
    </Container>
  );
};

TopLevelDiscussion.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default TopLevelDiscussion;
