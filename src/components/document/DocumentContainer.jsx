import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';

import DiscussionModal from 'components/discussion/DiscussionModal';
import HeaderBar from 'components/navigation/HeaderBar';
import Document from './Document';
import DiscussionsList from './DiscussionsList';

const DocumentContainer = ({
  documentId,
  discussionId: initialDiscussionId,
  viewMode: initialViewMode,
}) => {
  // TODO (HN): Instead of all these different discussionId fields, suggest
  // implementing a state machine that oscillates from
  // new => first_message => deleted
  const [state, setState] = useState({
    viewMode: initialViewMode,
    modalDiscussionId: initialDiscussionId,
    firstMsgDiscussionId: null,
    deletedDiscussionId: null,
    isModalOpen: !!initialDiscussionId,
    inlineDiscussionTopic: null,
  });

  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));
  const setFirstMsgDiscussionId = id =>
    setState(old => ({ ...old, firstMsgDiscussionId: id }));
  const setDeletedDiscussionId = id =>
    setState(old => ({ ...old, deletedDiscussionId: id }));
  const resetInlineTopic = () =>
    setState(old => ({ ...old, inlineDiscussionTopic: null }));

  useEffect(() => {
    setState(old => ({ ...old, viewMode: initialViewMode }));
  }, [initialViewMode]);

  const handleShowModal = (discussionId, selection, content) => {
    const newState = {
      modalDiscussionId: discussionId,
      isModalOpen: true,
    };

    // For creating inline discussion context later on
    if (selection && content)
      newState.inlineDiscussionTopic = {
        selection,
        content,
      };

    setState(oldState => ({ ...oldState, ...newState }));
  };

  const handleCloseModal = () => {
    setState(oldState => ({
      ...oldState,
      modalDiscussionId: null,
      inlineDiscussionTopic: null,
      isModalOpen: false,
    }));
  };

  const {
    modalDiscussionId,
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
    viewMode,
  } = state;

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    modalDiscussionId,
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,

    setFirstMsgDiscussionId,
    setDeletedDiscussionId,
    resetInlineTopic,
    handleShowModal,
    handleCloseModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      <HeaderBar setViewMode={setViewMode} viewMode={viewMode} />
      {viewMode === 'content' && <Document />}
      {viewMode === 'discussions' && <DiscussionsList />}

      {isModalOpen && (
        <DiscussionModal isOpen={isModalOpen} handleClose={handleCloseModal} />
      )}
    </DocumentContext.Provider>
  );
};

DocumentContainer.propTypes = {
  documentId: PropTypes.string.isRequired,
  discussionId: PropTypes.string,
  viewMode: PropTypes.oneOf(['content', 'discussions']),
};

DocumentContainer.defaultProps = {
  viewMode: 'content',
  discussionId: null,
};

export default DocumentContainer;
