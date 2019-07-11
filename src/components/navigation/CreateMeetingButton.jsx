import React from 'react';
import { Mutation } from 'react-apollo';
import { Spinner } from 'reactstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import createMeetingMutation from 'graphql/createMeetingMutation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledSpinner = styled(Spinner)(({ theme: { colors } }) => ({
  border: `.05em solid ${colors.grey4}`,
  borderRightColor: 'transparent',
  width: '16px',
  height: '16px',
  margin: '0 10px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '16px',
  margin: '0 10px',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey2,
  },
}));

const CreateMeetingButton = () => (
  <Mutation
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
  </Mutation>
);

export default CreateMeetingButton;
