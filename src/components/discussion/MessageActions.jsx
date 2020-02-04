import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DiscussionContext, MessageContext } from 'utils/contexts';

import Button from 'components/shared/Button';
import useDraftMutations from './useDraftMutations';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',

  marginTop: '25px',
});

const ButtonsContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledButton = styled(Button)({
  height: '32px',
  marginLeft: '10px',
  padding: '4px 25px',
});

const MessageActions = ({ handleSubmit, isSubmitDisabled, isSubmitting }) => {
  const { draft } = useContext(DiscussionContext);
  const { mode, handleCancel } = useContext(MessageContext);
  const { handleDeleteDraft } = useDraftMutations();

  function handleSubmitWrapper(event) {
    event.stopPropagation();
    return isSubmitDisabled ? null : handleSubmit();
  }

  async function handleCancelWrapper(event) {
    event.stopPropagation();

    if (mode === 'compose' && draft) await handleDeleteDraft();
    handleCancel();
  }

  return (
    <Container>
      <ButtonsContainer>
        <StyledButton
          isDisabled={isSubmitDisabled}
          loading={isSubmitting}
          onClick={handleSubmitWrapper}
          title={mode === 'compose' ? 'Post' : 'Save'}
          type="light"
        />
        <StyledButton
          onClick={handleCancelWrapper}
          title={mode === 'compose' && draft ? 'Discard Draft' : 'Cancel'}
          type="grey"
        />
      </ButtonsContainer>
    </Container>
  );
};

MessageActions.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default MessageActions;
