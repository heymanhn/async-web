import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';
import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import useClickOutside from 'utils/hooks/useClickOutside';

import Avatar from 'components/shared/Avatar';
import InviteTeamModal from './InviteTeamModal';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  borderRadius: '5px',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.08)',
  opacity: isOpen ? 1 : 0,
  outline: 'none',
  position: 'absolute',
  top: '60px',
  left: '20px',
  width: '180px',
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
  const handleClickOutside = () => isOpen && handleClose();
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  const showInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });
  if (loading || !data.user) return null;
  const { user } = data;

  const handleNavigate = (event, route) => {
    event.stopPropagation();
    handleClose();
    return navigate(route);
  };

  const handleNavigateInbox = event => handleNavigate(event, '/inbox');
  const handleLogout = event => handleNavigate(event, '/logout');

  return (
    <Container isOpen={isOpen} ref={selector} {...props}>
      <AuthorSection>
        <AvatarWithMargin avatarUrl={user.profilePictureUrl} size={24} />
        <Name>{user.fullName}</Name>
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
