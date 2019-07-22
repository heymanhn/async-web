import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ contentType, isActive, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: isActive ? colors.hoverBlue : 'none',
  cursor: 'pointer',
  padding: contentType === 'modalReply' ? '0 15px' : '0 20px',
  height: contentType === 'modalReply' ? '32px' : '52px',
}));

const Icon = styled.div(({ contentType }) => ({
  fontSize: contentType === 'modalReply' ? '14px' : '24px',
  marginRight: '8px',
}));

const ReactionCount = styled.div(({ isActive, contentType, theme: { colors } }) => ({
  color: isActive ? colors.blue : colors.grey3,
  fontSize: contentType === 'modalReply' ? '13px' : '14px',
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
      contentType,
      currentUserReactionId,
      icon,
      onAddReaction,
      onRemoveReaction,
      reactionCount,
      ...props
    } = this.props;

    return (
      <Container
        contentType={contentType}
        isActive={!!currentUserReactionId}
        onClick={this.handleClick}
        {...props}
      >
        <Icon contentType={contentType}>{icon}</Icon>
        <ReactionCount
          isActive={!!currentUserReactionId}
          contentType={contentType}
        >
          {reactionCount}
        </ReactionCount>
      </Container>
    );
  }
}

ReactionCountDisplay.propTypes = {
  code: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
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
