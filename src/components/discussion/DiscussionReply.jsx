/* eslint no-alert: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled';

import addDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import deleteDraftFromDiscussionMtn from 'graphql/mutations/local/deleteDraftFromDiscussion';
import addNewReplyToDiscussionMtn from 'graphql/mutations/local/addNewReplyToDiscussion';
import createReplyMutation from 'graphql/mutations/createReply';
import updateReplyMutation from 'graphql/mutations/updateReply';
import deleteReplyMutation from 'graphql/mutations/deleteReply';
import createReplyDraftMutation from 'graphql/mutations/createReplyDraft';
import deleteReplyDraftMutation from 'graphql/mutations/deleteReplyDraft';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';
import useHover from 'utils/hooks/useHover';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';
import HoverMenu from './HoverMenu';

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
const ReplyEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginTop: '15px',
});

const DiscussionReply = ({
  afterCreate,
  currentUser,
  discussionId,
  documentId,
  draft,
  initialMode,
  initialReply,
  onCancel,
  onCreateDiscussion,
  ...props
}) => {
  const client = useApolloClient();
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() { setMode('display'); }
  function setToEditMode() { setMode('edit'); }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [reply, setReply] = useState(initialReply);
  const { createdAt, id: replyId, updatedAt, body } = reply || {};
  const author = reply.author || currentUser;
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
      mutation: createReplyDraftMutation,
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
      update: (_cache, { data: { createReplyDraft } }) => {
        client.mutate({
          mutation: addDraftToDiscussionMtn,
          variables: {
            discussionId: draftDiscussionId,
            draft: createReplyDraft,
          },
        });
      },
    });

    if (data.createReplyDraft) {
      afterCreate(draftDiscussionId, userId, true);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save reply draft'));
  }

  async function handleDeleteDraft() {
    const { data } = await client.mutate({
      mutation: deleteReplyDraftMutation,
      variables: { discussionId },
    });

    if (data.deleteReplyDraft) {
      const { replies: { replyCount } } = client.readQuery({
        query: discussionQuery,
        variables: { id: discussionId, queryParams: {} },
      });

      if (!replyCount) {
        await client.mutate({
          mutation: deleteDiscussionMutation,
          variables: { discussionId, documentId },
          refetchQueries: [{
            query: documentQuery,
            variables: { id: documentId, queryParams: {} },
          }],
          awaitRefetchQueries: true,
        });
      } else {
        client.mutate({
          mutation: deleteDraftFromDiscussionMtn,
          variables: { discussionId },
        });
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete reply draft'));
  }

  async function handleCreate({ payload, text }) {
    setIsSubmitting(true);

    let replyDiscussionId = discussionId;
    if (!replyDiscussionId) {
      const { discussionId: did } = await onCreateDiscussion();
      replyDiscussionId = did;
    }

    const { data } = await client.mutate({
      mutation: createReplyMutation,
      variables: {
        discussionId: replyDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
      refetchQueries: [{
        query: discussionQuery,
        variables: { id: discussionId, queryParams: {} },
      }],
      update: (_cache, { data: { createReply } }) => {
        client.mutate({
          mutation: addNewReplyToDiscussionMtn,
          variables: {
            isUnread: false,
            reply: createReply,
          },
        });
      },
    });

    if (data.createReply) {
      const { id } = data.createReply;
      setIsSubmitting(false);
      track('New reply posted', { replyId: id, discussionId });
      afterCreate(replyDiscussionId, userId);

      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to create discussion reply'));
  }

  async function handleUpdate({ payload, text }) {
    setIsSubmitting(true);

    const { data } = await client.mutate({
      mutation: updateReplyMutation,
      variables: {
        discussionId,
        replyId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (data.updateReply) {
      setReply(data.updateReply);
      setIsSubmitting(false);
      track('Reply edited', { replyId, discussionId });
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to save discussion reply'));
  }

  async function handleDelete() {
    const userChoice = window.confirm('Are you sure you want to delete this reply?');
    if (!userChoice) return;

    client.mutate({
      mutation: deleteReplyMutation,
      variables: {
        discussionId,
        replyId,
      },
      update: (cache) => {
        const {
          discussion,
          replies: { pageToken, items, __typename, replyCount },
        } = cache.readQuery({
          query: discussionQuery,
          variables: { id: discussionId, queryParams: {} },
        });

        const index = items.findIndex(i => i.reply.id === replyId);
        cache.writeQuery({
          query: discussionQuery,
          variables: { id: discussionId, queryParams: {} },
          data: {
            discussion,
            replies: {
              replyCount: replyCount - 1,
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
    <Container mode={mode} {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={userToDisplay}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode={mode}
        />
        {replyId && mode === 'display' && (
          <StyledHoverMenu
            discussionId={discussionId}
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
    </Container>
  );
};

DiscussionReply.propTypes = {
  afterCreate: PropTypes.func,
  currentUser: PropTypes.object.isRequired,
  discussionId: PropTypes.string,
  documentId: PropTypes.string.isRequired,
  draft: PropTypes.object,
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialReply: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onCreateDiscussion: PropTypes.func.isRequired,
};

DiscussionReply.defaultProps = {
  afterCreate: () => {},
  discussionId: null,
  draft: null,
  initialMode: 'display',
  initialReply: {},
};

export default DiscussionReply;
