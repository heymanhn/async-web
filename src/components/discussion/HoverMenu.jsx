import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const HoverMenu = ({
  conversationId,
  isOpen,
  messageId,
  ...props
}) => {
  const [isPickerOpen, setPickerState] = useState(false);

  return (
    <Container isOpen={isOpen || isPickerOpen} {...props}>
      <ButtonContainer>
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
};

export default HoverMenu;
