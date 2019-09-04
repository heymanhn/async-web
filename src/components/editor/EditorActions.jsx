import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Button from 'components/shared/Button';

const Container = styled.div(({ showHint }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: showHint ? 'space-between' : 'flex-start',

  marginTop: '25px',
}));

const ButtonsContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledButton = styled(Button)({
  marginRight: '10px',
});

const HintText = styled.div(({ theme: { colors } }) => ({
  color: colors.grey6,
  fontSize: '14px',
}));

const EditorActions = ({
  isSubmitDisabled,
  isSubmitting,
  mode,
  onCancel,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.stopPropagation();
    return isSubmitDisabled ? null : onSubmit();
  };

  return (
    <Container showHint={!isSubmitDisabled}>
      <ButtonsContainer>
        <StyledButton
          isDisabled={isSubmitDisabled}
          loading={isSubmitting}
          onClick={handleSubmit}
          title={mode === 'compose' ? 'Post' : 'Save'}
          type="light"
        />
        <StyledButton
          onClick={onCancel}
          title="Cancel"
          type="grey"
        />
      </ButtonsContainer>
      {!isSubmitDisabled && (
        <HintText>
          {`Press ⌘ + Enter to ${mode === 'compose' ? 'post' : 'save'}`}
        </HintText>
      )}
    </Container>
  );
};

EditorActions.propTypes = {
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditorActions;
