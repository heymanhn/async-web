import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from '@emotion/styled';

import withReactions from 'utils/withReactions';

import ReactionIcon from './ReactionIcon';

const Container = styled.div(({ isOpen, offset, theme: { colors } }) => ({
  display: 'flex',
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

    this.state = { reactionOnHover: null };

    this.picker = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleExitHover = this.handleExitHover.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.calculateOffset = this.calculateOffset.bind(this);
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

  // Aiming for an 8 pixel gap between the add reaction button and the picker,
  // regardless of direction
  calculateOffset() {
    const { placement } = this.props;
    const picker = this.picker.current;
    if (!picker || placement === 'below') return 25;

    return (picker.offsetHeight + 8) * -1;
  }

  render() {
    const { reactionOnHover: hoverCode } = this.state;
    const {
      addReaction,
      handleClose,
      isOpen,
      placement,
      reactions,
      removeReaction,
      ...props
    } = this.props;

    const title = hoverCode ? reactions.find(r => r.code === hoverCode).text : 'Pick a reaction';

    return (
      <Container
        isOpen={isOpen}
        offset={this.calculateOffset()}
        placement={placement}
        ref={this.picker}
        {...props}
      >
        <Title>{title}</Title>
        <Divider />
        <ReactionsList>
          {reactions.map(r => (
            <ReactionIcon
              key={r.code}
              code={r.code}
              icon={r.icon}
              isSelected={false} // TODO: Pass real data later
              onAddReaction={addReaction}
              onExitHover={this.handleExitHover}
              onHover={this.handleHover}
              onRemoveReaction={removeReaction}
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
  removeReaction: PropTypes.func.isRequired,
  userReactions: PropTypes.array,
};

ReactionPicker.defaultProps = {
  isOpen: false,
  placement: 'above',
  userReactions: [],
};

export default withReactions(onClickOutside(ReactionPicker));
