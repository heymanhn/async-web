import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  marginBottom: '15px',
  ':last-of-type': {
    marginBottom: 0,
  },
});

const Details = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '10px',
});

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '14px',
  letterSpacing: '-0.006em',
}));

const Name = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

const RemoveButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  letterSpacing: '-0.006em',

  ':hover': {
    color: colors.blue,
  },
}));

const ParticipantRow = ({ accessType, user, handleRemove }) => {
  const { fullName, id, profilePictureUrl } = user;

  const handleRemoveWrapper = () => handleRemove(id);

  const removeParticipantButton = (
    <RemoveButton onClick={handleRemoveWrapper}>remove</RemoveButton>
  );

  return (
    <Container>
      <Details>
        <StyledAvatar
          alt={fullName}
          avatarUrl={profilePictureUrl}
          size={24}
          title={fullName}
        />
        <Name>{fullName}</Name>
      </Details>
      {accessType === 'owner' ? (
        <Label>{accessType}</Label>
      ) : (
        removeParticipantButton
      )}
    </Container>
  );
};

ParticipantRow.propTypes = {
  accessType: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default ParticipantRow;
