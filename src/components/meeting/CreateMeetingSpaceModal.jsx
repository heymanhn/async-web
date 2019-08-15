import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { navigate } from '@reach/router';
import { Input, Label, Modal, Spinner } from 'reactstrap';
import styled from '@emotion/styled';

import createMeetingMutation from 'graphql/createMeetingMutation';

// import ParticipantsSelector from './ParticipantsSelector';

const StyledModal = styled(Modal)(({ theme: { maxViewport } }) => ({
  margin: '120px auto',

  '.modal-content': {
    border: 'none',
  },
}));

const MainContainer = styled.div({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  margin: '40px 30px 50px',
});

const Title = styled.div({
  fontSize: '24px',
  fontWeight: 500,
});

const ButtonsContainer = styled.div({

});

const StyledButton = styled.div({

});

const StyledSpinner = styled(Spinner)(({ theme: { colors } }) => ({
  border: `.05em solid ${colors.grey4}`,
  borderRightColor: 'transparent',
  width: '16px',
  height: '16px',
  margin: '0 10px',
}));

const CreateMeetingSpaceModal = ({ toggle, ...props }) => {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  function handleChangeName(event) {
    setName(event.target.value);
  }
  function handleChangePurpose(event) {
    setPurpose(event.target.value);
  }

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
      navigate(`/spaces/${data.createMeeting.id}`);
    },
  });

  return (
    <StyledModal
      fade={false}
      {...props}
    >
      <MainContainer>
        <Title>Create a meeting space</Title>
        <Label for="name">NAME</Label>
        <Input type="textarea" id="name" value={name} onChange={handleChangeName} />
        <Label for="purpose">PURPOSE</Label>
        <Input type="textarea" id="purpose" value={purpose} onChange={handleChangePurpose} />
        {/* <ParticipantsSelector
          authorId={author.id}
          meetingId={meetingId}
          participants={participants.map(p => p.user)}
        /> */}
      </MainContainer>
      <ButtonsContainer>
        <StyledButton loading={loading} mode="submit" onClick={createMeeting}>
          {loading ? <StyledSpinner /> : '+ Create'}
        </StyledButton>
        <StyledButton onClick={toggle}>Cancel</StyledButton>
      </ButtonsContainer>
    </StyledModal>
  );
};

/*  <Mutation
    mutation={createMeetingMutation}
    variables={{ input: {} }}
    update={(cache, { data: { createMeeting } }) => {
      window.open(`/meetings/${createMeeting.id}`, '_blank');
    }}
  >
    {(create, { loading, error }) => {
      if (loading) return <StyledSpinner />;
      if (error) console.log(error);

      return <StyledIcon icon={faPlus} onClick={() => { create(); }} />;
    }}
  </Mutation> */

CreateMeetingSpaceModal.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default CreateMeetingSpaceModal;
