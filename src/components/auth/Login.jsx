import React, { useState } from 'react';
import { useMutation, useApolloClient } from 'react-apollo';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import createSessionMutation from 'graphql/mutations/createSession';
import {
  setLocalUser,
  clearLocalUser,
} from 'utils/auth';

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

const Label = styled.label({

});

const InputField = styled.input({
  fontSize: '16px',
  width: '200px',
});

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
    onCompleted: (data) => {
      const { id: userId, token: userToken, fullName, organizationId } = data.createSession;

      setLocalUser({ userId, userToken, organizationId });
      window.analytics.identify(userId, { name: fullName, email });
      client.writeData({ data: { isLoggedIn: true } });

      navigate('/');
    },
    onError: (err) => {
      clearLocalUser();
      client.resetStore();

      console.dir(err); // TODO: Error handling on the page
    },
  });

  const { isLoggedIn } = client.readQuery({ query: isLoggedInQuery });
  if (isLoggedIn) return <Redirect to="/" noThrow />;

  return (
    <Container>
      <Title>Welcome back</Title>

      <Label htmlFor="email">Email</Label>
      <InputField
        name="email"
        onChange={event => setEmail(event.target.value)}
        type="email"
        value={email}
      />

      <Label htmlFor="password">Password</Label>
      <InputField
        name="password"
        onChange={event => setPassword(event.target.value)}
        type="password"
        value={password}
      />

      <Button onClick={createSession} title="Sign in" />
    </Container>
  );
};

export default Login;
