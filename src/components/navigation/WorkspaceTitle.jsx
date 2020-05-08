import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { WorkspaceContext } from 'utils/contexts';

const Title = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey0,
  marginTop: '-4px',
}));

const WorkspaceTitle = props => {
  const { workspaceId } = useContext(WorkspaceContext);
  const { data } = useQuery(workspaceQuery, {
    variables: { workspaceId },
  });

  if (!data || !data.workspace) return null;
  const { title } = data.workspace || {};

  return <Title {...props}>{title}</Title>;
};

export default WorkspaceTitle;
