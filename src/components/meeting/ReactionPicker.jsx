import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from '@emotion/styled';

const Container = styled.div(({ isOpen, placement, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  background: colors.white,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
  opacity: isOpen ? 1 : 0,
  padding: '10px',
  position: 'absolute',
  marginTop: '20px',
  transition: 'opacity 0.2s',
  zIndex: 1,
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  width: '60px',
  margin: '0px',
}));

const ReactionsList = styled.div({

});

class ReactionPicker extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {
    const { isOpen, handleClose } = this.props;
    event.stopPropagation();

    if (isOpen) handleClose();
  }

  render() {
    const { handleClose, isOpen, placement, ...props } = this.props;

    return (
      <Container isOpen={isOpen} placement={placement} {...props}>
        <Title>Pick a reaction</Title>
        <Divider />
        <ReactionsList>
          Hello
        </ReactionsList>
      </Container>
    );
  }
}

ReactionPicker.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  placement: PropTypes.oneOf(['above', 'below']),
};

ReactionPicker.defaultProps = {
  isOpen: false,
  placement: 'above',
};

export default onClickOutside(ReactionPicker);
