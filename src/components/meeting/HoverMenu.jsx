import React from 'react';
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
  onAddReaction,
  onEdit,
  onReply,
  replyCount,
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
    <ButtonContainer onClick={handleClickReplyButton}>
      <StyledIcon icon={faComment} />
      {replyCount > 0 ? `view ${Pluralize('reply', replyCount)}` : 'reply'}
    </ButtonContainer>
  );
  const editButton = (
    <ButtonContainer onClick={handleClickEditButton}>
      <StyledIcon icon={faEdit} />
      edit
    </ButtonContainer>
  );
  const addReactionButton = (
    <ButtonContainer onClick={handleClickAddReactionButton}>
      <AddReactionButton />
    </ButtonContainer>
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
  replyCount: PropTypes.number,
  showAddReactionButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showReplyButton: PropTypes.bool,
};

HoverMenu.defaultProps = {
  bgMode: 'white',
  onAddReaction: () => {},
  onEdit: () => { },
  onReply: () => { },
  replyCount: 0,
  showAddReactionButton: false,
  showEditButton: false,
  showReplyButton: false,
};

export default HoverMenu;
