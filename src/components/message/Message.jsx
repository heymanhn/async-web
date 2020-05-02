import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useCurrentUser from 'hooks/shared/useCurrentUser';
import useHover from 'hooks/shared/useHover';
import {
  DiscussionContext,
  ThreadContext,
  MessageContext,
  DEFAULT_MESSAGE_CONTEXT,
} from 'utils/contexts';

import AuthorDetails from 'components/shared/AuthorDetails';
import MessageEditor from './MessageEditor';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';
import ViewMessageThreadButton from './ViewMessageThreadButton';

const Container = styled.div(
  ({ hover, theme: { colors } }) => ({
    background: hover ? colors.bgGrey : 'none',
    padding: '20px 0 0',
  }),
  ({ mode, theme: { colors } }) => {
    if (mode !== 'edit') return {};

    return {
      background: 'none',
      borderTop: `3px solid ${colors.bgGrey}`,
      borderBottom: `1px solid ${colors.borderGrey}`,
      padding: 0,
    };
  }
);

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
}));

const InnerContainer = styled.div(
  ({ mode, theme: { discussionViewport } }) => ({
    margin: '0 auto',
    padding: mode === 'edit' ? '20px 30px 0' : '0 30px',
    width: discussionViewport,
  })
);

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

const MinimizeButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  width: '26px',
  height: '24px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

// TODO (DISCUSSION V2): The discussion UX redesign should standardize the
// appearance of messages, whether in discussions or threads.
const Message = ({
  index,
  draft,
  mode: initialMode,
  message,
  messageCount, // number of messages in the parent thread or discussion
  parentId, // A message belongs to either a thread or a discussion
  parentType,
  afterCreateMessage,
  handleCancel,
  ...props
}) => {
  const { hideComposer, setHideComposer } = useContext(
    parentType === 'discussion' ? DiscussionContext : ThreadContext
  );
  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode === 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body, threadId } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;
  const { handleShowThread } = useContext(DiscussionContext);

  if (mode === 'edit' && !hideComposer) setHideComposer(true);

  const loadInitialContent = () => {
    if (mode !== 'compose') return body.payload;

    return draft ? draft.body.payload : null;
  };

  const afterUpdateMessage = () => {
    setMode('display');
    if (hideComposer) setHideComposer(false);
  };

  const handleCancelWrapper = () => {
    if (mode === 'edit') {
      setMode('display');
      if (hideComposer) setHideComposer(false);
    }

    handleCancel();
  };

  const value = {
    ...DEFAULT_MESSAGE_CONTEXT,
    messageId,
    parentId,
    parentType,
    mode,
    draft,
    threadPosition: index,
    setMode,
    afterCreateMessage,
    afterUpdateMessage,
    handleCancel: handleCancelWrapper,
  };

  return (
    <Container
      id={messageId}
      hover={hover}
      mode={mode}
      {...hoverProps}
      {...props}
    >
      {mode === 'edit' && <Divider />}
      <MessageContext.Provider value={value}>
        <InnerContainer mode={mode}>
          <HeaderSection>
            <AuthorDetails
              author={author}
              createdAt={createdAt}
              isEdited={createdAt !== updatedAt}
            />
            <div>
              {/* For now, hiding the composer means no hover menu, so that the
                  user can't edit multiple messages */}
              {messageId && mode === 'display' && !hideComposer && (
                <StyledHoverMenu isAuthor={isAuthor} isOpen={hover} />
              )}
              {mode === 'compose' && !!messageCount && (
                <MinimizeButton onClick={handleCancelWrapper}>
                  <StyledIcon icon="compress-alt" />
                </MinimizeButton>
              )}
            </div>
          </HeaderSection>
          <MessageEditor
            initialMessage={loadInitialContent()}
            autoFocus={mode !== 'display' && !!messageCount}
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
  messageCount: PropTypes.number,
  parentId: PropTypes.string.isRequired,
  parentType: PropTypes.oneOf(['discussion', 'thread']).isRequired,
  afterCreateMessage: PropTypes.func,
  handleCancel: PropTypes.func,
};

Message.defaultProps = {
  draft: null,
  index: null,
  mode: 'display',
  message: {},
  messageCount: null,
  afterCreateMessage: () => {},
  handleCancel: () => {},
};

export default Message;
