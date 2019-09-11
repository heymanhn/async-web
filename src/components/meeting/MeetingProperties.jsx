import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import addParticipantMutation from 'graphql/mutations/addParticipant';
import removeParticipantMutation from 'graphql/mutations/removeParticipant';
import useClickOutside from 'utils/hooks/useClickOutside';
import { getLocalUser } from 'utils/auth';

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

  const [previousParticipantIds, setPreviousParticipantIds] = useState(initialParticipantIds);
  const [participantIds, setParticipantIds] = useState(initialParticipantIds);

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
    previousParticipantIds.forEach((id) => {
      if (!participantIds.includes(id)) {
        removeParticipantAPI({ variables: { id: meetingId, userId: id } });
      }
    });
    participantIds.forEach((id) => {
      if (!previousParticipantIds.includes(id)) {
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
  const { organizationId } = getLocalUser();

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
