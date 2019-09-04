/* eslint no-alert: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled/macro';

import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import conversationQuery from 'graphql/queries/conversation';
import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';

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
  padding: '20px 30px 25px',
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

  // HN: opportunity to DRY these up later once we find a pattern of typography
  // across different editor use cases
  'div:not(:first-of-type)': {
    marginTop: '1em',
  },

  h1: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '1.4em',
  },

  h2: {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '1.3em',
  },

  h3: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '1.2em',
  },
});

const DiscussionMessage = ({
  conversationId,
  currentUser,
  initialMode,
  initialMessage,
  onCancel,
  ...props
}) => {
  const client = useApolloClient();
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() { setMode('display'); }
  function setToEditMode() { setMode('edit'); }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [message, setMessage] = useState(initialMessage);
  const { author, createdAt, id: messageId, updatedAt, body } = message || {};
  const userToDisplay = author || currentUser;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  // FUTURE: Handle case of creating a new discussion
  async function handleCreate({ payload, text }) {
    setIsSubmitting(true);

    if (!conversationId) {
      console.log('TODO: creating new conversation...');
    }

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
      update: (cache, { data: { createMessage } }) => {
        const {
          conversation,
          messages: { pageToken, items, __typename, messageCount },
        } = cache.readQuery({
          query: conversationQuery,
          variables: { id: conversationId },
        });

        cache.writeQuery({
          query: conversationQuery,
          variables: { id: conversationId },
          data: {
            conversation,
            messages: {
              messageCount: messageCount + 1,
              pageToken,
              items: [
                ...items,
                {
                  __typename: items[0].__typename,
                  message: createMessage,
                },
              ],
              __typename,
            },
          },
        });
      },
    });

    if (data.createMessage) {
      setIsSubmitting(false);
      return Promise.resolve();
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
      return Promise.resolve();
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
          variables: { id: conversationId },
        });

        const index = items.findIndex(i => i.message.id === messageId);
        cache.writeQuery({
          query: conversationQuery,
          variables: { id: conversationId },
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

  return (
    <Container {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={userToDisplay}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode={mode}
        />
        {messageId && (
          <StyledHoverMenu
            conversationId={conversationId}
            isAuthor={userId === author.id}
            isOpen={hover}
            messageId={messageId}
            onDelete={handleDelete}
            onEdit={setToEditMode}
          />
        )}
      </HeaderSection>
      <MessageEditor
        initialValue={mode !== 'compose' ? body.payload : null}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={handleCancel}
        onSubmit={mode === 'compose' ? handleCreate : handleUpdate}
        contentType="message"
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
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialMessage: PropTypes.object,
  onCancel: PropTypes.func,
};

DiscussionMessage.defaultProps = {
  conversationId: null,
  currentUser: null,
  initialMode: 'display',
  initialMessage: {},
  onCancel: () => {},
};

export default DiscussionMessage;
