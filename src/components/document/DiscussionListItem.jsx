import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import localDeleteDiscussionMutation from 'graphql/mutations/local/deleteDiscussionFromDocument';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';

import DiscussionMessage from 'components/discussion/DiscussionMessage';
import ContextComposer from 'components/discussion/ContextComposer';
import AvatarList from 'components/shared/AvatarList';
import NotFound from 'components/navigation/NotFound';
import DiscussionListItemHeader from './DiscussionListItemHeader';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const StyledContextComposer = styled(ContextComposer)(
  ({ theme: { colors } }) => ({
    borderBottom: `1px solid ${colors.borderGrey}`,
  })
);

const MoreRepliesIndicator = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  height: '46px',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  color: colors.grey3,
  padding: '0 30px',
}));

const StyledAvatarList = styled(AvatarList)({
  marginRight: '10px',
});

const StyledDiscussionMessage = styled(DiscussionMessage)(
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

const DiscussionListItem = ({ discussionId }) => {
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  const { loading: loading2, data: data2 } = useQuery(discussionMessagesQuery, {
    variables: { discussionId, queryParams: {} },
  });
  const [localDeleteDiscussion] = useMutation(localDeleteDiscussionMutation);

  if (loading || loading2) return null;
  if (!data.discussion || !data2.messages) return <NotFound />;

  const {
    topic,
    lastMessage,
    messageCount,
    draft,
    documentId,
  } = data.discussion;
  const { payload } = topic || {};
  const context = payload ? JSON.parse(payload) : undefined;
  const { items } = data2.messages;
  const messages = (items || []).map(i => i.message);
  if (!messages.length) return null;

  const firstMessage = messages[0];
  const avatarUrls = messages.map(m => m.author.profilePictureUrl);
  const moreReplyCount = messageCount - (context ? 1 : 2);

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    context,
    draft,
    afterDelete: () =>
      localDeleteDiscussion({ variables: { documentId, discussionId } }),
  };

  return (
    <DiscussionContext.Provider value={value}>
      <Container>
        <DiscussionListItemHeader discussion={data.discussion} />
        {context && <StyledContextComposer />}
        <StyledDiscussionMessage
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
          <StyledDiscussionMessage isLast message={lastMessage} />
        )}
      </Container>
    </DiscussionContext.Provider>
  );
};

DiscussionListItem.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionListItem;
