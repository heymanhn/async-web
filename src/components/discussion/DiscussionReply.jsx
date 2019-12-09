/* eslint no-alert: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useHover from 'utils/hooks/useHover';
import { getLocalUser } from 'utils/auth';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';
import HoverMenu from './HoverMenu';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  borderRadius: '5px',
  cursor: 'default',
  padding: '15px 30px 25px',
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

// HN: These styles should be moved elsewhere
const ReplyEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginTop: '15px',
});

const DiscussionReply = ({
  currentUser,
  discussionId,
  documentId,
  initialMode,
  initialReply,
  onCancel,
  onCreateDiscussion,
  ...props
}) => {
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() { setMode('display'); }
  function setToEditMode() { setMode('edit'); }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [reply, setReply] = useState(initialReply);
  const { createdAt, id: replyId, updatedAt, body } = reply || {};
  const author = reply.author || currentUser;
  const userToDisplay = author;

  const { userId } = getLocalUser();
  const isAuthor = userId === author.id;

  async function handleDelete() {
    // no-op
  }

  function handleCancel() {
    if (mode === 'compose') {
      onCancel();
    } else {
      setToDisplayMode();
    }
  }

  return (
    <Container {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={userToDisplay}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode={mode}
        />
        {replyId && mode === 'display' && (
          <StyledHoverMenu
            conversationId={discussionId}
            isAuthor={isAuthor}
            isOpen={hover}
            messageId={replyId}
            onDelete={handleDelete}
            onEdit={setToEditMode}
          />
        )}
      </HeaderSection>
      <ReplyEditor
        contentType="discussionReply"
        initialHeight={240} // Give Arun more breathing room :-)
        initialValue={mode !== 'compose' ? body.payload : null}
        isAuthor={isAuthor}
        mode={mode}
        onCancel={handleCancel}
        // onDiscardDraft={handleDeleteDraft}
        // onSaveDraft={handleSaveDraft}
        // onSubmit={mode === 'compose' ? handleCreate : handleUpdate}
      />
    </Container>
  );
};

DiscussionReply.propTypes = {
  currentUser: PropTypes.object.isRequired,
  discussionId: PropTypes.string,
  documentId: PropTypes.string.isRequired,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialReply: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onCreateDiscussion: PropTypes.func.isRequired,
};

DiscussionReply.defaultProps = {
  discussionId: null,
  initialMode: 'display',
  initialReply: {},
};

export default DiscussionReply;
