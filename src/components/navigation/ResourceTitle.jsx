import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import { TruncatedSingleLine } from 'styles/shared';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '-5px',
});

const TitleContainer = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '2px 5px',

  ':hover': {
    background: colors.grey7,
  },
}));

const Title = styled(TruncatedSingleLine)(
  ({ theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 14 }),
    color: colors.grey0,
    marginTop: '-3px',
    maxWidth: '150px',
  })
);

const DefaultTitle = styled(Title)({
  cursor: 'default',
  paddingLeft: '5px',
  maxWidth: '300px',
});

const Separator = styled.div(({ theme: { colors } }) => ({
  color: colors.grey5,
  fontSize: '20px',
  marginTop: '-4px',
  paddingLeft: '5px',
  paddingRight: '3px',
}));

const ResourceTitle = props => {
  const {
    resource: { resourceType, resourceQuery, variables },
  } = useContext(NavigationContext);
  const [workspaceId, setWorkspaceId] = useState(null);

  const [getWorkspace, { loading, data: workspaceData }] = useLazyQuery(
    workspaceQuery
  );

  const { data: resourceData } = useQuery(resourceQuery, {
    variables,
  });

  useEffect(() => {
    getWorkspace({ variables: { workspaceId } });
  }, [workspaceId, getWorkspace]);

  // All these dances to ensure we render only when everything is fetched
  if (!resourceData || !resourceData[resourceType]) return null;
  const { title, topic, workspaces } = resourceData[resourceType];

  if (workspaces) {
    const [wsId] = workspaces;
    if (workspaceId !== wsId) setWorkspaceId(wsId);
  }

  // Don't render the title until the workspace title is available too
  if (!workspaceData && loading) return null;

  const { title: workspaceTitle } = workspaceData
    ? workspaceData.workspace
    : {};
  const { text } = topic || {};
  const resourceTitle = title || text;

  const renderWorkspaceTitle = () => (
    <TitleContainer onClick={() => navigate(`/workspaces/${workspaces[0]}`)}>
      <Title {...props}>{workspaceTitle}</Title>
    </TitleContainer>
  );

  return (
    <Container>
      {workspaceTitle && renderWorkspaceTitle()}
      {workspaceTitle && <Separator>/</Separator>}
      <DefaultTitle>
        {resourceTitle || `Untitled ${titleize(resourceType)}`}
      </DefaultTitle>
    </Container>
  );
};

export default ResourceTitle;
