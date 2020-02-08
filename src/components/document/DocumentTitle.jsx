import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import { DocumentContext } from 'utils/contexts';
import documentQuery from 'graphql/queries/document';

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
}));

const DocumentTitle = () => {
  const { documentId } = useContext(DocumentContext);

  const { loading, data } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
  });

  if (loading || !data.document) return null;

  const { document } = data;
  const { title } = document;

  return <Title>{title || 'Untitled Document'}</Title>;
};

export default DocumentTitle;
