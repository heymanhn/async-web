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

const HeaderSection = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginLeft: '-60px',
  marginRight: '-60px',
  position: 'sticky',
  top: 0,
  background: colors.white,
}));

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

const Message = ({
  mode: initialMode,
  message,
  afterCreateMessage,
  handleCancel,
  ...props
}) => {
  const messageContext = useContext(MessageContext);
  const { draft, parentType } = messageContext;
  const { hideComposer, messageCount, setHideComposer } = useContext(
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
    ...messageContext,
    messageId,
    mode,
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
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  afterCreateMessage: PropTypes.func,
  handleCancel: PropTypes.func,
};

Message.defaultProps = {
  mode: 'display',
  message: {},
  afterCreateMessage: () => {},
  handleCancel: () => {},
};

export default Message;
