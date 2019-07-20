import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

import ReactionPicker from './ReactionPicker';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey3,

  ':hover': {
    color: colors.grey2,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)(({ customsize }) => ({
  cursor: 'pointer',
  fontSize: customsize === 'small' ? '16px' : '18px',
}));

const PlusSign = styled.div({
  fontWeight: 500,
}, ({ size }) => {
  if (size === 'small') {
    return {
      fontSize: '13px',
      marginLeft: '1px',
      marginTop: '-2px',
    };
  }

  return {
    fontSize: '15px',
    marginLeft: '2px',
    marginTop: '-4px',
  };
});

class AddReactionButton extends Component {
  constructor(props) {
    super(props);

    this.state = { isPickerOpen: false };

    this.handleClosePicker = this.handleClosePicker.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
  }

  handleClosePicker() {
    const { isPickerOpen } = this.state;
    if (isPickerOpen) this.setState({ isPickerOpen: false });
  }

  togglePicker(event) {
    event.stopPropagation();

    this.setState(prevState => ({ isPickerOpen: !prevState.isPickerOpen }));
  }

  render() {
    const { isPickerOpen } = this.state;
    const { conversationId, message, size, source, ...props } = this.props;

    return (
      <Container {...props}>
        <ButtonContainer
          className="ignore-react-onclickoutside"
          onClick={this.togglePicker}
        >
          <StyledIcon customsize={size} icon={faLaugh} />
          <PlusSign size={size}>+</PlusSign>
        </ButtonContainer>
        <ReactionPicker
          conversationId={conversationId}
          message={message}
          handleClose={this.handleClosePicker}
          isOpen={isPickerOpen}
          placement={source === 'toolbar' ? 'above' : 'below'}
        />
      </Container>
    );
  }
}

AddReactionButton.propTypes = {
  conversationId: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'large']),
  source: PropTypes.oneOf(['hoverMenu', 'toolbar']).isRequired,
};

AddReactionButton.defaultProps = {
  size: 'small',
};

export default AddReactionButton;
