import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import useClickOutside from 'utils/hooks/useClickOutside';

import Avatar from 'components/shared/Avatar';

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
  const selector = useRef();
  function handleClickOutside() {
    if (!isOpen) return;
    handleClose();
  }
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });
  if (loading || !data.user) return null;
  const { user } = data;

  function handleSelectInvite(event) {
    event.stopPropagation();
    handleClose();
    return navigate(`/organizations/${organizationId}/invites`);
  }

  function handleLogout(event) {
    event.stopPropagation();
    handleClose();
    return navigate('/logout');
  }

  return (
    <Container isOpen={isOpen} ref={selector} {...props}>
      <AuthorSection>
        <AvatarWithMargin
          avatarUrl={user.profilePictureUrl}
          size={24}
        />
        <Name>{user.fullName}</Name>
      </AuthorSection>
      <MenuOptionList>
        <MenuOption onClick={handleSelectInvite}>Invite people</MenuOption>
        <MenuOption onClick={handleLogout}>Sign out</MenuOption>
      </MenuOptionList>
    </Container>
  );
};

DropdownMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default DropdownMenu;
