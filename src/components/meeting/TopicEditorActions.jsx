// DRY this up with <EditorActions /> once we agree on a consistent UI for editing
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Button from 'components/shared/Button';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const SmallButton = styled(Button)(({ isDisabled }) => ({
  cursor: isDisabled ? 'default' : 'pointer',
  marginRight: '10px',
  opacity: isDisabled ? 0.5 : 1,
  padding: '5px 20px',
}));

const TopicEditorActions = ({ isSubmitDisabled, mode, onCancel, onCreate, onUpdate }) => (
  <Container>
    <SmallButton
      title={mode === 'compose' ? 'Add Topic' : 'Save'}
      onClick={mode === 'compose' ? onCreate : onUpdate}
      isDisabled={isSubmitDisabled}
    />
    <SmallButton type="light" title="Cancel" onClick={onCancel} />
  </Container>
);

TopicEditorActions.propTypes = {
  isSubmitDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['compose', 'edit']).isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default TopicEditorActions;
