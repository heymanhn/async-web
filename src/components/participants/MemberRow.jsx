import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ isMember, isSelected, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: isSelected ? colors.grey7 : 'none',
  cursor: isMember ? 'default' : 'pointer',
  margin: '7px 0',
  padding: '3px 15px',
  userSelect: 'none',

  ':hover': {
    background: colors.grey7,
  },
}));

const StyledAvatar = styled(Avatar)(({ isMember }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: isMember ? 0.5 : 1,
}));

const Details = styled.div({
  fontSize: '14px',
  letterSpacing: '-0.006em',
});

const Name = styled.div(({ isMember, theme: { colors } }) =>
  isMember
    ? {
        color: colors.grey4,
      }
    : {
        fontWeight: 600,
      }
);

const Email = styled.div(({ isMember, theme: { colors } }) => ({
  color: isMember ? colors.grey4 : colors.grey2,
}));

const MemberRow = ({
  handleAddMember,
  index,
  isMember,
  isSelected,
  member,
  updateSelectedIndex,
  ...props
}) => {
  const memberRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      memberRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  function handleClick() {
    return isMember ? null : handleAddMember(member);
  }

  const { email, fullName, profilePictureUrl } = member;

  return (
    <Container
      isMember={isMember}
      isSelected={isSelected}
      onClick={handleClick}
      onMouseOver={() => updateSelectedIndex(index)}
      onFocus={() => updateSelectedIndex(index)}
      ref={memberRef}
      {...props}
    >
      <StyledAvatar
        alt={fullName}
        avatarUrl={profilePictureUrl}
        isMember={isMember}
        size={32}
        title={fullName}
      />
      <Details>
        <Name isMember={isMember}>
          {`${fullName}${isMember ? ' (joined)' : ''}`}
        </Name>
        <Email isMember={isMember}>{email}</Email>
      </Details>
    </Container>
  );
};

MemberRow.propTypes = {
  handleAddMember: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isMember: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  member: PropTypes.object.isRequired,
  updateSelectedIndex: PropTypes.func.isRequired,
};

export default MemberRow;
