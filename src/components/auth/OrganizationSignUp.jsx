import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useApolloClient } from 'react-apollo';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import createUserMutation from 'graphql/mutations/createUser';
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

const OrganizationSignUp = ({ organizationId }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const client = useApolloClient();

  const [createUser] = useMutation(createUserMutation, {
    variables: {
      input: {
        fullName,
        email,
        password,
        organizationId,
      },
    },
    onCompleted: (data) => {
      const { id: userId, token: userToken } = data.createUser;

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

  const { data } = useQuery(isLoggedInQuery);
  if ((data && data.isLoggedIn) || !organizationId) return <Redirect to="/" noThrow />;

  return (
    <Container>
      <Title>Welcome to Roval</Title>

      <Label htmlFor="name">Full Name</Label>
      <InputField
        name="name"
        onChange={event => setFullName(event.target.value)}
        type="text"
        value={fullName}
      />

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

      <Button onClick={createUser} title="Sign up" />
    </Container>
  );
};

OrganizationSignUp.propTypes = {
  organizationId: PropTypes.string,
};

OrganizationSignUp.defaultProps = {
  organizationId: null,
};

export default OrganizationSignUp;
