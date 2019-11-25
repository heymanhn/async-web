import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

import createDocumentMutation from 'graphql/mutations/createDocument';
import { track } from 'utils/analytics';

import LoadingIndicator from 'components/shared/LoadingIndicator';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  color: colors.grey2,
  height: '28px',
  padding: '0 15px',
}));

const StyledPlus = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
  marginRight: '8px',
}));

const ButtonTitle = styled.div({
  fontSize: '12px',
  fontWeight: 500,
});

const StyledLoadingIndicator = styled(LoadingIndicator)({
  marginRight: '8px',
});

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
      {isLoading && <StyledLoadingIndicator color="grey4" size={12} />}
      {!isLoading && <StyledPlus icon={faPlus} />}
      <ButtonTitle>New Document</ButtonTitle>
    </Container>
  );
};

export default NewDocumentButton;
