import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';

// import RovalEditor from 'components/editor/RovalEditor';
import DiscussionMessage from 'components/discussion/DiscussionMessage';
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
  letterSpacing: '-0.006',
  color: colors.grey3,
  padding: '0 30px',
}));

const StyledAvatarList = styled(AvatarList)({
  marginRight: '10px',
});

// const ContextEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
//   background: colors.grey7,
//   opacity: 0.6,
//   borderTopLeftRadius: '5px',
//   borderTopRightRadius: '5px',
//   fontSize: '16px',
//   lineHeight: '26px',
//   fontWeight: 400,
//   padding: '10px 30px 5px',
// }));

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    borderBottom: `1px solid ${colors.borderGrey}`,
    paddingBottom: '10px',
  })
);

const DiscussionListItem = ({ discussionId, setDiscussionId }) => {
  const { loading, error, data } = useQuery(discussionQuery, {
    variables: { id: discussionId },
  });
  if (loading) return null;
  if (error || !data.discussion || !data.messages) return null;

  const { topic: context, lastMessage, messageCount, draft } = data.discussion;
  // const { payload } = context || {};
  const { items } = data.messages;
  const messages = (items || []).map(i => i.message);
  const firstMessage = messages[0];
  const avatarUrls = messages.map(m => m.author.profilePictureUrl);
  const moreReplyCount = messageCount - (context ? 1 : 2);

  return (
    <Container>
      <DiscussionListItemHeader
        discussion={data.discussion}
        setDiscussionId={setDiscussionId}
      />
      {/* SLATE UPGRADE TODO: Get context working in All Discussions page too */}
      {/* {payload ? (
        <ContextEditor
          contentType="discussionContext"
          readOnly
          initialValue={payload}
          mode="display"
        />
      ) : ( */}
      <StyledDiscussionMessage
        discussionId={discussionId}
        initialMessage={firstMessage}
        draft={draft}
      />
      {/* )} */}
      {moreReplyCount > 0 && (
        <MoreRepliesIndicator>
          <StyledAvatarList avatarUrls={avatarUrls} opacity={0.5} />
          <div>{Pluralize('more reply', moreReplyCount, true)}</div>
        </MoreRepliesIndicator>
      )}
      {lastMessage && lastMessage.id !== firstMessage.id && (
        <StyledDiscussionMessage
          discussionId={discussionId}
          initialMessage={lastMessage}
        />
      )}
    </Container>
  );
};

DiscussionListItem.propTypes = {
  discussionId: PropTypes.string.isRequired,
  setDiscussionId: PropTypes.func.isRequired,
};

export default DiscussionListItem;
