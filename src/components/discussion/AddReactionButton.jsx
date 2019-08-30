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
  color: colors.grey4,

  ':hover': {
    color: colors.grey3,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)({
  cursor: 'pointer',
  fontSize: '16px',
});

const PlusSign = styled.div({
  fontSize: '16px',
  fontWeight: 500,
  marginLeft: '2px',
  marginTop: '-4px',
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
    const { onPickerStateChange } = this.props;

    if (isPickerOpen) {
      onPickerStateChange(false);
      this.setState({ isPickerOpen: false });
    }
  }

  togglePicker(event) {
    event.stopPropagation();

    const { onPickerStateChange } = this.props;

    this.setState((prevState) => {
      const newState = !prevState.isPickerOpen;
      onPickerStateChange(newState);
      return { isPickerOpen: !prevState.isPickerOpen };
    });
  }

  render() {
    const { isPickerOpen } = this.state;
    const {
      conversationId,
      messageId,
      onPickerStateChange,
      placement,
      ...props
    } = this.props;

    return (
      <Container {...props}>
        <ButtonContainer
          className="ignore-react-onclickoutside"
          onClick={this.togglePicker}
        >
          <StyledIcon icon={faLaugh} />
          <PlusSign>+</PlusSign>
        </ButtonContainer>
        <ReactionPicker
          conversationId={conversationId}
          handleClose={this.handleClosePicker}
          isOpen={isPickerOpen}
          messageId={messageId}
          placement={placement}
        />
      </Container>
    );
  }
}

AddReactionButton.propTypes = {
  conversationId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  onPickerStateChange: PropTypes.func,
  placement: PropTypes.oneOf(['above', 'below']).isRequired,
};

AddReactionButton.defaultProps = {
  onPickerStateChange: () => {},
};

export default AddReactionButton;
