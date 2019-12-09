// HN: Same as EditorActionsRow, but with different UI
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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

const InlineEditorActionsRow = ({
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

  async function handleDiscardDraft() {
    await onDiscardDraft();
    onCancel();
  }

  return (
    <Container>
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
    </Container>
  );
};

InlineEditorActionsRow.propTypes = {
  isDraftSaved: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDiscardDraft: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

InlineEditorActionsRow.defaultProps = {
  onDiscardDraft: () => {},
};

export default InlineEditorActionsRow;
