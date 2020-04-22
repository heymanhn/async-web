import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
// import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
// import { track } from 'utils/analytics';
import { DiscussionContext, DocumentContext } from 'utils/contexts';
// import useMountEffect from 'utils/hooks/useMountEffect';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';
import { isResourceUnread } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import ContextComposer from './ContextComposer';
import DiscussionThread from './DiscussionThread';
import DiscussionMessage from './DiscussionMessage';
import AddReplyBox from './AddReplyBox';

const ESCAPE_HOTKEY = 'Escape';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'flex-start',
  background: colors.bgGrey,
}));

const StyledContextComposer = styled(ContextComposer)({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
});

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    paddingBottom: '25px',
  })
);

const DiscussionModal = ({ isOpen, mode, handleClose, ...props }) => {
  const modalRef = useRef(null);
  const {
    modalDiscussionId,
    inlineDiscussionTopic,
    setDeletedDiscussionId,
    setFirstMsgDiscussionId,
    handleShowModal,
  } = useContext(mode === 'document' ? DocumentContext : DiscussionContext);
  const discContext = useContext(DiscussionContext);
  const [isComposing, setIsComposing] = useState(!modalDiscussionId);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  // TODO (DISCUSSION V2): Clean this up
  // useMountEffect(() => {
  //   track('Discussion viewed', { discussionId: modalDiscussionId, documentId });
  // });

  // TODO (DISCUSSION V2): Support proper URLs later
  // useEffect(() => {
  //   const { origin } = window.location;
  //   const baseUrl = `${origin}/documents/${documentId}`;
  //   const setUrl = () => {
  //     const url = `${baseUrl}/discussions/${modalDiscussionId}`;
  //     return window.history.replaceState(
  //       {},
  //       `discussion: ${modalDiscussionId}`,
  //       url
  //     );
  //   };
  //   if (modalDiscussionId) setUrl();

  //   // Triggering a navigation so that the discussionId prop can be reset in
  //   // the parent <DocumentContainer /> component.
  //   return () => navigate(baseUrl);
  // }, [documentId, discussionId, modalDiscussionId]);

  useKeyDownHandler([ESCAPE_HOTKEY, () => !isComposing && handleClose()]);

  const { data } = useQuery(discussionQuery, {
    variables: { discussionId: modalDiscussionId },
  });

  if (!data || !data.discussion) return null;

  const { draft, messageCount, topic, tags } = data.discussion;
  if (draft && !isComposing) startComposing();

  const handleCancelCompose = () => {
    stopComposing();
    if (!modalDiscussionId) handleClose();
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
    ...discContext,
    discussionId: modalDiscussionId,
    topic,
    draft,
    modalRef,
    isModal: true,

    afterCreate: id => handleShowModal(id),
    afterDelete,
  };

  /* Three conditions when ready to show the composer:
   * 1. Inline discussion and the context has been created. This ensures the
   *    composer is in focus when it's rendered.
   * 2. General discussion. There won't be a topic to create context for.
   * 3. Subsequent messages to a discussion. Also won't be a topic present.
   */
  const readyToCompose = isComposing && (!inlineDiscussionTopic || topic);
  const isComposingFirstMsg = isComposing && !messageCount;

  return (
    <StyledModal
      ref={modalRef}
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      <DiscussionContext.Provider value={value}>
        {(inlineDiscussionTopic || topic) && <StyledContextComposer />}
        {modalDiscussionId && (
          <DiscussionThread
            isComposingFirstMsg={isComposingFirstMsg}
            isUnread={isResourceUnread(tags)}
          />
        )}
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
  mode: PropTypes.oneOf(['document', 'discussion']).isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DiscussionModal;
