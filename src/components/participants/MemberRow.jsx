import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ isParticipant, theme: { colors } }) => ({
  display: 'flex',
  cursor: isParticipant ? 'default' : 'pointer',
  margin: '7px 0',
  padding: '0 15px',
  userSelect: 'none',

  ':hover': {
    background: colors.grey7,
  },
}));

const StyledAvatar = styled(Avatar)(({ isParticipant }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: isParticipant ? 0.5 : 1,
}));

const Details = styled.div({
  fontSize: '14px',
  letterSpacing: '-0.006em',
});

const Name = styled.div(({ isParticipant, theme: { colors } }) => (isParticipant ? {
  color: colors.grey4,
} : {
  fontWeight: 600,
}));

const Email = styled.div(({ isParticipant, theme: { colors } }) => ({
  marginTop: '5px',
  color: isParticipant ? colors.grey4 : colors.grey2,
}));

const MemberRow = ({ handleAddParticipant, isParticipant, member, ...props }) => {
  const { email, fullName, profilePictureUrl } = member;

  function handleClick() {
    return isParticipant ? null : handleAddParticipant(member);
  }

  return (
    <Container
      isParticipant={isParticipant}
      onClick={handleClick}
      {...props}
    >
      <StyledAvatar
        alt={fullName}
        avatarUrl={profilePictureUrl}
        isParticipant={isParticipant}
        size={30}
        title={fullName}
      />
      <Details>
        <Name isParticipant={isParticipant}>
          {`${fullName}${isParticipant ? ' (joined)' : ''}`}
        </Name>
        <Email isParticipant={isParticipant}>{email}</Email>
      </Details>
    </Container>
  );
};

MemberRow.propTypes = {
  handleAddParticipant: PropTypes.func.isRequired,
  isParticipant: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
};

export default MemberRow;
