import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useCurrentUser from 'hooks/shared/useCurrentUser';
import useHover from 'hooks/shared/useHover';
import {
  DiscussionContext,
  MessageContext,
  DEFAULT_MESSAGE_CONTEXT,
} from 'utils/contexts';

import AuthorDetails from 'components/shared/AuthorDetails';
import MessageEditor from './MessageEditor';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';
import DraftSavedIndicator from './DraftSavedIndicator';
import ViewMessageThreadButton from './ViewMessageThreadButton';

const Container = styled.div(({ hover, theme: { colors } }) => ({
  background: hover ? colors.bgGrey : colors.white,
  padding: '20px 0 0',
}));

const InnerContainer = styled.div(({ theme: { discussionViewport } }) => ({
  margin: '0 auto',
  padding: '0 30px',
  width: discussionViewport,
}));

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledHoverMenu = styled(HoverMenu)({
  position: 'relative',
  right: '0px',
});

// TODO (DISCUSSION V2): The discussion UX redesign should standardize the
// appearance of messages, whether in discussions or threads.
const Message = ({
  index,
  draft,
  mode: initialMode,
  message,
  parentId, // A message belongs to either a thread or a discussion
  disableAutoFocus,
  afterCreateMessage,
  handleCancel,
  ...props
}) => {
  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode === 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body, threadId } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;
  const { handleShowThread } = useContext(DiscussionContext);

  const loadInitialContent = () => {
    if (mode !== 'compose') return body.payload;

    return draft ? draft.body.payload : null;
  };

  const handleCancelWrapper = () => {
    if (mode === 'edit') setMode('display');

    handleCancel();
  };

  const value = {
    ...DEFAULT_MESSAGE_CONTEXT,
    messageId,
    parentId,
    mode,
    draft,
    currentMessage: message,
    threadPosition: index,
    setMode,
    afterCreateMessage,
    handleCancel: handleCancelWrapper,
  };

  return (
    <Container hover={hover} {...hoverProps} {...props}>
      <MessageContext.Provider value={value}>
        <InnerContainer>
          <HeaderSection>
            <AuthorDetails
              author={author}
              createdAt={createdAt}
              isEdited={createdAt !== updatedAt}
            />
            <div>
              {messageId && mode === 'display' && (
                <StyledHoverMenu isAuthor={isAuthor} isOpen={hover} />
              )}
              {mode === 'compose' && <DraftSavedIndicator />}
            </div>
          </HeaderSection>
          <MessageEditor
            initialMessage={loadInitialContent()}
            autoFocus={mode !== 'display' && !disableAutoFocus}
          />
          {mode === 'display' && <MessageReactions />}
          {mode === 'display' && threadId && (
            <ViewMessageThreadButton
              threadId={threadId}
              handleShowThread={handleShowThread}
            />
          )}
        </InnerContainer>
      </MessageContext.Provider>
    </Container>
  );
};

Message.propTypes = {
  draft: PropTypes.object,
  index: PropTypes.number,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  parentId: PropTypes.string.isRequired,
  disableAutoFocus: PropTypes.bool,
  afterCreateMessage: PropTypes.func,
  handleCancel: PropTypes.func,
};

Message.defaultProps = {
  draft: null,
  index: null,
  mode: 'display',
  message: {},
  disableAutoFocus: false,
  afterCreateMessage: () => {},
  handleCancel: () => {},
};

export default Message;
