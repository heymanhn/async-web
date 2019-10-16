import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import createOrganizationMutation from 'graphql/mutations/createOrganization';

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

const OrganizationCreate = () => {
  const [title, setTitle] = useState('');

  const [createOrganization] = useMutation(createOrganizationMutation, {
    variables: {
      input: {
        title,
      },
    },
    onCompleted: (data) => {
      const { id: organizationId } = data.createOrganization;

      navigate(`/organizations/${organizationId}/invites`);
    },
    onError: (err) => {
      console.dir(err); // TODO: Error handling on the page
    },
  });

  return (
    <Container>
      <Title>What’s the name of your company or team?</Title>
      <InputField
        name="name"
        onChange={event => setTitle(event.target.value)}
        type="text"
        value={title}
      />

      <Button onClick={createOrganization} title="Next" />
    </Container>
  );
};

export default OrganizationCreate;
