import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { navigate } from '@reach/router';
import { Modal, Spinner } from 'reactstrap';
import styled from '@emotion/styled';

import addParticipantMutation from 'graphql/mutations/addParticipant';
import createMeetingMutation from 'graphql/mutations/createMeeting';
import meetingsQuery from 'graphql/queries/meetings';
import { getLocalUser } from 'utils/auth';

import RovalEditor from 'components/editor/RovalEditor';
import ParticipantsSelector from './ParticipantsSelector';

const StyledModal = styled(Modal)({
  margin: '120px auto',

  '.modal-content': {
    border: 'none',
  },
});

const MainContainer = styled.div({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  margin: '40px 30px 50px',
});

const ModalTitle = styled.div({
  fontSize: '24px',
  fontWeight: 500,
  marginBottom: '30px',
});

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const InputEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  border: `1px solid ${colors.formBorderGrey}`,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  marginBottom: '30px',
  padding: '8px 12px',
  width: '400px',
}));

const ActionsContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  borderTop: `1px solid ${colors.borderGrey}`,
  color: colors.grey3,
}));

const ButtonContainer = styled.div(({ isDisabled, theme: { colors }, type }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: type === 'create' ? colors.white : 'initial',
  borderBottomLeftRadius: type === 'create' ? '5px' : 'none',
  color: type === 'create' ? colors.blue : colors.grey3,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: 14,
  fontWeight: 500,
  height: '52px',
  padding: '0px 30px',

  div: {
    opacity: isDisabled ? 0.5 : 1,
  },
}));

const PlusSign = styled.div({
  fontSize: '18px',
  marginRight: '8px',
  position: 'relative',
  top: '-1px',
});

const StyledSpinner = styled(Spinner)(({ theme: { colors } }) => ({
  border: `.05em solid ${colors.blue}`,
  borderRightColor: 'transparent',
  width: '12px',
  height: '12px',
  marginRight: '8px',
  marginTop: '1px',
}));

const ButtonText = styled.div({
  fontSize: '14px',
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '52px',
  margin: 0,
}));

const CreateMeetingSpaceModal = ({ isOpen, toggle, ...props }) => {
  const { userId, organizationId } = getLocalUser();

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  async function handleChangeName({ text }) {
    // HACK due to https://github.com/ianstormtaylor/slate/issues/2434
    if (name !== text) setTimeout(() => setName(text), 0);

    return Promise.resolve();
  }
  function handleChangePurpose({ text }) {
    // HACK due to https://github.com/ianstormtaylor/slate/issues/2434
    if (purpose !== text) setTimeout(() => setPurpose(text), 0);

    return Promise.resolve();
  }

  const [participantIds, setParticipantIds] = useState([userId]);
  if (!isOpen && participantIds.length > 1) setParticipantIds([userId]); // reset on modal close
  function addParticipant(id) {
    setParticipantIds([...participantIds, id]);
  }
  function removeParticipant(id) {
    const index = participantIds.indexOf(id);
    setParticipantIds([...participantIds.slice(0, index), ...participantIds.slice(index + 1)]);
  }

  const [addParticipantAPI] = useMutation(addParticipantMutation);
  const [createMeeting, { loading }] = useMutation(createMeetingMutation, {
    variables: {
      input: {
        title: name,
        body: {
          formatter: 'text',
          text: purpose,
          payload: purpose,
        },
      },
    },
    onCompleted: (data) => {
      const { id: meetingId } = data.createMeeting;
      // Don't add the meeting organizer (1st entry in array) as a participant
      participantIds.slice(1).forEach((id) => {
        addParticipantAPI({
          variables: {
            id: meetingId,
            input: {
              userId: id,
              accessType: 'collaborator',
            },
          },
        });
      });
      toggle();
      navigate(`/spaces/${data.createMeeting.id}`);
    },
    refetchQueries: [{
      query: meetingsQuery,
    }],
  });

  // The UI concept of a "save + cancel button toolbar" should be DRY'ed up if this is permanent
  const createButton = (
    <React.Fragment>
      <ButtonContainer
        isDisabled={!name || loading}
        onClick={createMeeting}
        type="create"
      >
        {!loading && <PlusSign>+</PlusSign>}
        {loading && <StyledSpinner />}
        <ButtonText>Create</ButtonText>
      </ButtonContainer>
      <VerticalDivider />
    </React.Fragment>
  );

  const cancelButton = (
    <React.Fragment>
      <ButtonContainer
        onClick={toggle}
        type="cancel"
      >
        <ButtonText>Cancel</ButtonText>
      </ButtonContainer>
      <VerticalDivider />
    </React.Fragment>
  );

  return (
    <StyledModal
      fade={false}
      isOpen={isOpen}
      {...props}
    >
      <MainContainer>
        <ModalTitle>Create a meeting space</ModalTitle>
        <Label>NAME</Label>
        <InputEditor
          contentType="meetingName"
          isPlainText
          mode="compose"
          onSubmit={handleChangeName}
          saveOnBlur
        />
        <Label>PURPOSE</Label>
        <InputEditor
          contentType="meetingPurpose"
          disableAutoFocus
          isPlainText
          mode="compose"
          onSubmit={handleChangePurpose}
          saveOnBlur
        />
        <ParticipantsSelector
          authorId={userId}
          organizationId={organizationId}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          participantIds={participantIds}
        />
      </MainContainer>
      <ActionsContainer>
        {createButton}
        {cancelButton}
      </ActionsContainer>
    </StyledModal>
  );
};

CreateMeetingSpaceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CreateMeetingSpaceModal;
