import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsAlt } from '@fortawesome/pro-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionReply from 'components/discussion/DiscussionReply';
import AvatarList from 'components/shared/AvatarList';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const Header = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  padding: '0 30px',
  height: '56px',
}));

const DiscussionLabelContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const DiscussionLabel = styled.div(({ isUnread }) => ({
  fontSize: '14px',
  letterSpacing: '-0.006em',
  fontWeight: isUnread ? 600 : 400,
}));

const DiscussionLabelIcon = styled(FontAwesomeIcon)(
  ({ isunread, theme: { colors } }) => ({
    color: isunread === 'true' ? colors.blue : colors.grey4,
    fontSize: '20px',
    marginRight: '10px',
  })
);

const ViewDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.grey1,
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 500,
  height: '30px',
  padding: '0 18px',
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

const ContextEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  background: colors.grey7,
  opacity: 0.6,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  padding: '10px 30px 5px',
}));

const StyledDiscussionReply = styled(DiscussionReply)(
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
  if (error || !data.discussion || !data.replies) return null;

  const { topic: context, lastReplies, tags, replyCount } = data.discussion;
  const { payload } = context || {};
  const { items } = data.replies;
  const { reply: firstReply } = items[0];
  const lastReply = lastReplies && lastReplies[lastReplies.length - 1];
  const discussionLabel = tags.includes('no_updates')
    ? Pluralize('reply', replyCount - 1, true)
    : tags[0].replace('_', ' ');
  const avatarUrls = lastReplies.map(r => r.author.profilePictureUrl);
  const moreReplyCount = replyCount - (context ? 1 : 2);

  function isUnread() {
    return tags.includes('new_replies') || tags.includes('new_discussion');
  }

  function titleize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  return (
    <Container>
      <Header>
        <DiscussionLabelContainer>
          <DiscussionLabelIcon
            icon={tags.includes('new_replies') ? faComment : faCommentsAlt}
            isunread={isUnread().toString()}
          />
          <DiscussionLabel isUnread={isUnread()}>
            {titleize(discussionLabel)}
          </DiscussionLabel>
        </DiscussionLabelContainer>
        <ViewDiscussionButton onClick={() => setDiscussionId(discussionId)}>
          {tags.includes('new_replies') ? 'View replies' : 'View discussion'}
        </ViewDiscussionButton>
      </Header>
      {payload ? (
        <ContextEditor
          contentType="discussionContext"
          readOnly
          initialValue={payload}
          mode="display"
        />
      ) : (
        <StyledDiscussionReply
          discussionId={discussionId}
          initialReply={firstReply}
        />
      )}
      {moreReplyCount > 0 && (
        <MoreRepliesIndicator>
          <StyledAvatarList avatarUrls={avatarUrls} opacity={0.5} />
          <div>{Pluralize('more reply', moreReplyCount, true)}</div>
        </MoreRepliesIndicator>
      )}
      {lastReply && lastReply.id !== firstReply.id && (
        <StyledDiscussionReply
          discussionId={discussionId}
          initialReply={lastReply}
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
