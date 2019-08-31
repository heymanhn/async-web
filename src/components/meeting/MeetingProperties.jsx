import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';
import { getLocalUser } from 'utils/auth';

import meetingQuery from 'graphql/queries/meeting';
import addParticipantMutation from 'graphql/mutations/addParticipant';
import removeParticipantMutation from 'graphql/mutations/removeParticipant';
import useClickOutside from 'utils/hooks/useClickOutside';

import ParticipantsSelector from './ParticipantsSelector';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '20px',
  margin: '0 15px',
}));

const ParticipantsIndicator = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const ParticipantsButton = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
  marginRight: '10px',
}));

const NumberOfParticipants = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const StyledParticipantsSelector = styled(ParticipantsSelector)({
  position: 'absolute',
  top: '60px',
});

const MeetingProperties = ({ meetingId }) => {
  const [isSelectorOpen, setIsOpen] = useState(false);
  const [participantIds, setParticipantIds] = useState(null);
  const [initialParticipantIds, setInitialParticipantIds] = useState(null);
  const [addParticipantAPI] = useMutation(addParticipantMutation);
  const [removeParticipantAPI] = useMutation(removeParticipantMutation);

  function addParticipant(id) {
    setParticipantIds([...participantIds, id]);
  }

  function removeParticipant(id) {
    const index = participantIds.indexOf(id);
    setParticipantIds([...participantIds.slice(0, index), ...participantIds.slice(index + 1)]);
  }

  function saveChangesAndClose() {
    initialParticipantIds.forEach((id) => {
      if (!participantIds.includes(id)) {
        removeParticipantAPI({ variables: { id: meetingId, userId: id } });
      }
    });
    participantIds.forEach((id) => {
      if (!initialParticipantIds.includes(id)) {
        addParticipantAPI({
          variables: {
            id: meetingId,
            input: {
              userId: id,
              accessType: 'collaborator',
            },
          },
        });
      }
    });
    setIsOpen(false);
  }

  function toggleDropdown() {
    return isSelectorOpen ? saveChangesAndClose() : setIsOpen(true);
  }

  const selector = useRef();
  useClickOutside({ handleClickOutside: saveChangesAndClose, ref: selector });
  const { loading, error, data } = useQuery(meetingQuery, { variables: { id: meetingId } });
  if (loading) return null;
  if (error || !data.meeting) return <div>{error}</div>;

  const { author, participants: initialParticipants } = data.meeting;
  const { organizationId } = getLocalUser();

  if (!participantIds) {
    const ids = initialParticipants.map(p => p.user.id);
    setInitialParticipantIds(ids);
    setParticipantIds(ids);
    return null;
  }

  return (
    <Container ref={selector}>
      <VerticalDivider />
      <ParticipantsIndicator>
        <ParticipantsButton onClick={toggleDropdown}>
          <StyledIcon icon={faUser} />
          <NumberOfParticipants>{participantIds.length}</NumberOfParticipants>
        </ParticipantsButton>
        {isSelectorOpen && (
          <StyledParticipantsSelector
            alwaysOpen
            authorId={author.id}
            organizationId={organizationId}
            participantIds={participantIds}
            onAddParticipant={addParticipant}
            onRemoveParticipant={removeParticipant}
          />
        )}
      </ParticipantsIndicator>
    </Container>
  );
};

MeetingProperties.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default MeetingProperties;
