import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';

import Button from 'components/shared/Button';

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

const MessageActions = ({
  handleSubmit,
  handleCancel,
  isDraft,
  isSubmitDisabled,
  isSubmitting,
}) => {
  const { mode } = useContext(MessageContext);

  function handleSubmitWrapper(event) {
    event.stopPropagation();
    return isSubmitDisabled ? null : handleSubmit();
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
          onClick={handleCancel}
          title={isDraft ? 'Discard Draft' : 'Cancel'}
          type="grey"
        />
      </ButtonsContainer>
    </Container>
  );
};

MessageActions.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default MessageActions;
