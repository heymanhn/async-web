import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Redirect, navigate } from '@reach/router';
import styled from '@emotion/styled';

import createInvitesMutation from 'graphql/mutations/createInvites';
import localStateQuery from 'graphql/queries/localState';
import { setLocalAppState } from 'utils/auth';
import useMountEffect from 'hooks/shared/useMountEffect';
import { track } from 'utils/analytics';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import OnboardingContainer from './OnboardingContainer';

const FieldsContainer = styled.div({
  marginTop: '30px',
  width: '300px',
});

const SkipStep = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 12 }),
  color: colors.grey3,
  cursor: 'pointer',
  marginTop: '12px',
}));

const StyledButton = styled(Button)({
  marginTop: '15px',
  textAlign: 'center',
  width: '300px',
});

const InviteTeam = ({ organizationId }) => {
  const [firstEmail, setFirstEmail] = useState('');
  const [secondEmail, setSecondEmail] = useState('');
  const [thirdEmail, setThirdEmail] = useState('');
  const client = useApolloClient();
  const { isOnboarding } = client.readQuery({ query: localStateQuery });
  useMountEffect(() => {
    track('Onboarding page viewed: Invite Team', { isOnboarding });
  });

  function handleSkip() {
    setLocalAppState({ isOnboarding: false });
    client.writeData({ data: { isOnboarding: false } });
    navigate('/');
  }

  function gatherEmails() {
    return [firstEmail, secondEmail, thirdEmail].filter(e => e !== '');
  }

  const [createInvites] = useMutation(createInvitesMutation, {
    onCompleted: handleSkip,
  });

  function handleCreateInvites() {
    const emails = gatherEmails();
    if (!emails.length) return;

    createInvites({ variables: { organizationId, input: { emails } } });
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateInvites();
    }
  }

  if (!organizationId) return <Redirect to="/" noThrow />;

  return (
    <OnboardingContainer title="Invite your team by email">
      <FieldsContainer>
        <OnboardingInputField
          name="firstEmail"
          onChange={event => setFirstEmail(event.target.value)}
          placeholder="jane@example.com"
          type="email"
          value={firstEmail}
          onKeyPress={handleKeyPress}
        />
        <OnboardingInputField
          name="secondEmail"
          onChange={event => setSecondEmail(event.target.value)}
          placeholder="jack@example.com"
          type="email"
          value={secondEmail}
          onKeyPress={handleKeyPress}
        />
        <OnboardingInputField
          name="thirdEmail"
          onChange={event => setThirdEmail(event.target.value)}
          placeholder="jess@example.com"
          type="email"
          value={thirdEmail}
          onKeyPress={handleKeyPress}
        />
      </FieldsContainer>

      <StyledButton
        isDisabled={!gatherEmails().length}
        onClick={handleCreateInvites}
        title="Send invites"
      />

      <SkipStep onClick={handleSkip}>Not now, thanks</SkipStep>
    </OnboardingContainer>
  );
};

InviteTeam.propTypes = {
  organizationId: PropTypes.string,
};

InviteTeam.defaultProps = {
  organizationId: null,
};

export default InviteTeam;
