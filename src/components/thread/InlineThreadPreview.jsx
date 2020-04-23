import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Truncate from 'react-truncate';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';

const OuterContainer = styled.div(({ isOpen, styles }) => ({
  position: 'absolute',
  width: '100vw',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.2s',
  top: '-10000px',
  left: '-10000px',

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

const ThreadPreview = ({ discussionId, isOpen, parentRef, mode }) => {
  const { handleShowThread } = useContext(
    mode === 'document' ? DocumentContext : DiscussionContext
  );
  const { loading, error, data, client } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  if (loading) return null;
  if (error || !data.discussion) return null;

  const { draft, lastMessage, messageCount, tags } = data.discussion;
  const content = draft || lastMessage;
  if (!content) return null;

  const { author } = lastMessage || data.discussion;
  const { body } = content;
  const { profilePictureUrl } = author;
  const { text } = body;
  const newUpdates =
    tags.includes('new_messages') || tags.includes('new_discussion');

  // HN: Make a better UI for a draft indicator in the preview in the future
  const displayText = draft ? `(Draft) ${text}` : text;

  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    handleShowThread(discussionId);
  };

  const calculateTooltipPosition = () => {
    if (!isOpen || !parentRef.current) return {};

    const { offsetHeight, offsetTop } = parentRef.current;
    return {
      top: `${offsetTop + offsetHeight}px`,
      left: '120px', // Adjusting for half of the sidebar width
    };
  };

  // Optimistically pre-fetch the messages for the discussion, so that the
  // discussion modal loads immediately
  client.query({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
  });

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

ThreadPreview.propTypes = {
  discussionId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['document', 'discussion']),
};

ThreadPreview.defaultProps = {
  mode: 'document', // for backwards compatibility
};

export default ThreadPreview;
