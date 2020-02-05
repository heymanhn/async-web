import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import useDocumentMutations from './useDocumentMutations';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  cursor: 'pointer',
  padding: '0 20px',
});

const StyledPlus = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '20px',

  ':hover': {
    color: colors.grey1,
  },
}));

const NewDocumentButton = () => {
  const { handleCreate, isSubmitting } = useDocumentMutations();

  async function handleCreateDocument() {
    const { documentId } = await handleCreate();

    if (documentId) {
      window.open(`/d/${documentId}`, '_blank');
    }
  }

  return (
    <Container onClick={handleCreateDocument}>
      {isSubmitting ? (
        <LoadingIndicator color="grey4" size="18" />
      ) : (
        <StyledPlus icon={faPlus} />
      )}
    </Container>
  );
};

export default NewDocumentButton;
