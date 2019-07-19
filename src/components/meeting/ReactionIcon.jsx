import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  padding: '10px',
});

const Icon = styled.div({
  fontSize: '24px',
});

class ReactionIcon extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleExitHover = this.handleExitHover.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { code, isSelected, onAddReaction, onRemoveReaction } = this.props;
    return isSelected ? onRemoveReaction(code) : onAddReaction(code);
  }

  handleExitHover() {
    const { code, onExitHover } = this.props;
    onExitHover(code);
  }

  handleHover() {
    const { code, onHover } = this.props;
    onHover(code);
  }

  render() {
    const { icon } = this.props;

    return (
      <Container
        onBlur={this.handleExitHover}
        onClick={this.handleClick}
        onFocus={this.handleHover}
        onMouseOut={this.handleExitHover}
        onMouseOver={this.handleHover}
      >
        <Icon>{icon}</Icon>
      </Container>
    );
  }
}

ReactionIcon.propTypes = {
  code: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onAddReaction: PropTypes.func.isRequired,
  onExitHover: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onRemoveReaction: PropTypes.func.isRequired,
};

export default ReactionIcon;
