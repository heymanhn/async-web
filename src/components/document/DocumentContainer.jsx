import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

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

const OuterContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const DocumentContainer = ({
  documentId,
  threadId: initialThreadId,
  viewMode: initialViewMode,
}) => {
  useUpdateSelectedResource(documentId);
  /*
   * We're initializing document editor in this top component to better provide
   * a reference to child components that are not desecendants of document Editable
   */
  const editor = useDocumentEditor(documentId);

  const [viewMode, setViewMode] = useState(initialViewMode);
  const [forceUpdate, setForceUpdate] = useState(false);
  const {
    threadId,
    handleShowThread,
    handleCloseThread,
    ...threadProps
  } = useThreadState(initialThreadId);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const { error, data } = useQuery(documentQuery, {
    variables: { documentId },
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return null;
  if (error || !data || !data.document) return <NotFound />;

  const { channelId, tags, workspaces } = data.document;
  const readOnly = isResourceReadOnly(tags);
  if (forceUpdate) setForceUpdate(false);

  const afterDeleteDocument = () => {
    let path = '/';
    if (workspaces && workspaces.length) {
      const [workspaceId] = workspaces;
      path = `/workspaces/${workspaceId}`;
    }

    navigate(path);
  };

  const value = {
    ...DEFAULT_DOCUMENT_CONTEXT,
    documentId,
    viewMode,
    channelId,
    readOnly,
    editor,

    afterDeleteDocument,
    setForceUpdate,
    setViewMode,
    handleShowThread,
  };

  return (
    <DocumentContext.Provider value={value}>
      <OuterContainer>
        <NavigationBar />
        {viewMode === 'content' && (
          <Document isUnread={isResourceUnread(tags)} />
        )}
        {viewMode === 'threads' && <ThreadsList />}

        {threadId && (
          <ThreadModal
            threadId={threadId}
            handleClose={handleCloseThread}
            {...threadProps}
          />
        )}
      </OuterContainer>
    </DocumentContext.Provider>
  );
};

DocumentContainer.propTypes = {
  documentId: PropTypes.string.isRequired,
  threadId: PropTypes.string,
  viewMode: PropTypes.oneOf(['content', 'threads']),
};

DocumentContainer.defaultProps = {
  threadId: null,
  viewMode: 'content',
};

export default DocumentContainer;
