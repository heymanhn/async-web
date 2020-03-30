import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import { DocumentContext } from 'utils/contexts';
import useViewedReaction from 'utils/hooks/useViewedReaction';

import NotFound from 'components/navigation/NotFound';
import LastUpdatedIndicator from './LastUpdatedIndicator';
import TitleComposer from './TitleComposer';
import DocumentComposer from './DocumentComposer';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header bar is 54px tall
  padding: '0 30px',
}));

const Document = () => {
  const documentContext = useContext(DocumentContext);
  const { documentId } = documentContext;
  const { markAsRead } = useViewedReaction();

  const [updatedTimestamp, setUpdatedTimestamp] = useState(null);

  const { loading, error, data } = useQuery(documentQuery, {
    variables: { documentId },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt } = data.document;
  const { payload: content } = body || {};

  markAsRead({
    isUnread: true,
    resourceType: 'document',
    resourceId: documentId,
  });

  // Initialize the state here
  if (!updatedTimestamp && updatedAt) setUpdatedTimestamp(updatedAt * 1000);
  const setUpdatedTimestampToNow = () => setUpdatedTimestamp(Date.now());

  // Extend the Document Context. We want to keep the updatedTimestamp defined
  // here instead of in the parent component.
  const value = {
    ...documentContext,
    afterUpdate: setUpdatedTimestampToNow,
  };

  return (
    <Container>
      <DocumentContext.Provider value={value}>
        <TitleComposer autoFocus={!title && !content} initialTitle={title} />
        <DocumentComposer initialContent={content} />
      </DocumentContext.Provider>
      {updatedTimestamp && (
        <LastUpdatedIndicator timestamp={updatedTimestamp} />
      )}
    </Container>
  );
};

export default Document;
