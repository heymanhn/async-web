import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import addParticipantMutation from 'graphql/mutations/addParticipant';
import removeParticipantMutation from 'graphql/mutations/removeParticipant';
import useClickOutside from 'utils/hooks/useClickOutside';
import { getLocalAppState } from 'utils/auth';
import { track } from 'utils/analytics';

import ParticipantsSelector from './ParticipantsSelector';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const ParticipantsIndicator = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
});

const ParticipantsButton = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '14px',
  marginRight: '10px',
}));

const NumberOfParticipants = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const StyledParticipantsSelector = styled(ParticipantsSelector)({
  position: 'absolute',
  top: '0px',
});

const MeetingProperties = ({ author, initialParticipantIds, meetingId }) => {
  const [isSelectorOpen, setIsOpen] = useState(false);

  const [previousParticipantIds, setPreviousParticipantIds] = useState([]);
  const [participantIds, setParticipantIds] = useState([]);

  const [addParticipantAPI] = useMutation(addParticipantMutation);
  const [removeParticipantAPI] = useMutation(removeParticipantMutation);

  useEffect(() => {
    setPreviousParticipantIds(initialParticipantIds);
    setParticipantIds(initialParticipantIds);
  }, [initialParticipantIds]);

  function addParticipant(id) {
    setParticipantIds([...participantIds, id]);
  }

  function removeParticipant(id) {
    const index = participantIds.indexOf(id);
    setParticipantIds([...participantIds.slice(0, index), ...participantIds.slice(index + 1)]);
  }

  async function handleAddParticipant(userId) {
    await addParticipantAPI({
      variables: {
        id: meetingId,
        input: {
          userId,
          accessType: 'collaborator',
        },
      },
    });

    track('Participant added to meeting space', {
      meetingSpaceId: meetingId,
      userId,
    });
  }

  async function handleRemoveParticipant(userId) {
    await removeParticipantAPI({ variables: { id: meetingId, userId } });

    track('Participant removed from meeting space', {
      meetingSpaceId: meetingId,
      userId,
    });
  }

  function saveChangesAndClose() {
    previousParticipantIds.forEach((id) => {
      if (!participantIds.includes(id)) handleRemoveParticipant(id);
    });
    participantIds.forEach((id) => {
      if (!previousParticipantIds.includes(id)) handleAddParticipant(id);
    });
    setPreviousParticipantIds(participantIds);
    setIsOpen(false);
  }

  function toggleDropdown() {
    return isSelectorOpen ? saveChangesAndClose() : setIsOpen(true);
  }

  const selector = useRef();
  useClickOutside({
    handleClickOutside: saveChangesAndClose,
    isOpen: isSelectorOpen,
    ref: selector,
  });
  const { organizationId } = getLocalAppState();

  return (
    <Container ref={selector}>
      <ParticipantsIndicator>
        <ParticipantsButton onClick={toggleDropdown}>
          <StyledIcon icon={faUser} />
          <NumberOfParticipants>{Pluralize('participant', participantIds.length, true)}</NumberOfParticipants>
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
  author: PropTypes.object.isRequired,
  initialParticipantIds: PropTypes.array.isRequired,
  meetingId: PropTypes.string.isRequired,
};

export default MeetingProperties;
