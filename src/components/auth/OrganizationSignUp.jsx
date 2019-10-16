import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import createUserMutation from 'graphql/mutations/createUser';
import {
  setLocalUser,
  clearLocalUser,
} from 'utils/auth';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import OnboardingContainer from './OnboardingContainer';

const Description = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '16px',
  marginBottom: '25px',
}));

const FieldsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
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

const LoginMessage = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
  marginTop: '12px',
}));

const SignInButton = styled.span(({ theme: { colors } }) => ({
  color: colors.blue,
  cursor: 'pointer',
  paddingLeft: '3px',
}));

/*
 * Either organizationId or inviteCode must be provided.
 * organizationId: someone needing to create an account to join an existing organization
 * inviteCode: create an account and the organization
 */
const OrganizationSignUp = ({ organizationId, inviteCode }) => {
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
        inviteCode,
      },
    },
    onCompleted: (data) => {
      const { id: userId, token: userToken } = data.createUser;

      setLocalUser({ userId, userToken, organizationId });
      window.analytics.identify(userId, { name: fullName, email });
      client.writeData({ data: { isLoggedIn: true, isOnboarding: true } });

      const returnPath = inviteCode ? '/organizations' : `/organizations/${organizationId}/invites`;
      navigate(returnPath);
    },
    onError: (err) => {
      clearLocalUser();
      client.resetStore();

      console.dir(err); // TODO: Error handling on the page
    },
  });

  const requiredFieldsPresent = organizationId || inviteCode;
  const { data } = client.readQuery({ query: isLoggedInQuery });
  if ((data && data.isLoggedIn) || !requiredFieldsPresent) return <Redirect to="/" noThrow />;

  return (
    <OnboardingContainer title="Welcome to Roval!">
      <Description>Create an account to get started.</Description>
      <FieldsContainer>
        <Label htmlFor="name">NAME</Label>
        <OnboardingInputField
          name="name"
          onChange={event => setFullName(event.target.value)}
          type="text"
          value={fullName}
        />

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
          placeholder="Minimum 8 characters"
          type="password"
          value={password}
        />
      </FieldsContainer>
      <StyledButton onClick={createUser} title="Sign up" />
      <LoginMessage>
        Already have an account?
        <SignInButton onClick={() => navigate('/login')}>Sign in</SignInButton>
      </LoginMessage>
    </OnboardingContainer>
  );
};

OrganizationSignUp.propTypes = {
  organizationId: PropTypes.string,
  inviteCode: PropTypes.string,
};

OrganizationSignUp.defaultProps = {
  organizationId: null,
  inviteCode: null,
};

export default OrganizationSignUp;
