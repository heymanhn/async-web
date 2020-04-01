import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useResourceCreator from 'utils/hooks/useResourceCreator';
import { WorkspaceContext } from 'utils/contexts';

import LoadingIndicator from 'components/shared/LoadingIndicator';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.blue,
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

const NewDiscussionButton = () => {
  const { workspaceId: parentWorkspaceId } = useContext(WorkspaceContext);
  const { handleCreateResource, isSubmitting } = useResourceCreator(
    'discussion'
  );

  return (
    <Container onClick={() => handleCreateResource({ parentWorkspaceId })}>
      {isSubmitting ? (
        <LoadingIndicator color="grey4" size="18" />
      ) : (
        <>
          <StyledIcon icon="comments-alt" />
          <Label>New discussion</Label>
        </>
      )}
    </Container>
  );
};

export default NewDiscussionButton;
