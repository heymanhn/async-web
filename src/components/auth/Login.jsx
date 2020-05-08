import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import createSessionMutation from 'graphql/mutations/createSession';
import {
  setLocalUser,
  clearLocalUser,
  setLocalAppState,
  clearLocalAppState,
} from 'utils/auth';
import { identify, track } from 'utils/analytics';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import OnboardingContainer from './OnboardingContainer';

const FieldsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '25px',
  width: '300px',
});

const Label = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  alignSelf: 'flex-start',
  color: colors.grey3,
  marginBottom: '5px',
}));

const StyledButton = styled(Button)({
  marginTop: '15px',
  textAlign: 'center',
  width: '300px',
});

const RequestAccessMessage = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 12 }),
  color: colors.grey3,
  marginTop: '12px',
}));

const RequestAccessButton = styled.span(({ theme: { colors } }) => ({
  color: colors.blue,
  cursor: 'pointer',
  paddingLeft: '3px',
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const client = useApolloClient();

  const [createSession] = useMutation(createSessionMutation, {
    variables: {
      input: {
        email,
        password,
      },
    },
    onCompleted: data => {
      const {
        id: userId,
        token: userToken,
        fullName,
        organizationId,
      } = data.createSession;

      setLocalUser({ userId, userToken });
      setLocalAppState({ organizationId });
      client.writeData({ data: { isLoggedIn: true } });

      identify(userId, { name: fullName, email });
      track('Logged in');
      navigate('/');
    },
    onError: err => {
      clearLocalUser();
      clearLocalAppState();
      client.resetStore();

      console.dir(err); // TODO: Error handling on the page
    },
  });

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      createSession();
    }
  }

  const { isLoggedIn } = client.readQuery({ query: isLoggedInQuery });
  if (isLoggedIn) return <Redirect to="/" noThrow />;

  return (
    <OnboardingContainer title="Welcome back">
      <FieldsContainer>
        <Label htmlFor="email">EMAIL</Label>
        <OnboardingInputField
          name="email"
          onChange={event => setEmail(event.target.value)}
          type="email"
          value={email}
        />

        <Label htmlFor="password">PASSWORD</Label>
        <OnboardingInputField
          name="password"
          onChange={event => setPassword(event.target.value)}
          type="password"
          value={password}
          onKeyPress={handleKeyPress}
        />
      </FieldsContainer>
      <StyledButton onClick={createSession} title="Sign in" />
      <RequestAccessMessage>
        Need to get your team on Candor?
        <RequestAccessButton
          onClick={() => navigate('mailto:info@oncandor.com')}
        >
          Request early access
        </RequestAccessButton>
      </RequestAccessMessage>
    </OnboardingContainer>
  );
};

export default Login;
