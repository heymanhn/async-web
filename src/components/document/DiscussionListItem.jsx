import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { DiscussionContext } from 'utils/contexts';

import DiscussionMessage from 'components/discussion/DiscussionMessage';
import ContextComposer from 'components/discussion/ContextComposer';
import AvatarList from 'components/shared/AvatarList';
import DiscussionListItemHeader from './DiscussionListItemHeader';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

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
  ({ theme: { colors } }) => ({
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    borderBottom: `1px solid ${colors.borderGrey}`,
    paddingBottom: '10px',
  })
);

const DiscussionListItem = ({ discussionId }) => {
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });
  if (loading) return null;
  if (!data.discussion || !data.messages) return null;

  const { topic, lastMessage, messageCount, draft } = data.discussion;
  const { payload } = topic || {};
  const context = payload ? JSON.parse(payload) : undefined;
  const { items } = data.messages;
  const messages = (items || []).map(i => i.message);
  if (!messages.length) return null;

  const firstMessage = messages[0];
  const avatarUrls = messages.map(m => m.author.profilePictureUrl);
  const moreReplyCount = messageCount - (context ? 1 : 2);

  const value = {
    discussionId,
    context,
    draft,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <Container>
        <DiscussionListItemHeader discussion={data.discussion} />
        {context && <ContextComposer />}
        <StyledDiscussionMessage message={firstMessage} />
        {moreReplyCount > 0 && (
          <MoreRepliesIndicator>
            <StyledAvatarList avatarUrls={avatarUrls} opacity={0.5} />
            <div>{Pluralize('more reply', moreReplyCount, true)}</div>
          </MoreRepliesIndicator>
        )}
        {lastMessage && lastMessage.id !== firstMessage.id && (
          <StyledDiscussionMessage message={lastMessage} />
        )}
      </Container>
    </DiscussionContext.Provider>
  );
};

DiscussionListItem.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionListItem;
