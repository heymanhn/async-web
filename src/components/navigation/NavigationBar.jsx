import React, { useState } from 'react';
import styled from '@emotion/styled';

import { NavigationContext, DEFAULT_NAVIGATION_CONTEXT } from 'utils/contexts';
import useDisambiguatedResource from 'utils/hooks/useDisambiguatedResource';

import CommandCenter from 'components/commandCenter/CommandCenter';
import DocumentViewMode from 'components/document/DocumentViewMode';
import ResourceInfo from 'components/navigation/ResourceInfo';
import NotificationsBell from 'components/notifications/NotificationsBell';
import ResourceAccessContainer from 'components/participants/ResourceAccessContainer';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  background: colors.white,
  height: '60px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const LeftSection = styled.div({
  display: 'flex',
  alignItems: 'center',

  marginLeft: '30px',
});

const RightSection = styled.div({
  display: 'flex',
  alignItems: 'center',

  height: '100%',
  marginRight: '15px',
});

const NavigationBar = props => {
  const resource = useDisambiguatedResource();
  const { resourceType } = resource;

  // For the Resource Access modal. Storing state here so that the context can
  // be shared with the Command Center as well as the modal
  const [isResourceAccessModalOpen, setIsResourceAccessModalOpen] = useState(
    false
  );

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    resource,
    isResourceAccessModalOpen,
    setIsResourceAccessModalOpen,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Container {...props}>
        <LeftSection>
          <ResourceInfo />
          {resourceType === 'document' && <DocumentViewMode />}
        </LeftSection>
        <RightSection>
          <ResourceAccessContainer />
          <NotificationsBell />

          {/* TODO (HN): enable for workspaces once implemented */}
          {resourceType !== 'workspace' && <CommandCenter />}
        </RightSection>
      </Container>
    </NavigationContext.Provider>
  );
};

export default NavigationBar;
