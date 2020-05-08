import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ isActive, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: isActive ? colors.hoverBlue : 'none',
  cursor: 'pointer',
  padding: '0 15px',
  height: '32px',
}));

const Icon = styled.div({
  fontSize: '16px',
  marginRight: '8px',
});

const ReactionCount = styled.div(
  ({ isActive, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 14, weight: 500 }),
    color: isActive ? colors.blue : colors.grey3,
  })
);

const ReactionCountDisplay = ({
  code,
  currentUserReactionId,
  icon,
  onAddReaction,
  onRemoveReaction,
  reactionCount,
  ...props
}) => {
  function handleClick(event) {
    event.stopPropagation();
    return currentUserReactionId
      ? onRemoveReaction(currentUserReactionId, code)
      : onAddReaction(code);
  }

  return (
    <Container
      isActive={!!currentUserReactionId}
      onClick={handleClick}
      {...props}
    >
      <Icon>{icon}</Icon>
      <ReactionCount isActive={!!currentUserReactionId}>
        {reactionCount}
      </ReactionCount>
    </Container>
  );
};

ReactionCountDisplay.propTypes = {
  code: PropTypes.string.isRequired,
  currentUserReactionId: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onAddReaction: PropTypes.func.isRequired,
  onRemoveReaction: PropTypes.func.isRequired,
  reactionCount: PropTypes.number.isRequired,
};

ReactionCountDisplay.defaultProps = {
  currentUserReactionId: null,
};

export default ReactionCountDisplay;
