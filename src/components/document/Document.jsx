import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import NotFound from 'components/navigation/NotFound';
import RovalEditor from 'components/editor/RovalEditor';
import HeaderBar from './HeaderBar';
import LastUpdatedIndicator from './LastUpdatedIndicator';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header is 54px tall
  padding: '0 30px',
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginTop: '60px',
  marginBottom: '15px',
  width: '100%',
  outline: 'none',
}));

const DocumentEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginBottom: '80px',
});

const Document = ({ documentId }) => {
  const [updatedTimestamp, setUpdatedTimestamp] = useState(null);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const { loading, error, data } = useQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, owner, title } = data.document;
  const { payload: contents } = body || {};

  // TODO: This will change later, when we introduce the concept of multiple co-authors
  const { userId } = getLocalUser();
  const isAuthor = userId === owner.id;

  async function handleUpdateTitle({ text }) {
    const { data: updateDocumentTitleData } = await updateDocument({
      variables: {
        documentId,
        input: {
          title: text,
        },
      },
      refetchQueries: [{
        query: documentQuery,
        variables: { id: documentId, queryParams: {} },
      }],
    });

    if (updateDocumentTitleData.updateDocument) {
      track('Document title updated', { documentId });
      setUpdatedTimestamp(Date.now());
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to update document title'));
  }

  async function handleUpdateBody({ payload, text }) {
    const { data: updateDocumentBodyData } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (updateDocumentBodyData.updateDocument) {
      setUpdatedTimestamp(Date.now());
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to save discussion message'));
  }

  return (
    <>
      <HeaderBar documentTitle={title} />
      <Container>
        <TitleEditor
          contentType="documentTitle"
          disableAutoFocus={!!title}
          initialValue={title}
          isPlainText
          mode={isAuthor ? 'compose' : 'display'}
          onSubmit={handleUpdateTitle}
          saveOnBlur
        />
        <DocumentEditor
          contentType="document"
          disableAutoFocus={!contents}
          initialValue={contents}
          isAuthor={isAuthor}
          mode={isAuthor ? 'compose' : 'display'}
          onSubmit={handleUpdateBody}
        />
        {updatedTimestamp && <LastUpdatedIndicator timestamp={updatedTimestamp} />}
      </Container>
    </>
  );
};

Document.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default Document;
