import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useCurrentUser from 'utils/hooks/useCurrentUser';
import useHover from 'utils/hooks/useHover';
import { MessageContext, DiscussionContext } from 'utils/contexts';

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
  mode: initialMode,
  message,
  afterDiscussionCreate,
  afterCreate,
  handleCancel,
  ...props
}) => {
  const { draft } = useContext(DiscussionContext);
  const [mode, setMode] = useState(initialMode);
  const { hover, ...hoverProps } = useHover(mode !== 'display');
  const currentUser = useCurrentUser();

  const { createdAt, id: messageId, updatedAt, body } = message;
  const author = message.author || currentUser || (draft && draft.author);
  const isAuthor = currentUser.id === author.id;

  function loadInitialContent() {
    if (draft) return draft.body.payload;

    return mode !== 'compose' ? body.payload : null;
  }

  function handleCancelWrapper() {
    if (mode === 'edit') setMode('display');

    handleCancel();
  }

  const value = {
    messageId,
    mode,
    setMode,
    afterDiscussionCreate,
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
          {messageId && mode === 'display' && (
            <StyledHoverMenu isAuthor={isAuthor} isOpen={hover} />
          )}
        </HeaderSection>
        <MessageEditor
          initialMessage={loadInitialContent()}
          // isDraft={!!draft}
        />
        {mode === 'display' && <MessageReactions />}
      </MessageContext.Provider>
    </Container>
  );
};

DiscussionMessage.propTypes = {
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  message: PropTypes.object,
  afterDiscussionCreate: PropTypes.func,
  afterCreate: PropTypes.func,
  handleCancel: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  mode: 'display',
  message: {},
  afterDiscussionCreate: () => {},
  afterCreate: () => {},
  handleCancel: () => {},
};

export default DiscussionMessage;
