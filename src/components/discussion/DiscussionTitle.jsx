import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import { DiscussionContext } from 'utils/contexts';
import discussionQuery from 'graphql/queries/discussion';

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
}));

const DiscussionTitle = () => {
  const { discussionId } = useContext(DiscussionContext);

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });

  if (loading || !data.discussion) return null;
  const { discussion } = data;
  const { topic } = discussion;
  const { text: title } = topic || {};

  return <Title>{title || 'Untitled Discussion'}</Title>;
};

export default DiscussionTitle;
