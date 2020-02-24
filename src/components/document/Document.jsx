import React, { useContext, useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import { DocumentContext } from 'utils/contexts';
import { matchCurrentUserId } from 'utils/auth';
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
  minHeight: 'calc(100vh - 54px)', // Header is 54px tall
  padding: '0 30px',
}));

const Document = () => {
  const { documentId } = useContext(DocumentContext);
  const { markAsRead } = useViewedReaction();

  const [updatedTimestamp, setUpdatedTimestamp] = useState(null);

  const { loading, error, data } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt, reactions } = data.document;
  const { payload: content } = body || {};

  function hasCurrentUserViewed() {
    return !!(reactions || []).find(
      r => r.code === 'viewed' && matchCurrentUserId(r.author.id)
    );
  }

  if (!hasCurrentUserViewed()) {
    markAsRead({
      isUnread: true,
      resourceType: 'document',
      resourceId: documentId,
    });
  }

  // Initialize the state here
  if (!updatedTimestamp && updatedAt) setUpdatedTimestamp(updatedAt * 1000);
  const setUpdatedTimestampToNow = () => setUpdatedTimestamp(Date.now());

  return (
    <Container>
      <TitleComposer
        afterUpdate={setUpdatedTimestampToNow}
        autoFocus={!title && !content}
        initialTitle={title}
      />
      <DocumentComposer
        afterUpdate={setUpdatedTimestampToNow}
        initialContent={content}
      />
      {updatedTimestamp && (
        <LastUpdatedIndicator timestamp={updatedTimestamp} />
      )}
    </Container>
  );
};

export default Document;
