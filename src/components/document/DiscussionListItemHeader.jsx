import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
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

const DiscussionListItemHeader = ({ discussion }) => {
  const { handleShowModal } = useContext(DocumentContext);
  const { id, tags, status, messageCount } = discussion;
  const { state, author } = status || {};

  const isUnread = () => {
    return (
      state === 're-opened' ||
      tags.includes('new_messages') ||
      tags.includes('new_discussion')
    );
  };

  const headerLabel = () => {
    if (state === 're-opened' || state === 'resolved')
      return `${author.fullName} ${state} this discussion`;

    return tags.includes('no_updates')
      ? Pluralize('reply', messageCount, true)
      : tags[0].replace('_', ' ');
  };

  const isResolved = () => {
    return state === 'resolved';
  };

  const headerIcon = () => {
    if (isResolved()) return 'comment-check';

    return tags.includes('new_messages') ? 'comment' : 'comments-alt';
  };

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
      <ViewDiscussionButton onClick={() => handleShowModal(id)}>
        {tags.includes('new_messages') ? 'View replies' : 'View discussion'}
      </ViewDiscussionButton>
    </Container>
  );
};

DiscussionListItemHeader.propTypes = {
  discussion: PropTypes.object.isRequired,
};

export default DiscussionListItemHeader;
