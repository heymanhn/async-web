import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';

import NotFound from 'components/navigation/NotFound';

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
}));

const NavTitle = ({ documentId, discussionId }) => {
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
  if (!data.document && !discussionData.discussion) return <NotFound />;

  let title;
  if (data.document) {
    ({ title } = data.document);
  } else if (discussionData.discussion) {
    const { topic } = discussionData.discussion;
    ({ text: title } = topic);
  }

  return <Title>{title || 'Untitled'}</Title>;
};

NavTitle.propTypes = {
  documentId: PropTypes.string,
  discussionId: PropTypes.string,
};

NavTitle.defaultProps = {
  documentId: null,
  discussionId: null,
};

export default NavTitle;
