import React, { useContext } from 'react';
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
  justifyContent: 'center', // the new document state is vertically centered
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header bar is 54px tall
}));

const Document = ({ isUnread }) => {
  const documentContext = useContext(DocumentContext);
  const { documentId } = documentContext;
  const markAsRead = useMarkResourceAsRead();
  const handleNewTitle = useDocumentTitlePusher();

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

  const value = {
    ...documentContext,
    afterUpdateDocumentTitle: handleNewTitle,
  };

  return (
    <Container>
      <DocumentContext.Provider value={value}>
        <TitleEditor autoFocus={!title && !content} initialTitle={title} />
        <DocumentEditor initialContent={content} />
      </DocumentContext.Provider>
      {updatedAt && <LastUpdatedIndicator timestamp={updatedAt} />}
    </Container>
  );
};

Document.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default Document;
