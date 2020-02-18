import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import useDocumentMutations from './useDocumentMutations';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.grey7,
  borderRadius: '5px',
  height: '32px',
  cursor: 'pointer',
  padding: '0 20px',
  marginRight: '20px',
}));

const Label = styled.div({
  fontSize: '12px',
  fontWeight: 500,
  margin: '0 10px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '12px',
}));

const NewDocumentButton = () => {
  const { handleCreate, isSubmitting } = useDocumentMutations();

  async function handleCreateDocument() {
    const { documentId } = await handleCreate();

    if (documentId) {
      window.open(`/documents/${documentId}`, '_blank');
    }
  }

  return (
    <Container onClick={handleCreateDocument}>
      {isSubmitting ? (
        <LoadingIndicator color="grey4" size="18" />
      ) : (
        <>
          <StyledIcon icon={faFileAlt} />
          <Label>New document</Label>
        </>
      )}
    </Container>
  );
};

export default NewDocumentButton;
