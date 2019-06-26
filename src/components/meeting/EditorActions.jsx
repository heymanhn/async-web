import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '10px',
});

const SaveButton = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: colors.blue,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  marginRight: '20px',
  opacity: isDisabled ? 0.5 : 1,
}));

const CancelButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}));

const EditorActions = ({ isSubmitDisabled, mode, onCancel, onSubmit }) => (
  <Container>
    <SaveButton onClick={isSubmitDisabled ? () => {} : onSubmit} isDisabled={isSubmitDisabled}>
      {mode === 'edit' ? 'Update' : 'Reply'}
    </SaveButton>
    <CancelButton onClick={onCancel}>Cancel</CancelButton>
  </Container>
);

EditorActions.propTypes = {
  isSubmitDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['compose', 'edit']).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditorActions;
