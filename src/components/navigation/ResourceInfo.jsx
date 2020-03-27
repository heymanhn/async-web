import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';

import WorkspaceTitle from './WorkspaceTitle';
import ResourceTitle from './ResourceTitle';

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

const ResourceInfo = props => {
  const {
    resource: { resourceType, icon },
  } = useContext(NavigationContext);

  return (
    <Container {...props}>
      <IconContainer>
        <StyledIcon icon={icon} />
      </IconContainer>
      {resourceType === 'workspace' ? <WorkspaceTitle /> : <ResourceTitle />}
    </Container>
  );
};

export default ResourceInfo;
