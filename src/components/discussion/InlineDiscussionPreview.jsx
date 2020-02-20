import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import Truncate from 'react-truncate';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { DocumentContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';

const OuterContainer = styled.div(({ isOpen, styles }) => ({
  position: 'absolute',
  width: '100vw',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.2s',

  ...styles,
}));

const Container = styled.div(({ theme: { colors, documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  height: '60px',
  margin: '0 auto',
  padding: '0 25px',
  width: documentViewport,
}));

const LastMessageDetails = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const PreviewSnippet = styled.div(({ theme: { colors } }) => ({
  flexGrow: 1,
  color: colors.grey2,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  lineHeight: '32px',
}));

const StyledTruncate = styled(Truncate)({
  userSelect: 'none',
});

const MessageCountIndicator = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '12px',
  fontWeight: 500,
  paddingLeft: '25px',
}));

const NewReplyContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const NewReplyIndicator = styled.span(({ theme: { colors } }) => ({
  height: '6px',
  width: '6px',
  backgroundColor: colors.blue,
  borderRadius: '50%',
}));

const NewReplyLabel = styled(MessageCountIndicator)(
  ({ theme: { colors } }) => ({
    color: colors.mainText,
    paddingLeft: '5px',
  })
);

const InlineDiscussionPreview = ({ discussionId, isOpen, parentRef }) => {
  const { handleShowModal } = useContext(DocumentContext);
  const { loading, error, data: discussionData } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return null;
  if (error || !discussionData.discussion) return null;

  const { draft, lastMessage, messageCount, tags } = discussionData.discussion;
  const { author } = lastMessage || discussionData.discussion;
  const { body } = draft || lastMessage;
  const { profilePictureUrl } = author;
  const { text } = body;
  const newUpdates =
    tags.includes('new_messages') || tags.includes('new_discussion');

  // HN: Make a better UI for a draft indicator in the preview in the future
  const displayText = draft ? `(Draft) ${text}` : text;

  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    handleShowModal(discussionId);
  };

  const calculateTooltipPosition = () => {
    if (!isOpen || !parentRef.current) return {};

    const { offsetHeight, offsetTop } = parentRef.current;
    return {
      top: `${offsetTop + offsetHeight}px`,
    };
  };

  const root = window.document.getElementById('root');

  return ReactDOM.createPortal(
    <OuterContainer isOpen={isOpen} styles={calculateTooltipPosition()}>
      <Container onClick={handleClick}>
        <LastMessageDetails>
          <AvatarWithMargin avatarUrl={profilePictureUrl} size={32} />
          <PreviewSnippet>
            <StyledTruncate lines={1}>{displayText}</StyledTruncate>
          </PreviewSnippet>
        </LastMessageDetails>
        {newUpdates ? (
          <NewReplyContainer>
            <NewReplyIndicator />
            <NewReplyLabel>{tags[0].replace('_', ' ')}</NewReplyLabel>
          </NewReplyContainer>
        ) : (
          <MessageCountIndicator>
            {Pluralize('reply', messageCount, true)}
          </MessageCountIndicator>
        )}
      </Container>
    </OuterContainer>,
    root
  );
};

InlineDiscussionPreview.propTypes = {
  discussionId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default InlineDiscussionPreview;
