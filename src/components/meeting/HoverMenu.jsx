import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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
  color: colors.grey2,
  fontSize: '12px',
  fontWeight: 500,
  padding: '0px 12px',

  ':hover': {
    color: colors.grey1,
  },
}));

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '16px',
  margin: '0px',
}));

const HoverMenu = ({
  onAddReaction,
  onEdit,
  onReply,
  showAddReactionButton,
  showEditButton,
  showReplyButton,
  ...props
}) => {
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

  const replyButton = (
    <ButtonContainer onClick={handleClickReplyButton}>add a reply</ButtonContainer>
  );
  const editButton = (
    <ButtonContainer onClick={handleClickEditButton}>edit reply</ButtonContainer>
  );
  const addReactionButton = (
    <ButtonContainer onClick={handleClickAddReactionButton}>:)</ButtonContainer>
  );

  return (
    <Container {...props}>
      {showReplyButton && replyButton}
      {showReplyButton && <VerticalDivider />}
      {showEditButton && editButton}
      {showEditButton && <VerticalDivider />}
      {showAddReactionButton && addReactionButton}
    </Container>
  );
};

HoverMenu.propTypes = {
  bgMode: PropTypes.oneOf(['white', 'grey']),
  isOpen: PropTypes.bool.isRequired,
  onAddReaction: PropTypes.func,
  onEdit: PropTypes.func,
  onReply: PropTypes.func,
  showAddReactionButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showReplyButton: PropTypes.bool,
};

HoverMenu.defaultProps = {
  bgMode: 'white',
  onAddReaction: () => {},
  onEdit: () => { },
  onReply: () => { },
  showAddReactionButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showReplyButton: PropTypes.bool,
};

export default HoverMenu;
