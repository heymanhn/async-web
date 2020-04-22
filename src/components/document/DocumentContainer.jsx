import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';
import { isResourceUnread, isResourceReadOnly } from 'utils/helpers';

import useDocumentEditor from 'components/editor/hooks/useDocumentEditor';
import useUpdateSelectedResource from 'utils/hooks/useUpdateSelectedResource';

import NotFound from 'components/navigation/NotFound';
import DiscussionModal from 'components/discussion/DiscussionModal';
import NavigationBar from 'components/navigation/NavigationBar';
import Document from './Document';
import DiscussionsList from './DiscussionsList';

const DocumentContainer = ({
  documentId,
  discussionId: initialDiscussionId,
  viewMode: initialViewMode,
}) => {
  useUpdateSelectedResource(documentId);
  const editor = useDocumentEditor(documentId);

  // TODO (HN): Instead of all these different discussionId fields, suggest
  // implementing a state machine that transitions from
  // new => first_message => deleted
  const [state, setState] = useState({
    viewMode: initialViewMode,
    modalDiscussionId: initialDiscussionId,
    isModalOpen: !!initialDiscussionId,
    inlineDiscussionTopic: null,
    forceUpdate: false,
  });

  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));
  const resetInlineTopic = () =>
    setState(old => ({ ...old, inlineDiscussionTopic: null }));
  const setForceUpdate = fu => setState(old => ({ ...old, forceUpdate: fu }));

  useEffect(() => {
    setState(old => ({ ...old, viewMode: initialViewMode }));
  }, [initialViewMode]);

  useEffect(() => {
    setState(old => ({
      ...old,
      modalDiscussionId: initialDiscussionId,
      isModalOpen: !!initialDiscussionId,
    }));
  }, [initialDiscussionId]);

  const { error, data } = useQuery(documentQuery, {
    variables: { documentId },
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return null;
  if (error || !data.document) return <NotFound />;
  const { channelId, tags } = data.document;
  const readOnly = isResourceReadOnly(tags);

  const handleShowModal = (discussionId, content) => {
    const newState = {
      modalDiscussionId: discussionId,
      isModalOpen: true,
    };

    // For creating inline discussion context later on
    if (content) newState.inlineDiscussionTopic = content;

    setState(oldState => ({ ...oldState, ...newState }));
  };

  const handleCloseModal = () => {
    setState(oldState => ({
      ...oldState,
      modalDiscussionId: null,
      isModalOpen: false,
    }));
  };

  const {
    modalDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
    viewMode,
    forceUpdate,
  } = state;
  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    editor,
    documentId,
    isModalOpen,
    modalDiscussionId,
    inlineDiscussionTopic,
    viewMode,
    channelId,
    readOnly,

    setForceUpdate,
    setViewMode,
    resetInlineTopic,
    handleShowModal,
    handleCloseModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      <NavigationBar />
      {viewMode === 'content' && <Document isUnread={isResourceUnread(tags)} />}
      {viewMode === 'discussions' && <DiscussionsList />}

      {isModalOpen && (
        <DiscussionModal
          isOpen={isModalOpen}
          mode="document"
          editor={editor}
          handleClose={handleCloseModal}
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
