import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import useDiscussionMutations from './useDiscussionMutations';

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

const NewDiscussionButton = () => {
  const { handleCreate, isSubmitting } = useDiscussionMutations();

  async function handleCreateDiscussion() {
    const { discussionId } = await handleCreate();

    if (discussionId) {
      window.open(`/discussions/${discussionId}`, '_blank');
    }
  }

  return (
    <Container onClick={handleCreateDiscussion}>
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
