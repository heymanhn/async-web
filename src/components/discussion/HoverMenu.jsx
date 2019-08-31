import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import AddReactionButton from './AddReactionButton';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  height: '32px',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.1s',
}));

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: colors.grey4,
  padding: '0px 12px',

  ':hover': {
    color: colors.grey2,
  },
}));

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '16px',
  margin: '0px',
}));

const HoverMenu = ({
  conversationId,
  isOpen,
  messageId,
  onAddReaction,
  showAddReactionButton,
  ...props
}) => {
  const [isPickerOpen, setPickerState] = useState(false);

  const handleClickAddReactionButton = (event) => {
    event.stopPropagation();
    onAddReaction();
  };

  return (
    <Container isOpen={isOpen || isPickerOpen} {...props}>
      <ButtonContainer onClick={handleClickAddReactionButton}>
        <AddReactionButton
          conversationId={conversationId}
          messageId={messageId}
          onPickerStateChange={setPickerState}
          placement="below"
        />
      </ButtonContainer>
    </Container>
  );
};

HoverMenu.propTypes = {
  conversationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  onAddReaction: PropTypes.func.isRequired,
  showReplyButton: PropTypes.bool,
};

export default HoverMenu;
