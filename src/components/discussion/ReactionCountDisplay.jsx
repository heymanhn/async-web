import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ isActive, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: isActive ? colors.hoverBlue : 'none',
  cursor: 'pointer',
  padding: '0 15px',
  height: '36px',
}));

const Icon = styled.div({
  fontSize: '18px',
  marginRight: '8px',
});

const ReactionCount = styled.div(({ isActive, theme: { colors } }) => ({
  color: isActive ? colors.blue : colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

class ReactionCountDisplay extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const {
      code,
      currentUserReactionId,
      onAddReaction,
      onRemoveReaction,
    } = this.props;
    return currentUserReactionId ? onRemoveReaction(currentUserReactionId) : onAddReaction(code);
  }

  render() {
    const {
      currentUserReactionId,
      icon,
      onAddReaction,
      onRemoveReaction,
      reactionCount,
      ...props
    } = this.props;

    return (
      <Container
        isActive={!!currentUserReactionId}
        onClick={this.handleClick}
        {...props}
      >
        <Icon>{icon}</Icon>
        <ReactionCount isActive={!!currentUserReactionId}>
          {reactionCount}
        </ReactionCount>
      </Container>
    );
  }
}

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
