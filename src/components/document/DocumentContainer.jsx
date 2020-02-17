import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';

import DiscussionModal from 'components/discussion/DiscussionModal';
import HeaderBar from 'components/navigation/HeaderBar';
import Document from './Document';
import DiscussionsList from './DiscussionsList';

/*
 * SLATE UPGRADE TODO:
 */

const DocumentContainer = ({
  documentId,
  discussionId: initialDiscussionId,
  viewMode: initialViewMode,
}) => {
  const [state, setState] = useState({
    viewMode: initialViewMode,
    modalDiscussionId: initialDiscussionId,
    isModalOpen: !!initialDiscussionId,
    inlineDiscussionTopic: null,
  });
  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));

  function handleShowModal(discussionId, selection, content) {
    const newState = {
      modalDiscussionId: discussionId,
      isModalOpen: true,
    };

    // For creating inline discussion context later on
    if (selection && content)
      newState.inlineDiscussionTopic = {
        selection,
        content,

        // This is set once an inline annotation is added to the document
        annotation: false,
      };

    setState(oldState => ({
      ...oldState,
      ...newState,
    }));
  }

  function handleCloseModal() {
    setState(oldState => ({
      ...oldState,
      modalDiscussionId: null,
      inlineDiscussionTopic: null,
      isModalOpen: false,
    }));
  }

  const {
    modalDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
    viewMode,
  } = state;

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    modalDiscussionId,
    inlineDiscussionTopic,
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

/* SLATE UPGRADE TODO: implement this
// TODO: This will change later, when we introduce the concept of multiple co-authors
const { userId } = getLocalUser();
const isAuthor = userId === owner.id;

function createAnnotation(value, authorId) {
  const { documentEditor, selection } = state;
  const { start, end } = selection;

  documentEditor.withoutSaving(() => {
    documentEditor
      .moveTo(start.key, start.offset)
      .moveEndTo(end.key, end.offset)
      .addMark({
        type: 'inline-discussion',
        data: {
          discussionId: value,
          authorId,
        },
      });
  });
}
*/
