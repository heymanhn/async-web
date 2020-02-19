import React from 'react';
import styled from '@emotion/styled';

import OrganizationSettings from 'components/navigation/OrganizationSettings';
import NotificationsBell from 'components/notifications/NotificationsBell';
import CommandCenter from 'components/commandCenter/CommandCenter';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

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
  fontSize: '18px',
  fontWeight: 500,
  position: 'relative',
  top: '2px',
  letterSpacing: '-0.014em',
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
        <CommandCenter />
      </NavigationSection>
    </Container>
  );
};

export default NavBar;
