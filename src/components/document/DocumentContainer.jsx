import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { DocumentContext } from 'utils/contexts';

import DiscussionModal from 'components/discussion/DiscussionModal';
import HeaderBar from './HeaderBar';
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
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [modalDiscussionId, setModalDiscussionId] = useState(
    initialDiscussionId
  );
  const [isModalOpen, setIsModalOpen] = useState(!!modalDiscussionId);

  // SLATE UPGRADE TODO: Invoke this method in the selection toolbar icon
  function handleShowModal(discussionId) {
    setModalDiscussionId(discussionId);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setModalDiscussionId(null);
    setIsModalOpen(false);
  }

  const value = {
    documentId,
    modalDiscussionId,
    handleShowModal,
    handleCloseModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      <HeaderBar setViewMode={setViewMode} viewMode={viewMode} />
      {viewMode === 'content' && <Document />}
      {viewMode === 'discussions' && <DiscussionsList />}

      {isModalOpen && (
        <DiscussionModal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          // createAnnotation={createAnnotation}
          // documentEditor={documentEditor}
          // selection={selection}
        />
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
