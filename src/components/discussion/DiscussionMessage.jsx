import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useCurrentUser from 'utils/hooks/useCurrentUser';
import useHover from 'utils/hooks/useHover';
import { MessageContext } from 'utils/contexts';

import AuthorDetails from 'components/shared/AuthorDetails';
import MessageEditor from './MessageEditor';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  background: colors.white,
  cursor: 'default',
  padding: mode === 'edit' ? '15px 30px 25px !important' : '15px 30px 25px',
}));

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

const StyledHoverMenu = styled(HoverMenu)({
  position: 'absolute',
  right: '0px',
});

const DiscussionMessage = ({
  afterCreate,
  draft,
  initialMode,
  message,
  onCancel,
  onCreateDiscussion,
  ...props
}) => {
  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode !== 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;

  function handleCancel() {
    if (mode === 'compose') {
      onCancel();
    } else {
      setToDisplayMode();
    }
  }

  function loadInitialContent() {
    if (draft) return draft.body.payload;

    return mode !== 'compose' ? body.payload : null;
  }

  const contextValue = {
    messageId,
    mode,
    setMode,
  };

  return (
    <Container mode={mode} {...hoverProps} {...props}>
      <MessageContext.Provider value={contextValue}>
        <HeaderSection>
          <AuthorDetails
            author={author}
            createdAt={createdAt}
            isEdited={createdAt !== updatedAt}
          />
          {messageId && mode === 'display' && (
            <StyledHoverMenu
              isAuthor={isAuthor}
              isOpen={hover}
              onDelete={handleDelete}
              onEdit={setToEditMode}
            />
          )}
        </HeaderSection>
        <MessageEditor
          handleCancel={handleCancel}
          afterCreate={afterCreate}
          initialMessage={loadInitialContent()}
          // TODO: afterUpdate
          // isDraft={!!draft}
        />
        {mode === 'display' && <MessageReactions />}
      </MessageContext.Provider>
    </Container>
  );
};

DiscussionMessage.propTypes = {
  afterCreate: PropTypes.func,
  draft: PropTypes.object,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  onCancel: PropTypes.func,
  onCreateDiscussion: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  afterCreate: () => {},
  draft: null,
  initialMode: 'display',
  message: {},
  onCancel: () => {},
  onCreateDiscussion: () => {},
};

export default DiscussionMessage;
