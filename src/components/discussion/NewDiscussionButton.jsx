import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import useDiscussionMutations from './useDiscussionMutations';

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

const NewDiscussionButton = () => {
  const { handleCreate, isSubmitting } = useDiscussionMutations();

  async function handleCreateDocument() {
    const { discussionId } = await handleCreate();

    if (discussionId) {
      window.open(`/discussions/${discussionId}`, '_blank');
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

export default NewDiscussionButton;
