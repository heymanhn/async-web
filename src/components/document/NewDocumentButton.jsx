import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

import createDocumentMutation from 'graphql/mutations/createDocument';
import { track } from 'utils/analytics';

import LoadingIndicator from 'components/shared/LoadingIndicator';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  cursor: 'pointer',
  padding: '0 30px',
});

const StyledPlus = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '20px',

  ':hover': {
    color: colors.grey1,
  },
}));

const NewDocumentButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createDocument] = useMutation(createDocumentMutation, {
    variables: { input: {} },
  });

  async function handleCreateDocument() {
    setIsLoading(true);
    const { data } = await createDocument();

    setIsLoading(false);
    if (data.createDocument) {
      const { id: documentId } = data.createDocument;
      track('New document created', { documentId });

      window.open(`/d/${documentId}`, '_blank');
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to create new document'));
  }

  return (
    <Container onClick={handleCreateDocument}>
      {isLoading ? <LoadingIndicator color="grey4" size={18} /> : (
        <StyledPlus icon={faPlus} />
      )}
    </Container>
  );
};

export default NewDocumentButton;
