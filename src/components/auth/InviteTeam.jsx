import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import createInvitesMutation from 'graphql/mutations/createInvites';
import localStateQuery from 'graphql/queries/localState';
import { setLocalAppState } from 'utils/auth';
import useMountEffect from 'utils/hooks/useMountEffect';
import { track } from 'utils/analytics';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import Modal from 'components/shared/Modal';
import OnboardingContainer from './OnboardingContainer';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'center',
  background: colors.bgGrey,
}));

const FieldsContainer = styled.div({
  marginTop: '30px',
  width: '300px',
});

const SkipStep = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '12px',
  marginTop: '12px',
}));

const StyledButton = styled(Button)({
  marginTop: '15px',
  textAlign: 'center',
  width: '300px',
});

const InviteTeam = ({ organizationId, isOpen, handleClose }) => {
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
    onError: err => {
      console.dir(err); // TODO: Error handling on the page
    },
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

  if (!organizationId) handleClose();

  return (
    <StyledModal isOpen={isOpen} handleClose={handleClose}>
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
    </StyledModal>
  );
};

InviteTeam.propTypes = {
  organizationId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

InviteTeam.defaultProps = {
  organizationId: null,
};

export default InviteTeam;
