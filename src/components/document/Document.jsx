import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import { getLocalUser } from 'utils/auth';

import NotFound from 'components/navigation/NotFound';
import RovalEditor from 'components/editor/RovalEditor';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: discussionViewport,
  padding: '0 30px',
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  margin: '60px 30px 40px',
  width: '100%',
  outline: 'none',
}));

const DocumentEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,

  // Spacing for the paragraphs
  // TODO (HN): Define these margins in a styled component for paragraph block types
  // Hint: use a plugin
  div: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
  },
});

const Document = ({ documentId }) => {
  const { loading, error, data } = useQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, owner, title } = data.document;
  const { payload } = body || {};

  // TODO: This will change later, when we introduce the concept of multiple co-authors
  const { userId } = getLocalUser();
  const isAuthor = userId === owner.id;

  return (
    <Container>
      <TitleEditor
        contentType="documentTitle"
        disableAutoFocus={false} // TODO: Enable this when hooking up with real data
        initialValue={title}
        isPlainText
        mode={isAuthor ? 'compose' : 'display'}
        // Coming soon: onSubmit={handleUpdateTitle}
        // Coming soon: saveOnBlur
      />
      <DocumentEditor
        contentType="document"
        disableAutoFocus
        initialValue={payload}
        isAuthor={isAuthor}
        mode={isAuthor ? 'compose' : 'display'}
        // Coming soon: onSubmit={handleUpdate}
      />
    </Container>
  );
};

Document.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default Document;
