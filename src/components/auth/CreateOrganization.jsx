import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import createOrganizationMutation from 'graphql/mutations/createOrganization';
import { setLocalAppState } from 'utils/auth';
import useMountEffect from 'utils/hooks/useMountEffect';
import { page } from 'utils/analytics';

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
  useMountEffect(() => page('Onboarding: Create Organization'));

  const [createOrganization] = useMutation(createOrganizationMutation, {
    variables: {
      input: {
        title,
      },
    },
    onCompleted: (data) => {
      const { id: organizationId } = data.createOrganization;

      setLocalAppState({ organizationId });
      navigate(`/organizations/${organizationId}/invites`);
    },
    onError: (err) => {
      console.dir(err); // TODO: Error handling on the page
    },
  });

  return (
    <OnboardingContainer title="What’s the name of your company or team?">
      <FieldsContainer>
        <OnboardingInputField
          name="organizationName"
          onChange={event => setTitle(event.target.value)}
          placeholder="e.g. Acme"
          type="text"
          value={title}
        />
      </FieldsContainer>

      <StyledButton onClick={createOrganization} title="Next" />
    </OnboardingContainer>
  );
};

export default OrganizationCreate;
