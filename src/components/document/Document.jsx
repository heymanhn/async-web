import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import useDocumentTitlePusher from 'hooks/document/useDocumentTitlePusher';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import { DocumentContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LastUpdatedIndicator from './LastUpdatedIndicator';
import TitleEditor from './TitleEditor';
import DocumentEditor from './DocumentEditor';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header bar is 54px tall
  padding: '0 30px',
}));

const Document = ({ isUnread }) => {
  const documentContext = useContext(DocumentContext);
  const { documentId } = documentContext;
  const markAsRead = useMarkResourceAsRead();
  const handleNewTitle = useDocumentTitlePusher();
  const [updatedTimestamp, setUpdatedTimestamp] = useState(null);

  useMountEffect(() => {
    if (isUnread) markAsRead();
  });

  const { loading, error, data } = useQuery(documentQuery, {
    variables: { documentId },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt } = data.document;
  const { payload: content } = body || {};

  // Initialize the state here
  if (!updatedTimestamp && updatedAt) setUpdatedTimestamp(updatedAt * 1000);
  const setUpdatedTimestampToNow = () => setUpdatedTimestamp(Date.now());

  const afterUpdateDocumentTitle = newTitle => {
    setUpdatedTimestampToNow();
    handleNewTitle(newTitle);
  };

  // Extend the Document Context. We want to keep the updatedTimestamp defined
  // here instead of in the parent component.
  const value = {
    ...documentContext,
    afterUpdateDocument: setUpdatedTimestampToNow,
    afterUpdateDocumentTitle,
  };

  return (
    <Container>
      <DocumentContext.Provider value={value}>
        <TitleEditor autoFocus={!title && !content} initialTitle={title} />
        <DocumentEditor initialContent={content} />
      </DocumentContext.Provider>
      {updatedTimestamp && (
        <LastUpdatedIndicator timestamp={updatedTimestamp} />
      )}
    </Container>
  );
};

Document.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default Document;
