import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Button from 'components/shared/Button';

const SmallContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '10px',
});

const LargeContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  borderRadius: '0 0 5px 5px',
  margin: '20px -17px 0 -68px',
  minHeight: '56px',
  paddingLeft: '65px',
  paddingRight: '20px',
  position: 'relative',
  left: '3px',
}));

// For the small version only
const SaveLink = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: colors.blue,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  marginRight: '20px',
  opacity: isDisabled ? 0.5 : 1,
}));

// For the small version only
const CancelLink = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}));

// For the large version only
const StyledButton = styled(Button)(({ isDisabled }) => ({
  cursor: isDisabled ? 'default' : 'pointer',
  marginRight: '10px',
  opacity: isDisabled ? 0.5 : 1,
  padding: '5px 20px',
}));

// TODO (HN): Pass the action buttons' text into the component in the future
const EditorActions = ({ isSubmitDisabled, mode, onCancel, onSubmit, size }) => {
  const buttons = {
    save: {
      small: (
        <SaveLink onClick={isSubmitDisabled ? () => { } : onSubmit} isDisabled={isSubmitDisabled}>
          {mode === 'edit' ? 'Update' : 'Reply'}
        </SaveLink>
      ),
      large: (
        <StyledButton
          title={mode === 'compose' ? 'Add Topic' : 'Save'}
          onClick={onSubmit}
          isDisabled={isSubmitDisabled}
        />
      ),
    },
    cancel: {
      small: <CancelLink onClick={onCancel}>Cancel</CancelLink>,
      large: <StyledButton type="light" title="Cancel" onClick={onCancel} />,
    },
  };

  const buttonsToDisplay = (
    <React.Fragment>
      {buttons.save[size]}
      {buttons.cancel[size]}
    </React.Fragment>
  );

  if (size === 'small') return <SmallContainer>{buttonsToDisplay}</SmallContainer>;
  return <LargeContainer>{buttonsToDisplay}</LargeContainer>;
};

EditorActions.propTypes = {
  isSubmitDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'large']),
};

EditorActions.defaultProps = {
  mode: null,
  size: 'small',
};

export default EditorActions;
