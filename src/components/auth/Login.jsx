import React, { useState } from 'react';
import { useMutation, useApolloClient } from 'react-apollo';
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
import useMountEffect from 'utils/hooks/useMountEffect';
import { identify, page, track } from 'utils/analytics';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import OnboardingContainer from './OnboardingContainer';

const FieldsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '25px',
  width: '300px',
});

const Label = styled.div(({ theme: { colors } }) => ({
  alignSelf: 'flex-start',
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '5px',
}));

const StyledButton = styled(Button)({
  marginTop: '15px',
  textAlign: 'center',
  width: '300px',
});

const RequestAccessMessage = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
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
  useMountEffect(() => page('Login page'));

  const [createSession] = useMutation(createSessionMutation, {
    variables: {
      input: {
        email,
        password,
      },
    },
    onCompleted: (data) => {
      const { id: userId, token: userToken, fullName, organizationId } = data.createSession;

      setLocalUser({ userId, userToken });
      setLocalAppState({ organizationId });
      client.writeData({ data: { isLoggedIn: true } });

      identify(userId, { name: fullName, email });
      track('Logged in');
      navigate('/');
    },
    onError: (err) => {
      clearLocalUser();
      clearLocalAppState();
      client.resetStore();

      console.dir(err); // TODO: Error handling on the page
    },
  });

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
        />
      </FieldsContainer>
      <StyledButton onClick={createSession} title="Sign in" />
      <RequestAccessMessage>
        Need to get your team on Roval?
        <RequestAccessButton onClick={() => navigate('mailto:info@roval.co')}>
          Request early access
        </RequestAccessButton>
      </RequestAccessMessage>
    </OnboardingContainer>
  );
};

export default Login;
