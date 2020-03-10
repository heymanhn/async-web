import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import createOrganizationMutation from 'graphql/mutations/createOrganization';
import { setLocalAppState } from 'utils/auth';
import useMountEffect from 'utils/hooks/useMountEffect';
import { group, track } from 'utils/analytics';

import Button from 'components/shared/Button';
import { OnboardingInputField } from 'styles/shared';
import OnboardingContainer from './OnboardingContainer';

const FieldsContainer = styled.div({
  marginTop: '30px',
});

const StyledButton = styled(Button)({
  marginTop: '15px',
  textAlign: 'center',
  width: '300px',
});

const OrganizationCreate = () => {
  const [title, setTitle] = useState('');
  useMountEffect(() => {
    track('Onboarding page viewed: Create Organization');
  });

  const [createOrganization] = useMutation(createOrganizationMutation, {
    variables: {
      input: {
        title,
      },
    },
    onCompleted: data => {
      const { id: organizationId } = data.createOrganization;

      setLocalAppState({ organizationId });
      group(organizationId);
      navigate(`/organizations/${organizationId}/invites`);
    },
    onError: err => {
      console.dir(err); // TODO: Error handling on the page
    },
  });

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      createOrganization();
    }
  }

  return (
    <OnboardingContainer title="What’s the name of your company or team?">
      <FieldsContainer>
        <OnboardingInputField
          name="organizationName"
          onChange={event => setTitle(event.target.value)}
          placeholder="e.g. Acme"
          type="text"
          value={title}
          onKeyPress={handleKeyPress}
        />
      </FieldsContainer>

      <StyledButton onClick={createOrganization} title="Next" />
    </OnboardingContainer>
  );
};

export default OrganizationCreate;
