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
import AddReplyBox from './AddReplyBox';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'flex-start',
  background: colors.bgGrey,
}));

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    paddingBottom: '25px',
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

  const { data } = useQuery(discussionQuery, {
    variables: { discussionId: modalDiscussionId },
    skip: !modalDiscussionId,
  });

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
    if (!data) return false;

    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  };

  const handleCreateMessage = newDiscussionId => {
    stopComposing();

    /* The editor controller is in <DocumentComposer />. Setting the state
     * propagates the message down to the composer to delete the inline discussion.
     *
     * Only need to set this once, when the first message in the discussion
     * is created.
     */
    if (!messageCount) setFirstMsgDiscussionId(newDiscussionId);
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
    isModal: true,

    setContext,
    afterCreate: id => handleShowModal(id),
    afterDelete,
  };

  /* Three conditions when ready to show the composer:
   * 1. Inline discussion and the context has been created. This ensures the
   *    composer is in focus when it's rendered.
   * 2. General discussion. There won't be a topic to create context for.
   * 3. Subsequent messages to a discussion. Also won't be a topic present.
   */
  const readyToCompose = isComposing && (!inlineDiscussionTopic || context);

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
        {readyToCompose ? (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={handleCreateMessage}
            handleCancel={handleCancelCompose}
            {...props}
          />
        ) : (
          <AddReplyBox
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
