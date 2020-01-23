import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import styled from '@emotion/styled';

import localRemoveParticipantMutation from 'graphql/mutations/local/removeDocumentParticipant';
import removeParticipantMutation from 'graphql/mutations/removeParticipant';

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
  marginRight: '15px',
});

const Label = styled.div({
  fontSize: '14px',
  letterSpacing: '-0.006em',
});

const RemoveButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  letterSpacing: '-0.006em',
}));

const ParticipantRow = ({ accessType, documentId, user }) => {
  const { fullName, id, profilePictureUrl } = user;

  const [localRemoveParticipant] = useMutation(localRemoveParticipantMutation, {
    variables: {
      id: documentId,
      participantId: id,
    },
  });
  const [removeParticipant] = useMutation(removeParticipantMutation, {
    variables: {
      id: documentId,
      userId: id,
    },
  });

  function handleRemoveParticipant() {
    removeParticipant();
    localRemoveParticipant();
  }

  const removeParticipantButton = (
    <RemoveButton onClick={handleRemoveParticipant}>
      remove
    </RemoveButton>
  );

  return (
    <Container>
      <Details>
        <StyledAvatar
          alt={fullName}
          avatarUrl={profilePictureUrl}
          size={30}
          title={fullName}
        />
        <Label>{fullName}</Label>
      </Details>
      {accessType === 'owner' ? <Label>{accessType}</Label> : removeParticipantButton}
    </Container>
  );
};

ParticipantRow.propTypes = {
  accessType: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default ParticipantRow;
