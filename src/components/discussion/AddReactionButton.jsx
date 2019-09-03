import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

import ReactionPicker from './ReactionPicker';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey4,

  ':hover': {
    color: colors.grey3,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)({
  cursor: 'pointer',
  fontSize: '16px',
});

const PlusSign = styled.div({
  fontSize: '16px',
  fontWeight: 500,
  marginLeft: '2px',
  marginTop: '-4px',
});

const AddReactionButton = ({
  conversationId,
  messageId,
  onPickerStateChange,
  placement,
  ...props
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  function handlePickerChange(newState) {
    if (isPickerOpen !== newState) {
      onPickerStateChange(newState);
      setIsPickerOpen(newState);
    }
  }
  function handleOpenPicker() {
    if (isOutsideClick) {
      setIsOutsideClick(false);
      return;
    }
    handlePickerChange(true);
  }
  function handleClosePicker({ outsideClick } = {}) {
    if (outsideClick) setIsOutsideClick(true);
    handlePickerChange(false);
  }

  return (
    <Container {...props}>
      <ButtonContainer onClick={handleOpenPicker}>
        <StyledIcon icon={faLaugh} />
        <PlusSign>+</PlusSign>
      </ButtonContainer>
      <ReactionPicker
        conversationId={conversationId}
        handleClose={handleClosePicker}
        isOpen={isPickerOpen}
        messageId={messageId}
        placement={placement}
      />
    </Container>
  );
};

AddReactionButton.propTypes = {
  conversationId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  onPickerStateChange: PropTypes.func,
  placement: PropTypes.oneOf(['above', 'below']).isRequired,
};

AddReactionButton.defaultProps = {
  onPickerStateChange: () => {},
};

export default AddReactionButton;
