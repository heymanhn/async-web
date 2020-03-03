import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useCurrentUser from 'utils/hooks/useCurrentUser';
import useHover from 'utils/hooks/useHover';
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

const Container = styled.div(({ mode, theme: { colors } }) => ({
  background: colors.white,
  cursor: 'default',
  padding: mode === 'edit' ? '15px 30px 15px !important' : '15px 30px 15px',
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

const DiscussionMessage = ({
  index, // Used only by <DiscussionThread /> to see which message is selected
  mode: initialMode,
  message,
  afterCreate,
  handleCancel,
  ...props
}) => {
  const { draft } = useContext(DiscussionContext);

  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode === 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;

  function loadInitialContent() {
    if (mode !== 'compose') return body.payload;

    return draft ? draft.body.payload : null;
  }

  function handleCancelWrapper() {
    if (mode === 'edit') setMode('display');

    handleCancel();
  }

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
    <Container mode={mode} {...hoverProps} {...props}>
      <MessageContext.Provider value={value}>
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
        <MessageComposer
          initialMessage={loadInitialContent()}
          autoFocus={mode !== 'display'}
        />
        {mode === 'display' && <MessageReactions />}
      </MessageContext.Provider>
    </Container>
  );
};

DiscussionMessage.propTypes = {
  index: PropTypes.number,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  afterCreate: PropTypes.func,
  handleCancel: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  index: null,
  mode: 'display',
  message: {},
  afterCreate: () => {},
  handleCancel: () => {},
};

export default DiscussionMessage;
