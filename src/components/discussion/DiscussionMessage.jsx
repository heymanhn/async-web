import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled';

import addDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import { getLocalUser } from 'utils/auth';
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
  currentUser,
  draft,
  initialMode,
  initialMessage,
  onCancel,
  onCreateDiscussion,
  ...props
}) => {
  const client = useApolloClient();
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() {
    setMode('display');
  }
  function setToEditMode() {
    setMode('edit');
  }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [message, setMessage] = useState(initialMessage);
  const { createdAt, id: messageId, updatedAt, body } = message || {};
  const author = message.author || currentUser || (draft && draft.author);
  const userToDisplay = author;

  const { userId } = getLocalUser();
  const isAuthor = userId === author.id;

  async function handleSaveDraft({ payload, text }) {
    let draftDiscussionId = discussionId;
    if (!draftDiscussionId) {
      const { discussionId: did } = await onCreateDiscussion();
      draftDiscussionId = did;
    }

    const { data } = await client.mutate({
      mutation: createMessageDraftMutation,
      variables: {
        discussionId: draftDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
      update: (_cache, { data: { createMessageDraft } }) => {
        client.mutate({
          mutation: addDraftToDiscussionMtn,
          variables: {
            discussionId: draftDiscussionId,
            draft: createMessageDraft,
          },
        });
      },
    });

    if (data.createMessageDraft) {
      afterCreate(draftDiscussionId, true);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save message draft'));
  }

  async function handleDeleteDraft() {
    const { data } = await client.mutate({
      mutation: deleteMessageDraftMutation,
      variables: { discussionId },
      refetchQueries: [
        {
          query: discussionQuery,
          variables: { id: discussionId, queryParams: {} },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (data.deleteMessageDraft) {
      const {
        discussion: { messageCount },
      } = client.readQuery({
        query: discussionQuery,
        variables: { id: discussionId, queryParams: {} },
      });

      if (!messageCount) {
        // TODO (HN): Delete highlight from text

        await client.mutate({
          mutation: deleteDiscussionMutation,
          variables: { discussionId, documentId },
          refetchQueries: [
            {
              query: documentDiscussionsQuery,
              variables: { id: documentId, queryParams: { order: 'desc' } },
            },
          ],
          awaitRefetchQueries: true,
        });
        onCancel({ closeModal: true });
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete message draft'));
  }

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
            author={userToDisplay}
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
  currentUser: PropTypes.object,
  draft: PropTypes.object,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialMessage: PropTypes.object,
  onCancel: PropTypes.func,
  onCreateDiscussion: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  afterCreate: () => {},
  currentUser: null,
  draft: null,
  initialMode: 'display',
  initialMessage: {},
  onCancel: () => {},
  onCreateDiscussion: () => {},
};

export default DiscussionMessage;
