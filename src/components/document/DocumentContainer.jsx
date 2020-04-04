import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';
import useUpdateSelectedResource from 'utils/hooks/useUpdateSelectedResource';
import documentQuery from 'graphql/queries/document';

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

  // TODO (HN): Instead of all these different discussionId fields, suggest
  // implementing a state machine that transitions from
  // new => first_message => deleted
  const [state, setState] = useState({
    viewMode: initialViewMode,
    modalDiscussionId: initialDiscussionId,
    firstMsgDiscussionId: null,
    deletedDiscussionId: null,
    isModalOpen: !!initialDiscussionId,
    inlineDiscussionTopic: null,
    forceUpdate: false,
  });

  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));
  const setFirstMsgDiscussionId = id =>
    setState(old => ({ ...old, firstMsgDiscussionId: id }));
  const setDeletedDiscussionId = id =>
    setState(old => ({ ...old, deletedDiscussionId: id }));
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

  const { loading, error, data } = useQuery(documentQuery, {
    variables: { documentId },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;
  const { channelId, tags } = data.document;

  const isUnread = () => {
    const safeTags = tags || [];
    return (
      safeTags.includes('new_discussions') || safeTags.includes('new_document')
    );
  };

  const handleShowModal = (discussionId, contextHighlightId, content) => {
    const newState = {
      modalDiscussionId: discussionId,
      isModalOpen: true,
    };

    // For creating inline discussion context later on
    if (contextHighlightId && content)
      newState.inlineDiscussionTopic = {
        contextHighlightId,
        content,
      };

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
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
    viewMode,
    forceUpdate,
  } = state;
  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    isModalOpen,
    modalDiscussionId,
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    viewMode,
    channelId,

    setFirstMsgDiscussionId,
    setDeletedDiscussionId,
    setForceUpdate,
    setViewMode,
    resetInlineTopic,
    handleShowModal,
    handleCloseModal,
  };

  return (
    <DocumentContext.Provider value={value}>
      <NavigationBar />
      {viewMode === 'content' && <Document isUnread={isUnread()} />}
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
