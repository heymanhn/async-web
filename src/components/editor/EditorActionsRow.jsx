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

const EditorActionsRow = ({
  isDraftSaved,
  isSubmitDisabled,
  isSubmitting,
  mode,
  onCancel,
  onDiscardDraft,
  onSubmit,
}) => {
  function handleSubmit(event) {
    event.stopPropagation();
    return isSubmitDisabled ? null : onSubmit();
  }

  function handleDiscardDraft() {
    onDiscardDraft();
    onCancel();
  }

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
        {isDraftSaved ? (
          <StyledButton
            onClick={handleDiscardDraft}
            title="Discard Draft"
            type="grey"
          />
        ) : (
          <StyledButton
            onClick={onCancel}
            title="Cancel"
            type="grey"
          />
        )}
      </ButtonsContainer>
      {!isSubmitDisabled && (
        <HintText>
          {`Press ⌘ + Enter to ${mode === 'compose' ? 'post' : 'save'}`}
        </HintText>
      )}
    </Container>
  );
};

EditorActionsRow.propTypes = {
  isDraftSaved: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDiscardDraft: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

EditorActionsRow.defaultProps = {
  onDiscardDraft: () => {},
};

export default EditorActionsRow;
