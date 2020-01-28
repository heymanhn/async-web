import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentsAlt,
  faCommentCheck,
} from '@fortawesome/pro-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
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

const LabelContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Label = styled.div(({ isUnread }) => ({
  fontSize: '14px',
  letterSpacing: '-0.006em',
  fontWeight: isUnread ? 600 : 400,
}));

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

const DiscussionIcon = styled(FontAwesomeIcon)(
  ({ isunread, theme: { colors } }) => ({
    color: isunread === 'true' ? colors.blue : colors.grey4,
    fontSize: '20px',
    marginRight: '10px',
  })
);

const ResolvedDiscussionIcon = styled(DiscussionIcon)(
  ({ theme: { colors } }) => ({
    color: colors.successGreen,
  })
);

const DiscussionListItemHeader = ({ discussion, setDiscussionId }) => {
  const { id, tags, status, replyCount } = discussion;
  const { state, author } = status || {};

  function isUnread() {
    return (
      state === 're-opened' ||
      tags.includes('new_replies') ||
      tags.includes('new_discussion')
    );
  }

  function titleize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  function headerLabel() {
    if (state === 're-opened' || state === 'resolved')
      return `${author.fullName} ${state} this discussion`;

    return tags.includes('no_updates')
      ? Pluralize('reply', replyCount - 1, true)
      : tags[0].replace('_', ' ');
  }

  function isResolved() {
    return state === 'resolved';
  }

  function headerIcon() {
    if (isResolved()) return faCommentCheck;

    return tags.includes('new_replies') ? faComment : faCommentsAlt;
  }

  return (
    <Container>
      <LabelContainer>
        {isResolved() ? (
          <ResolvedDiscussionIcon icon={headerIcon()} />
        ) : (
          <DiscussionIcon
            icon={headerIcon()}
            isunread={isUnread().toString()}
          />
        )}
        <Label isUnread={isUnread()}>{titleize(headerLabel())}</Label>
      </LabelContainer>
      <ViewDiscussionButton onClick={() => setDiscussionId(id)}>
        {tags.includes('new_replies') ? 'View replies' : 'View discussion'}
      </ViewDiscussionButton>
    </Container>
  );
};

DiscussionListItemHeader.propTypes = {
  discussion: PropTypes.object.isRequired,
  setDiscussionId: PropTypes.func.isRequired,
};

export default DiscussionListItemHeader;
