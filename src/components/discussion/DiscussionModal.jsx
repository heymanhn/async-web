import React, { useContext, useState } from 'react';
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

// SLATE UPGRADE TODO
// import { CONTEXT_HIGHLIGHT } from 'components/editor/plugins/inlineDiscussion';
import Modal from 'components/shared/Modal';
import ContextComposer from './ContextComposer';
import DiscussionThread from './DiscussionThread';
import DiscussionMessage from './DiscussionMessage';
import ModalAddReplyBox from './ModalAddReplyBox';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'center',
  padding: '25px 25px',
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

/*
 * SLATE UPGRADE TODO:
 * - Create the discussion context properly with the new Slate API
 * - Pass discussion context into DocumentContext for child components
 * - Create annotation in the document after discussion created
 */

const DiscussionModal = ({ isOpen, handleClose, ...props }) => {
  const {
    documentId,
    modalDiscussionId,
    inlineDiscussionTopic,
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

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: modalDiscussionId, queryParams: {} },
    skip: !modalDiscussionId,
  });

  if (loading) return null;

  let draft;
  if (data && data.discussion) {
    const { discussion } = data;
    ({ draft } = discussion);
    const { topic } = discussion;
    if (!context) setContext(topic);
  }

  if (draft && !isComposing) startComposing();
  // SLATE UPGRADE TODO
  // createAnnotation(value);

  // Update the URL in the address bar to reflect the new discussion
  // TODO (HN): Fix this implementation this later.
  //
  // const { origin } = window.location;
  // const url = `${origin}/discussions/${value}`;
  // return window.history.replaceState({}, `discussion: ${value}`, url);
  // }

  function handleCancelCompose() {
    stopComposing();
    if (!modalDiscussionId) handleClose();
  }

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  }

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId: modalDiscussionId,
    context,
    draft,

    setContext,
    afterCreate: id => handleShowModal(id),
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen} {...props}>
      <DiscussionContext.Provider value={value}>
        {(inlineDiscussionTopic || context) && <ContextComposer />}
        {modalDiscussionId && <DiscussionThread isUnread={isUnread()} />}
        {isComposing ? (
          <StyledDiscussionMessage
            mode="compose"
            source="discussionModal"
            afterCreate={stopComposing}
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
  // SLATE UPGRADE TODO
  // createAnnotation: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DiscussionModal;
