import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import {
  DEFAULT_MESSAGE_CONTEXT,
  DEFAULT_THREAD_CONTEXT,
  MessageContext,
  ThreadContext,
} from 'utils/contexts';

import Message from 'components/message/Message';
import TopicComposer from 'components/thread/TopicComposer';
import AvatarList from 'components/shared/AvatarList';
import NotFound from 'components/navigation/NotFound';
import ThreadListItemHeader from './ThreadListItemHeader';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const StyledTopicComposer = styled(TopicComposer)(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
}));

const MoreRepliesIndicator = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),

  display: 'flex',
  alignItems: 'center',

  height: '46px',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  color: colors.grey3,
  padding: '0 30px',
}));

const StyledAvatarList = styled(AvatarList)({
  marginRight: '10px',
});

const StyledMessage = styled(Message)(
  {
    paddingBottom: '10px',
  },
  ({ isLast }) => {
    if (!isLast) return {};
    return {
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
    };
  }
);

const ThreadListItem = ({ threadId }) => {
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: threadId },
  });

  const { loading: loading2, data: data2 } = useQuery(discussionMessagesQuery, {
    variables: { discussionId: threadId, queryParams: { order: 'desc' } },
  });

  if (loading || loading2) return null;
  if (!data.discussion || !data2.messages) return <NotFound />;

  const { topic, lastMessage, messageCount, draft } = data.discussion;
  const { items } = data2.messages;
  const messages = (items || []).map(i => i.message);
  if (!messages.length) return null;

  const firstMessage = messages[0];
  const avatarUrls = messages.map(m => m.author.profilePictureUrl);
  const moreReplyCount = messageCount - (topic ? 1 : 2);

  const threadValue = {
    ...DEFAULT_THREAD_CONTEXT,
    threadId,
    topic,
    draft,
  };

  const messageValue = {
    ...DEFAULT_MESSAGE_CONTEXT,
    parentType: 'thread',
    parentId: threadId,
  };

  return (
    <ThreadContext.Provider value={threadValue}>
      <Container>
        <ThreadListItemHeader discussion={data.discussion} />
        {topic && <StyledTopicComposer />}
        <MessageContext.Provider value={messageValue}>
          <StyledMessage
            isLast={lastMessage.id === firstMessage.id}
            message={firstMessage}
          />
          {moreReplyCount > 0 && (
            <MoreRepliesIndicator>
              <StyledAvatarList avatarUrls={avatarUrls} opacity={0.5} />
              <div>{Pluralize('more reply', moreReplyCount, true)}</div>
            </MoreRepliesIndicator>
          )}
          {lastMessage && lastMessage.id !== firstMessage.id && (
            <StyledMessage isLast message={lastMessage} />
          )}
        </MessageContext.Provider>
      </Container>
    </ThreadContext.Provider>
  );
};

ThreadListItem.propTypes = {
  threadId: PropTypes.string.isRequired,
};

export default ThreadListItem;
