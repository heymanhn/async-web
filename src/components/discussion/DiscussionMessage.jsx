/* eslint no-alert: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled';

import addDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';
import useHover from 'utils/hooks/useHover';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';
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

// HN: These styles should be moved elsewhere
const MessageEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginTop: '15px',
});

const DiscussionMessage = ({
  afterCreate,
  currentUser,
  discussionId,
  documentId,
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
  const author = message.author || currentUser;
  const userToDisplay = author;

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function handleCreate({ payload, text }) {
    setIsSubmitting(true);

    let messageDiscussionId = discussionId;
    if (!messageDiscussionId) {
      const { discussionId: did } = await onCreateDiscussion();
      messageDiscussionId = did;
    }

    const { data } = await client.mutate({
      mutation: createMessageMutation,
      variables: {
        discussionId: messageDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
      refetchQueries: [
        {
          query: discussionQuery,
          variables: { id: messageDiscussionId, queryParams: {} },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (data.createMessage) {
      const { id } = data.createMessage;
      setIsSubmitting(false);
      track('New message posted', { messageId: id, messageDiscussionId });
      afterCreate(messageDiscussionId, false);

      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to create discussion message'));
  }

  async function handleUpdate({ payload, text }) {
    setIsSubmitting(true);

    const { data } = await client.mutate({
      mutation: updateMessageMutation,
      variables: {
        discussionId,
        messageId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (data.updateMessage) {
      setMessage(data.updateMessage);
      setIsSubmitting(false);
      setToDisplayMode();
      track('Message edited', { messageId, discussionId });
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to save discussion message'));
  }

  async function handleDelete() {
    const userChoice = window.confirm(
      'Are you sure you want to delete this message?'
    );
    if (!userChoice) return;

    client.mutate({
      mutation: deleteMessageMutation,
      variables: {
        discussionId,
        messageId,
      },
      update: cache => {
        const {
          discussion,
          messages: { pageToken, items, __typename, messageCount },
        } = cache.readQuery({
          query: discussionQuery,
          variables: { id: discussionId, queryParams: {} },
        });

        const index = items.findIndex(i => i.message.id === messageId);
        cache.writeQuery({
          query: discussionQuery,
          variables: { id: discussionId, queryParams: {} },
          data: {
            discussion,
            messages: {
              messageCount: messageCount - 1,
              pageToken,
              items: [...items.slice(0, index), ...items.slice(index + 1)],
              __typename,
            },
          },
        });
      },
    });
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

  return (
    <Container mode={mode} {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={userToDisplay}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode={mode}
        />
        {messageId && mode === 'display' && (
          <StyledHoverMenu
            discussionId={discussionId}
            isAuthor={isAuthor}
            isOpen={hover}
            messageId={messageId}
            onDelete={handleDelete}
            onEdit={setToEditMode}
          />
        )}
      </HeaderSection>
      <MessageEditor
        contentType="discussionMessage"
        initialHeight={160}
        initialValue={loadInitialContent()}
        isAuthor={isAuthor}
        isDraftSaved={!!draft}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={handleCancel}
        onDiscardDraft={handleDeleteDraft}
        onSaveDraft={handleSaveDraft}
        onSubmit={mode === 'compose' ? handleCreate : handleUpdate}
        resourceId={documentId}
      />
      {mode === 'display' && (
        <MessageReactions discussionId={discussionId} messageId={messageId} />
      )}
    </Container>
  );
};

DiscussionMessage.propTypes = {
  afterCreate: PropTypes.func,
  currentUser: PropTypes.object,
  discussionId: PropTypes.string,
  documentId: PropTypes.string,
  draft: PropTypes.object,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialMessage: PropTypes.object,
  onCancel: PropTypes.func,
  onCreateDiscussion: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  afterCreate: () => {},
  currentUser: null,
  discussionId: null,
  documentId: null,
  draft: null,
  initialMode: 'display',
  initialMessage: {},
  onCancel: () => {},
  onCreateDiscussion: () => {},
};

export default DiscussionMessage;
