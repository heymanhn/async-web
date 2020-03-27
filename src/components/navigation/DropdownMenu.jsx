import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';
import useClickOutside from 'utils/hooks/useClickOutside';
import useCurrentUser from 'utils/hooks/useCurrentUser';

import Avatar from 'components/shared/Avatar';
import InviteTeamModal from './InviteTeamModal';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  opacity: isOpen ? 1 : 0,
  outline: 'none',
  position: 'absolute',
  top: '60px',
  left: '20px',
  width: '200px',
  zIndex: 1000,
  transition: 'opacity 0.1s',
}));

const AuthorSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '15px 20px',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Name = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

const MenuOptionList = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: colors.bgGrey,
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  borderTop: `1px solid ${colors.borderGrey}`,
  padding: '8px 20px',
}));

const MenuOption = styled.div(({ theme: { colors } }) => ({
  cursor: 'pointer',
  fontSize: '14px',
  margin: '10px 0',

  ':hover': {
    color: colors.grey1,
  },
}));

const DropdownMenu = ({ handleClose, isOpen, organizationId, ...props }) => {
  const { setIsInviteModalOpen } = useContext(NavigationContext);
  const selector = useRef();
  const currentUser = useCurrentUser();
  const handleClickOutside = () => isOpen && handleClose();
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  const showInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleNavigate = (event, route) => {
    event.stopPropagation();
    handleClose();
    return navigate(route);
  };

  const handleNavigateInbox = event => handleNavigate(event, '/inbox');
  const handleLogout = event => handleNavigate(event, '/logout');

  if (!Object.keys(currentUser).length) return null;

  return (
    <Container isOpen={isOpen} ref={selector} {...props}>
      <AuthorSection>
        <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={24} />
        <Name>{currentUser.fullName}</Name>
      </AuthorSection>
      <MenuOptionList>
        <MenuOption onClick={handleNavigateInbox}>Inbox</MenuOption>
        <MenuOption onClick={showInviteModal}>Invite people</MenuOption>
        <MenuOption onClick={handleLogout}>Sign out</MenuOption>
      </MenuOptionList>
      <InviteTeamModal organizationId={organizationId} />
    </Container>
  );
};

DropdownMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default DropdownMenu;
