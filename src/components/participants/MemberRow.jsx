import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ isParticipant, isSelected, theme: { colors } }) => ({
  display: 'flex',
  background: isSelected ? colors.grey7 : 'none',
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

const MemberRow = ({
  handleAddParticipant,
  isParticipant,
  isSelected,
  member,
  ...props
}) => {
  const memberRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      memberRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  function handleClick() {
    return isParticipant ? null : handleAddParticipant(member);
  }

  const { email, fullName, profilePictureUrl } = member;

  return (
    <Container
      isParticipant={isParticipant}
      isSelected={isSelected}
      onClick={handleClick}
      ref={memberRef}
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
  isSelected: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
};

export default MemberRow;
