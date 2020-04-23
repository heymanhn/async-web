import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useCurrentUser from 'hooks/shared/useCurrentUser';
import useHover from 'hooks/shared/useHover';
import {
  MessageContext,
  DiscussionContext,
  DEFAULT_MESSAGE_CONTEXT,
} from 'utils/contexts';

import AuthorDetails from 'components/shared/AuthorDetails';
import MessageComposer from './MessageComposer';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';
import DraftSavedIndicator from './DraftSavedIndicator';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const HeaderSection = styled.div(
  ({ theme: { colors } }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.bgGrey,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    padding: '15px 30px',
  }),
  ({ isModal, isUnread, theme: { colors } }) => {
    if (!isModal) return {};
    return {
      background: isUnread ? colors.unreadBlue : colors.white,
      borderRadius: '0px',
    };
  }
);

// TODO (DISCUSSION V2): Add this padding to the text itself. This helps
// with selection via cursor.
const StyledMessageComposer = styled(MessageComposer)({
  padding: '0px 30px 15px',
});

const StyledHoverMenu = styled(HoverMenu)({
  position: 'relative',
  right: '0px',
});

const StyledMessageReactions = styled(MessageReactions)({
  padding: '0 30px 20px',
});

const Message = ({
  index, // Used only by <DiscussionMessages /> to see which message is selected
  isUnread,
  mode: initialMode,
  message,
  disableAutoFocus,
  afterCreate,
  handleCancel,
  ...props
}) => {
  const { draft, isModal } = useContext(DiscussionContext);

  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode === 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;

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
    mode,
    threadPosition: index,
    setMode,
    afterCreate,
    handleCancel: handleCancelWrapper,
  };

  return (
    <Container isModal={isModal} {...hoverProps} {...props}>
      <MessageContext.Provider value={value}>
        <HeaderSection isModal={isModal} isUnread={isUnread}>
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
        <StyledMessageComposer
          initialMessage={loadInitialContent()}
          autoFocus={mode !== 'display' && !disableAutoFocus}
        />
        {mode === 'display' && <StyledMessageReactions />}
      </MessageContext.Provider>
    </Container>
  );
};

Message.propTypes = {
  index: PropTypes.number,
  isUnread: PropTypes.bool,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  disableAutoFocus: PropTypes.bool,
  afterCreate: PropTypes.func,
  handleCancel: PropTypes.func,
};

Message.defaultProps = {
  index: null,
  isUnread: false,
  mode: 'display',
  message: {},
  disableAutoFocus: false,
  afterCreate: () => {},
  handleCancel: () => {},
};

export default Message;
