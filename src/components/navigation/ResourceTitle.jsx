import React, { useContext } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const TitleContainer = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '2px 5px',

  ':hover': {
    background: colors.grey7,
  },
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '14px',
  marginTop: '-3px',
}));

const DefaultTitle = styled(Title)({
  cursor: 'default',
  paddingLeft: '5px',
});

const Separator = styled.div(({ theme: { colors } }) => ({
  color: colors.grey5,
  fontSize: '20px',
  marginTop: '-4px',
  paddingLeft: '3px',
  paddingRight: '3px',
}));

const ResourceTitle = props => {
  const {
    resource: { resourceType, resourceId, resourceQuery, createVariables },
  } = useContext(NavigationContext);

  const [getWorkspace, { loading, data: workspaceData }] = useLazyQuery(
    workspaceQuery
  );

  const { data: resourceData } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
  });

  // All these dances to ensure we render only when everything is fetched
  if (!resourceData || !resourceData[resourceType]) return null;
  const { title, topic, workspaces } = resourceData[resourceType];
  if (!loading && !workspaceData && workspaces) {
    getWorkspace({ variables: { workspaceId: workspaces[0] } });
    return null;
  }
  if (!workspaceData && loading) return null;

  const { title: workspaceTitle } = workspaceData
    ? workspaceData.workspace
    : {};
  const resourceTitle = title || topic.text;

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
