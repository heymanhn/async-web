import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEdit } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import AddReactionButton from './AddReactionButton';

const Container = styled.div(({ bgMode, isOpen, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: bgMode === 'white' ? colors.white : colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '25px',
  cursor: 'pointer',
  minHeight: '30px',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.1s',
}));

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: colors.grey2,
  fontSize: '12px',
  fontWeight: 500,
  padding: '0px 12px',

  ':hover': {
    color: colors.grey1,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '16px',
  marginRight: '5px',
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
  onEdit,
  onReply,
  replyCount,
  showAddReactionButton,
  showEditButton,
  showReplyButton,
  ...props
}) => {
  const [isPickerOpen, setPickerState] = useState(false);
  if (!showAddReactionButton && !showEditButton && !showReplyButton) return null;

  const handleClickAddReactionButton = (event) => {
    event.stopPropagation();
    onAddReaction();
  };
  const handleClickEditButton = (event) => {
    event.stopPropagation();
    onEdit();
  };
  const handleClickReplyButton = (event) => {
    event.stopPropagation();
    onReply();
  };

  return (
    <Container isOpen={isOpen || isPickerOpen} {...props}>
      {showReplyButton && (
        <ButtonContainer onClick={handleClickReplyButton}>
          <StyledIcon icon={faComment} />
          {replyCount > 0 ? `view ${Pluralize('reply', replyCount)}` : 'reply'}
        </ButtonContainer>
      )}
      {showReplyButton && <VerticalDivider />}
      {showEditButton && (
        <ButtonContainer onClick={handleClickEditButton}>
          <StyledIcon icon={faEdit} />
          edit
        </ButtonContainer>
      )}
      {showEditButton && <VerticalDivider />}
      {showAddReactionButton && (
        <ButtonContainer onClick={handleClickAddReactionButton}>
          <AddReactionButton
            conversationId={conversationId}
            messageId={messageId}
            source="hoverMenu"
            onPickerStateChange={setPickerState}
          />
        </ButtonContainer>
      )}
    </Container>
  );
};

HoverMenu.propTypes = {
  bgMode: PropTypes.oneOf(['white', 'grey']),
  conversationId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  messageId: PropTypes.string,
  onAddReaction: PropTypes.func,
  onEdit: PropTypes.func,
  onReply: PropTypes.func,
  replyCount: PropTypes.number,
  showAddReactionButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showReplyButton: PropTypes.bool,
};

HoverMenu.defaultProps = {
  bgMode: 'white',
  conversationId: null,
  messageId: null,
  onAddReaction: () => {},
  onEdit: () => { },
  onReply: () => { },
  replyCount: 0,
  showAddReactionButton: false,
  showEditButton: false,
  showReplyButton: false,
};

export default HoverMenu;
