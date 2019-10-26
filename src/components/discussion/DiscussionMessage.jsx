/* eslint no-alert: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled/macro';

import addDraftToConversationMtn from 'graphql/mutations/local/addDraftToConversation';
import deleteDraftFromConversationMtn from 'graphql/mutations/local/deleteDraftFromConversation';
import addNewMessageToConversationMtn from 'graphql/mutations/local/addNewMessageToConversation';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import deleteConversationMutation from 'graphql/mutations/deleteConversation';
import meetingQuery from 'graphql/queries/meeting';
import conversationQuery from 'graphql/queries/conversation';
import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';
import { track } from 'utils/analytics';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 3px ${colors.grey7}`,
  cursor: 'default',
  marginBottom: '30px',
  padding: '20px 30px 20px',
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

const MessageEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginTop: '15px',

  // Spacing for the paragraphs
  // TODO (HN): Define these margins in a styled component for paragraph block types
  // Hint: use a plugin
  div: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
});

const DiscussionMessage = ({
  conversationId,
  currentUser,
  draft,
  forceDisableSubmit,
  initialMode,
  initialMessage,
  meetingId,
  onCancel,
  onCreateDiscussion,
  ...props
}) => {
  const client = useApolloClient();
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() { setMode('display'); }
  function setToEditMode() { setMode('edit'); }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [message, setMessage] = useState(initialMessage);
  const { createdAt, id: messageId, updatedAt, body } = message || {};
  const author = message.author || currentUser;
  const userToDisplay = author;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();
  const isAuthor = userId === author.id;

  async function handleSaveDraft({ payload, text }) {
    let draftConversationId = conversationId;
    if (!draftConversationId) {
      const { conversationId: cid } = await onCreateDiscussion();
      draftConversationId = cid;
    }

    const { data } = await client.mutate({
      mutation: createMessageDraftMutation,
      variables: {
        conversationId: draftConversationId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id: meetingId, queryParams: {} },
      }],
      update: (_cache, { data: { createMessageDraft } }) => {
        client.mutate({
          mutation: addDraftToConversationMtn,
          variables: {
            conversationId: draftConversationId,
            draft: createMessageDraft,
          },
        });
      },
    });

    if (data.createMessageDraft) return Promise.resolve();

    return Promise.reject(new Error('Failed to save message draft'));
  }

  async function handleDeleteDraft() {
    const { data } = await client.mutate({
      mutation: deleteMessageDraftMutation,
      variables: { conversationId },
    });

    if (data.deleteMessageDraft) {
      const { messages: { messageCount } } = client.readQuery({
        query: conversationQuery,
        variables: { id: conversationId, queryParams: {} },
      });

      if (!messageCount) {
        await client.mutate({
          mutation: deleteConversationMutation,
          variables: { conversationId, meetingId },
          refetchQueries: [{
            query: meetingQuery,
            variables: { id: meetingId, queryParams: {} },
          }],
          awaitRefetchQueries: true,
        });
      } else {
        client.mutate({
          mutation: deleteDraftFromConversationMtn,
          variables: { conversationId },
        });
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete message draft'));
  }

  async function handleCreate({ payload, text }) {
    setIsSubmitting(true);

    if (!conversationId) return onCreateDiscussion({ payload, text });

    const { data } = await client.mutate({
      mutation: createMessageMutation,
      variables: {
        conversationId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id: meetingId, queryParams: {} },
      }],
      update: (_cache, { data: { createMessage } }) => {
        client.mutate({
          mutation: addNewMessageToConversationMtn,
          variables: {
            isUnread: false,
            message: createMessage,
          },
        });
      },
    });

    if (data.createMessage) {
      const { id } = data.createMessage;
      setIsSubmitting(false);
      track('New message posted', { messageId: id, discussionId: conversationId });

      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to create discussion message'));
  }

  async function handleUpdate({ payload, text }) {
    setIsSubmitting(true);

    const { data } = await client.mutate({
      mutation: updateMessageMutation,
      variables: {
        conversationId,
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
      track('Message edited', { messageId, discussionId: conversationId });
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to save discussion message'));
  }

  async function handleDelete() {
    const userChoice = window.confirm('Are you sure you want to delete this message?');
    if (!userChoice) return;

    client.mutate({
      mutation: deleteMessageMutation,
      variables: {
        conversationId,
        messageId,
      },
      update: (cache) => {
        const {
          conversation,
          messages: { pageToken, items, __typename, messageCount },
        } = cache.readQuery({
          query: conversationQuery,
          variables: { id: conversationId, queryParams: {} },
        });

        const index = items.findIndex(i => i.message.id === messageId);
        cache.writeQuery({
          query: conversationQuery,
          variables: { id: conversationId, queryParams: {} },
          data: {
            conversation,
            messages: {
              messageCount: messageCount - 1,
              pageToken,
              items: [
                ...items.slice(0, index),
                ...items.slice(index + 1),
              ],
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
    <Container {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={userToDisplay}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode={mode}
        />
        {messageId && mode === 'display' && (
          <StyledHoverMenu
            conversationId={conversationId}
            isAuthor={isAuthor}
            isOpen={hover}
            messageId={messageId}
            onDelete={handleDelete}
            onEdit={setToEditMode}
          />
        )}
      </HeaderSection>
      <MessageEditor
        disableAutoFocus={mode === 'compose' && !conversationId}
        forceDisableSubmit={forceDisableSubmit}
        initialHeight={240} // Give Arun more breathing room :-)
        initialValue={loadInitialContent()}
        isAuthor={isAuthor}
        isDraftSaved={!!draft}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={handleCancel}
        onDiscardDraft={handleDeleteDraft}
        onSaveDraft={handleSaveDraft}
        onSubmit={mode === 'compose' ? handleCreate : handleUpdate}
        contentType={conversationId ? 'message' : 'discussion'}
      />
      {mode === 'display' && (
        <MessageReactions conversationId={conversationId} messageId={messageId} />
      )}
    </Container>
  );
};

DiscussionMessage.propTypes = {
  conversationId: PropTypes.string,
  currentUser: PropTypes.object,
  draft: PropTypes.object,
  forceDisableSubmit: PropTypes.bool,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialMessage: PropTypes.object,
  meetingId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreateDiscussion: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  conversationId: null,
  currentUser: null,
  draft: null,
  forceDisableSubmit: false,
  initialMode: 'display',
  initialMessage: {},
  meetingId: null,
  onCancel: () => {},
  onCreateDiscussion: () => {},
};

export default DiscussionMessage;
