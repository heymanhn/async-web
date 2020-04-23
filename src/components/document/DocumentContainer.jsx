import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import useUpdateSelectedResource from 'hooks/resources/useUpdateSelectedResource';
import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';
import { isResourceUnread, isResourceReadOnly } from 'utils/helpers';

import NotFound from 'components/navigation/NotFound';
import ThreadModal from 'components/thread/ThreadModal';
import NavigationBar from 'components/navigation/NavigationBar';

import DiscussionsList from './DiscussionsList';
import Document from './Document';

const DocumentContainer = ({ documentId, threadId: initialThreadId }) => {
  useUpdateSelectedResource(documentId);

  const [state, setState] = useState({
    viewMode: 'content',
    threadId: initialThreadId,
    initialThreadContext: null,
    forceUpdate: false,
  });

  const setViewMode = vm => setState(old => ({ ...old, viewMode: vm }));
  const setForceUpdate = fu => setState(old => ({ ...old, forceUpdate: fu }));

  useEffect(() => {
    setState(old => ({ ...old, threadId: initialThreadId }));
  }, [initialThreadId]);

  const { error, data } = useQuery(documentQuery, {
    variables: { documentId },
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return null;
  if (error || !data.document) return <NotFound />;
  const { channelId, tags } = data.document;
  const readOnly = isResourceReadOnly(tags);

  // TODO (DISCUSSION V2): Move this to a useThreadState hook.
  const handleShowThread = ({
    sourceEditor = null, // So that the thread can update/remove the annotation
    threadId,
    initialThreadContext = null,
  }) => {
    setState(oldState => ({
      ...oldState,
      threadId,
      initialThreadContext,
    }));
  };

  const handleCloseThread = () => {
    setState(oldState => ({
      ...oldState,
      threadId: null,
      initialThreadContext: null,
    }));
  };

  const { threadId, initialThreadContext, viewMode, forceUpdate } = state;
  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    threadId,
    initialThreadContext,
    viewMode,
    channelId,
    readOnly,

    setForceUpdate,
    setViewMode,
    handleShowThread,
    handleCloseThread,
  };

  return (
    <DocumentContext.Provider value={value}>
      <NavigationBar />
      {viewMode === 'content' && <Document isUnread={isResourceUnread(tags)} />}
      {viewMode === 'discussions' && <DiscussionsList />}

      {threadId && (
        <ThreadModal
          isOpen={!!threadId}
          mode="document"
          editor={null} // TODO (DISCUSSION V2): Get this from useThreadState
          handleClose={handleCloseThread}
        />
      )}
    </DocumentContext.Provider>
  );
};

DocumentContainer.propTypes = {
  documentId: PropTypes.string.isRequired,
  threadId: PropTypes.string,
};

DocumentContainer.defaultProps = {
  threadId: null,
};

export default DocumentContainer;
