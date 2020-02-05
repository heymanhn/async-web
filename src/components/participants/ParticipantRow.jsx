import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import styled from '@emotion/styled';

import localRemoveMemberMutation from 'graphql/mutations/local/removeDocumentMember';
import removeMemberMutation from 'graphql/mutations/removeDocumentMember';

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
  fontSize: '13px',
  letterSpacing: '-0.0025em',
});

const Name = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
});

const RemoveButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '13px',
  letterSpacing: '-0.0025em',

  ':hover': {
    color: colors.blue,
  },
}));

const ParticipantRow = ({ accessType, documentId, user }) => {
  const { fullName, id, profilePictureUrl } = user;

  const [localRemoveMember] = useMutation(localRemoveMemberMutation, {
    variables: {
      id: documentId,
      userId: id,
    },
  });
  const [removeMember] = useMutation(removeMemberMutation, {
    variables: {
      id: documentId,
      userId: id,
    },
  });

  function handleRemoveMember() {
    removeMember();
    localRemoveMember();
  }

  const removeParticipantButton = (
    <RemoveButton onClick={handleRemoveMember}>remove</RemoveButton>
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
  documentId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default ParticipantRow;
