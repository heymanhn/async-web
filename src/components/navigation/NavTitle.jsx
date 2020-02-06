import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import { DocumentContext, DiscussionContext } from 'utils/contexts';
import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
}));

const NavTitle = () => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  const { loading, data } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
    skip: !documentId,
  });

  const { loading: loadingDiscussion, data: discussionData } = useQuery(
    discussionQuery,
    {
      variables: { discussionId, queryParams: {} },
      skip: !discussionId,
    }
  );

  if (loading || loadingDiscussion) return null;
  if (documentId && !data.document) return null;
  if (discussionId && !discussionData.discussion) return null;

  let title;
  if (documentId) {
    const { document } = data;
    ({ title } = document);
  } else if (discussionId) {
    const { discussion } = discussionData;
    const { topic } = discussion;
    ({ text: title } = topic || {});
  }

  return <Title>{title || 'Untitled'}</Title>;
};

export default NavTitle;
