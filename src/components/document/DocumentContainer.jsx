import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import useThreadState from 'hooks/thread/useThreadState';
import useUpdateSelectedResource from 'hooks/resources/useUpdateSelectedResource';
import { DocumentContext, DEFAULT_DOCUMENT_CONTEXT } from 'utils/contexts';
import { isResourceUnread, isResourceReadOnly } from 'utils/helpers';

import NotFound from 'components/navigation/NotFound';
import ThreadModal from 'components/thread/ThreadModal';
import NavigationBar from 'components/navigation/NavigationBar';
import useDocumentEditor from 'hooks/document/useDocumentEditor';

import ThreadsList from './ThreadsList';
import Document from './Document';

const DocumentContainer = ({ documentId, threadId: initialThreadId }) => {
  useUpdateSelectedResource(documentId);
  /*
   * We're initializing document editor in this top component to better provide
   * a reference to child components that are not desecendants of document Editable
   */
  const editor = useDocumentEditor(documentId);

  const [viewMode, setViewMode] = useState('content');
  const [forceUpdate, setForceUpdate] = useState(false);
  const {
    threadId,
    handleShowThread,
    handleCloseThread,
    ...threadProps
  } = useThreadState(initialThreadId);

  const { error, data } = useQuery(documentQuery, {
    variables: { documentId },
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return null;
  if (error || !data || !data.document) return <NotFound />;

  const { channelId, tags } = data.document;
  const readOnly = isResourceReadOnly(tags);
  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    viewMode,
    channelId,
    readOnly,
    editor,

    setForceUpdate,
    setViewMode,
    handleShowThread,
  };

  return (
    <DocumentContext.Provider value={value}>
      <NavigationBar />
      {viewMode === 'content' && <Document isUnread={isResourceUnread(tags)} />}
      {viewMode === 'discussions' && <ThreadsList />}

      {threadId && (
        <ThreadModal
          threadId={threadId}
          handleClose={handleCloseThread}
          {...threadProps}
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
