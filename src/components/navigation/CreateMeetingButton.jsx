import React from 'react';
import { Mutation } from 'react-apollo';
import { Spinner } from 'reactstrap';
import styled from '@emotion/styled';

import createMeetingMutation from 'graphql/createMeetingMutation';

const StyledSpinner = styled(Spinner)(({ color, theme: { colors } }) => ({
  border: `.05em solid ${colors[color]}`,
  borderRightColor: 'transparent',
  width: '15px',
  height: '15px',
}));

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  color: colors.grey3,
  fontSize: '26px',
  fontWeight: '400',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey2,
  },

  span: {
    position: 'relative',
    top: '-2px',
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
      if (loading) return <StyledSpinner color="grey4" />;
      if (error) console.log(error);

      return (
        <Container onClick={() => { create(); }}>
          <span>+</span>
        </Container>
      );
    }}
  </Mutation>
);

export default CreateMeetingButton;
