import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { NavigationContext, WorkspaceContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const IconContainer = styled.div({
  marginRight: '10px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '18px',
}));

const TitleContainer = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  padding: '0 5px',

  ':hover': {
    background: colors.grey6,
  },
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '14px',
  letterSpacing: '-0.006em',
}));

const Separator = styled.div(({ theme: { colors } }) => ({
  color: colors.grey5,
  fontSize: '20px',
  padding: '0 3px 8px 0',
}));

const ResourceInfo = props => {
  const { workspaceId } = useContext(WorkspaceContext);
  const {
    resource: {
      resourceType,
      resourceId,
      resourceQuery,
      createVariables,
      icon,
    },
  } = useContext(NavigationContext);

  const { data: workspaceData } = useQuery(workspaceQuery, {
    variables: { workspaceId },
    skip: !workspaceId,
  });

  const { data: resourceData } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
    skip: resourceType === 'workspace',
  });

  if (workspaceId && !workspaceData && !workspaceData.workspace) return null;
  if (
    resourceType !== 'workspace' &&
    !resourceData &&
    !resourceData[resourceType]
  )
    return null;

  const { title: workspaceTitle } = workspaceData.workspace || {};
  let resourceTitle = null;
  if (resourceType !== 'workspace' && resourceData[resourceType]) {
    const { title, topic } = resourceData[resourceType];
    resourceTitle = title || topic.text;
  }

  return (
    <Container {...props}>
      <IconContainer>
        <StyledIcon icon={icon} />
      </IconContainer>
      {workspaceId && (
        <TitleContainer onClick={() => navigate(`/workspaces/${workspaceId}`)}>
          <Title>{workspaceTitle}</Title>
        </TitleContainer>
      )}
      {workspaceId && resourceType !== 'workspace' && <Separator />}
      {resourceType !== 'workspace' && (
        <Title>{resourceTitle || `Untitled ${titleize(resourceType)}`}</Title>
      )}
    </Container>
  );
};

export default ResourceInfo;
