import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from 'react-apollo';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import createInvitesMutation from 'graphql/mutations/createInvites';

import Button from 'components/shared/Button';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '100px',
});

const Title = styled.div({
  fontSize: '20px',
  fontWeight: 600,
});

const InputField = styled.input({
  fontSize: '16px',
  width: '200px',
});

const SkipStep = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  cursor: 'pointer',
  fontSize: '14px',
}));

const InviteTeam = ({ organizationId }) => {
  const [firstEmail, setFirstEmail] = useState('');
  const [secondEmail, setSecondEmail] = useState('');
  const [thirdEmail, setThirdEmail] = useState('');
  const client = useApolloClient();
  client.writeData({ data: { isOnboarding: false } });

  function gatherEmails() {
    return [firstEmail, secondEmail, thirdEmail].filter(e => e !== '');
  }

  const [createInvites] = useMutation(createInvitesMutation, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (err) => {
      console.dir(err); // TODO: Error handling on the page
    },
  });

  function handleCreateInvites() {
    const emails = gatherEmails();
    if (!emails.length) return;

    createInvites({ variables: { organizationId, input: { emails } } });
  }

  if (!organizationId) return <Redirect to="/" noThrow />;

  return (
    <Container>
      <Title>Invite your team by email</Title>

      <InputField
        name="firstEmail"
        onChange={event => setFirstEmail(event.target.value)}
        type="email"
        value={firstEmail}
      />

      <InputField
        name="secondEmail"
        onChange={event => setSecondEmail(event.target.value)}
        type="email"
        value={secondEmail}
      />

      <InputField
        name="thirdEmail"
        onChange={event => setThirdEmail(event.target.value)}
        type="email"
        value={thirdEmail}
      />

      <Button
        isDisabled={!gatherEmails().length}
        onClick={handleCreateInvites}
        title="Invite Teammates"
      />

      <SkipStep onClick={() => navigate('/')}>Skip</SkipStep>
    </Container>
  );
};

InviteTeam.propTypes = {
  organizationId: PropTypes.string,
};

InviteTeam.defaultProps = {
  organizationId: null,
};

export default InviteTeam;
