import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import useDocumentTitlePusher from 'utils/hooks/useDocumentTitlePusher';
import useMountEffect from 'utils/hooks/useMountEffect';
import useViewedReaction from 'utils/hooks/useViewedReaction';
import { DocumentContext } from 'utils/contexts';

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

const Document = ({ isUnread }) => {
  const documentContext = useContext(DocumentContext);
  const { documentId } = documentContext;
  const { markAsRead } = useViewedReaction();
  const handleNewTitle = useDocumentTitlePusher();
  const [updatedTimestamp, setUpdatedTimestamp] = useState(null);

  useMountEffect(() => {
    return () => {
      markAsRead({
        isUnread,
        resourceType: 'document',
        resourceId: documentId,
      });
    };
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

  const afterUpdateTitle = newTitle => {
    setUpdatedTimestampToNow();
    handleNewTitle(newTitle);
  };

  // Extend the Document Context. We want to keep the updatedTimestamp defined
  // here instead of in the parent component.
  const value = {
    ...documentContext,
    afterUpdate: setUpdatedTimestampToNow,
    afterUpdateTitle,
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

Document.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default Document;
