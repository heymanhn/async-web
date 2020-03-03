import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { track } from 'utils/analytics';
import {
  DiscussionContext,
  DocumentContext,
  DEFAULT_DISCUSSION_CONTEXT,
} from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import Modal from 'components/shared/Modal';
import ContextComposer from './ContextComposer';
import DiscussionThread from './DiscussionThread';
import DiscussionMessage from './DiscussionMessage';
import ModalAddReplyBox from './ModalAddReplyBox';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'flex-start',
  background: colors.bgGrey,
}));

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  })
);

const DiscussionModal = ({ isOpen, handleClose, ...props }) => {
  const modalRef = useRef(null);
  const {
    documentId,
    modalDiscussionId,
    inlineDiscussionTopic,
    setDeletedDiscussionId,
    setFirstMsgDiscussionId,
    handleShowModal,
  } = useContext(DocumentContext);
  const [isComposing, setIsComposing] = useState(!modalDiscussionId);
  const [context, setContext] = useState(null);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  useMountEffect(() => {
    const title = modalDiscussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (modalDiscussionId) properties.discussionId = modalDiscussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);
  });

  useEffect(() => {
    const { origin } = window.location;
    const baseUrl = `${origin}/documents/${documentId}`;
    const setUrl = () => {
      const url = `${baseUrl}/discussions/${modalDiscussionId}`;
      return window.history.replaceState(
        {},
        `discussion: ${modalDiscussionId}`,
        url
      );
    };
    if (modalDiscussionId) setUrl();

    return () =>
      window.history.replaceState({}, `document: ${documentId}`, baseUrl);
  }, [documentId, modalDiscussionId]);

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: modalDiscussionId },
    skip: !modalDiscussionId,
  });

  if (loading) return null;

  let draft;
  let messageCount;
  if (data && data.discussion) {
    const { discussion } = data;
    ({ draft, messageCount } = discussion);

    const { topic } = discussion;
    if (!context && topic) setContext(JSON.parse(topic.payload));
  }

  if (draft && !isComposing) startComposing();

  const handleCancelCompose = () => {
    stopComposing();
    if (!modalDiscussionId) handleClose();
  };

  const isUnread = () => {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  };

  const handleCreateMessage = () => {
    stopComposing();

    /* The editor controller is in <DocumentComposer />. Setting the state
     * propagates the message down to the composer to delete the inline discussion.
     *
     * Only need to set this once, when the first message in the discussion
     * is created.
     */
    if (!messageCount) setFirstMsgDiscussionId(modalDiscussionId);
  };

  const afterDelete = () => {
    // The editor controller is in <DocumentComposer />. Setting the state
    // propagates the message down to the composer to delete the inline discussion
    setDeletedDiscussionId(modalDiscussionId);

    handleClose();
  };

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId: modalDiscussionId,
    context,
    draft,
    modalRef,

    setContext,
    afterCreate: id => handleShowModal(id),
    afterDelete,
  };

  return (
    <StyledModal
      ref={modalRef}
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      <DiscussionContext.Provider value={value}>
        {(inlineDiscussionTopic || context) && <ContextComposer />}
        {modalDiscussionId && <DiscussionThread isUnread={isUnread()} />}

        {/* Showing the message composer after the context is created
            ensures that it is in focus */}
        {isComposing && context ? (
          <StyledDiscussionMessage
            mode="compose"
            source="discussionModal"
            afterCreate={handleCreateMessage}
            handleCancel={handleCancelCompose}
            {...props}
          />
        ) : (
          <ModalAddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </DiscussionContext.Provider>
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DiscussionModal;
