import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from '@emotion/styled';

import { matchCurrentUserId } from 'utils/auth';
import withReactions from 'utils/withReactions';

import ReactionIcon from './ReactionIcon';

const Container = styled.div(({ isOpen, offset, theme: { colors } }) => ({
  display: isOpen ? 'flex' : 'none',
  flexDirection: 'column',
  alignItems: 'center',

  background: colors.white,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
  marginTop: `${offset}px`,
  opacity: isOpen ? 1 : 0,
  padding: '10px 5px 5px',
  position: 'absolute',
  transition: 'opacity 0.2s',
  zIndex: 1,
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  width: '60px',
  margin: '10px 0 5px',
}));

const ReactionsList = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

class ReactionPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reactionOnHover: null,
    };

    this.handleAddReaction = this.handleAddReaction.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleExitHover = this.handleExitHover.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleRemoveReaction = this.handleRemoveReaction.bind(this);
    this.hasReactedWith = this.hasReactedWith.bind(this);
    this.calculateOffset = this.calculateOffset.bind(this);
    this.userReactionForCode = this.userReactionForCode.bind(this);
  }

  handleAddReaction(code) {
    const { addReaction, handleClose } = this.props;
    handleClose();
    addReaction(code);
  }

  handleClickOutside(event) {
    const { isOpen, handleClose } = this.props;
    event.stopPropagation();

    if (isOpen) handleClose();
  }

  handleExitHover(code) {
    const { reactionOnHover } = this.state;
    if (code !== reactionOnHover) return;

    this.setState({ reactionOnHover: null });
  }

  handleHover(code) {
    this.setState({ reactionOnHover: code });
  }

  handleRemoveReaction(reactionId) {
    const { removeReaction, handleClose } = this.props;
    handleClose();
    removeReaction(reactionId);
  }

  hasReactedWith(code) {
    const { reactions } = this.props;

    return reactions.findIndex(r => matchCurrentUserId(r.author.id) && r.code === code) >= 0;
  }

  // Aiming for an 8 pixel gap between the add reaction button and the picker,
  // regardless of direction
  calculateOffset() {
    const { placement } = this.props;
    return placement === 'below' ? 25 : -106; // Based on a single row of reactions
  }

  userReactionForCode(code) {
    const { reactions } = this.props;
    const reaction = reactions.find(r => r.code === code && matchCurrentUserId(r.author.id));
    return reaction ? reaction.id : null;
  }

  render() {
    const { reactionOnHover: hoverCode } = this.state;
    const {
      handleClose,
      isOpen,
      placement,
      reactionsReference,
      ...props
    } = this.props;

    const title = hoverCode
      ? reactionsReference.find(r => r.code === hoverCode).text : 'Pick a reaction';

    return (
      <Container
        isOpen={isOpen}
        offset={this.calculateOffset()}
        placement={placement}
        {...props}
      >
        <Title>{title}</Title>
        <Divider />
        <ReactionsList>
          {reactionsReference.map(r => (
            <ReactionIcon
              key={r.code}
              code={r.code}
              existingReactionId={this.userReactionForCode(r.code)}
              icon={r.icon}
              isSelected={this.hasReactedWith(r.code)}
              onAddReaction={this.handleAddReaction}
              onExitHover={this.handleExitHover}
              onHover={this.handleHover}
              onRemoveReaction={this.handleRemoveReaction}
            />
          ))}
        </ReactionsList>
      </Container>
    );
  }
}

ReactionPicker.propTypes = {
  addReaction: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  placement: PropTypes.oneOf(['above', 'below']),
  reactions: PropTypes.array.isRequired,
  reactionsReference: PropTypes.array.isRequired,
  removeReaction: PropTypes.func.isRequired,
};

ReactionPicker.defaultProps = {
  isOpen: false,
  placement: 'above',
};

export default withReactions(onClickOutside(ReactionPicker));
