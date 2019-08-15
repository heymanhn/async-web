import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { navigate } from '@reach/router';
import { Modal, Spinner } from 'reactstrap';
import styled from '@emotion/styled';

import createMeetingMutation from 'graphql/createMeetingMutation';

import RovalEditor from 'components/editor/RovalEditor';

// import ParticipantsSelector from './ParticipantsSelector';

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
  padding: '10px 15px',
  width: '400px',

  ':active': {
    // outline: 'none',
  },
}));

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
        <ModalTitle>Create a meeting space</ModalTitle>
        <Label>NAME</Label>
        <InputEditor
          contentType="meetingTitle"
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
