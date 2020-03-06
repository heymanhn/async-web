import React from 'react';
import styled from '@emotion/styled';

import OrganizationSettings from 'components/navigation/OrganizationSettings';
import NotificationsBell from 'components/notifications/NotificationsBell';
import CommandCenter from 'components/commandCenter/CommandCenter';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  height: '54px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
});

const MenuSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: '30px',
  height: '100%',
});

const NavigationSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  marginRight: '15px',
});

const Title = styled.span({
  fontSize: '16px',
  fontWeight: 500,
  position: 'relative',
  letterSpacing: '-0.011em',
});

const NavBar = () => {
  return (
    <Container>
      <MenuSection>
        <OrganizationSettings />
        <Title>Roval</Title>
      </MenuSection>
      <NavigationSection>
        <NotificationsBell />
        <CommandCenter source="inbox" />
      </NavigationSection>
    </Container>
  );
};

export default NavBar;
