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

const Label = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey0,
  cursor: 'default',
}));

const Name = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.grey0,
  cursor: 'default',
}));

const RemoveButton = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey3,
  cursor: 'pointer',

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
