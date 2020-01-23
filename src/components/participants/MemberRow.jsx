import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  margin: '7px 0',
  padding: '0 15px',
});

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Details = styled.div({
  fontSize: '14px',
  letterSpacing: '-0.006em',
});

const Name = styled.div({
  fontWeight: 600,
});

const Email = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  marginTop: '5px',
}));

const MemberRow = ({ member }) => {
  const { email, fullName, profilePictureUrl } = member;

  return (
    <Container>
      <StyledAvatar
        alt={fullName}
        avatarUrl={profilePictureUrl}
        size={30}
        title={fullName}
      />
      <Details>
        <Name>{fullName}</Name>
        <Email>{email}</Email>
      </Details>
    </Container>
  );
};

MemberRow.propTypes = { member: PropTypes.object.isRequired };

export default MemberRow;
