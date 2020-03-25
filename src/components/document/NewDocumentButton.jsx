import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import useResourceCreator from 'utils/hooks/useResourceCreator';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.altBlue,
  borderRadius: '5px',
  color: colors.white,
  height: '34px',
  cursor: 'pointer',
  padding: '0 15px',
  marginRight: '20px',
}));

const Label = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  margin: '0 10px',
  marginTop: '-2px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '14px',
}));

const NewDocumentButton = () => {
  const { handleCreateResource, isSubmitting } = useResourceCreator(
    'documents'
  );

  return (
    <Container onClick={handleCreateResource}>
      {isSubmitting ? (
        <LoadingIndicator color="grey4" size="18" />
      ) : (
        <>
          <StyledIcon icon="file-alt" />
          <Label>New document</Label>
        </>
      )}
    </Container>
  );
};

export default NewDocumentButton;
