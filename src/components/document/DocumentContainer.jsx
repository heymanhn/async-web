import React, { useState } from 'react';
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
  const [state, setState] = useState({
    viewMode: initialViewMode,
    modalDiscussionId: initialDiscussionId,
    deletedDiscussionId: null,
    isModalOpen: !!initialDiscussionId,
    inlineDiscussionTopic: null,
  });

  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));
  const setDeletedDiscussionId = id =>
    setState(old => ({ ...old, deletedDiscussionId: id }));
  const resetInlineTopic = () =>
    setState(old => ({ ...old, inlineDiscussionTopic: null }));

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
    deletedDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
    viewMode,
  } = state;

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    modalDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,

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
