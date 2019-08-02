import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled/macro';

import DiscussionThread from './DiscussionThread';

const StyledModal = styled(Modal)(({ theme: { maxViewport } }) => ({
  margin: '100px auto',
  width: maxViewport,
  maxWidth: maxViewport,

  '.modal-content': {
    border: 'none',
  },
}));

class DiscussionModal extends Component {
  constructor(props) {
    super(props);

    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (!prevProps.isOpen && isOpen) this.updateDisplayURL();
    if (prevProps.isOpen && !isOpen) this.resetDisplayURL();
  }

  resetDisplayURL() {
    const { meetingId } = this.props;
    const url = `${origin}/meetings/${meetingId}`;
    window.history.replaceState({}, `meeting: ${meetingId}`, url);
  }

  // Updates the URL in the address bar to reflect this conversation
  // https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries
  updateDisplayURL() {
    const { conversationId, meetingId } = this.props;
    const { origin } = window.location;

    const url = `${origin}/meetings/${meetingId}/conversations/${conversationId}`;
    window.history.replaceState({}, `conversation: ${conversationId}`, url);
  }

  render() {
    const {
      conversationId,
      meetingId,
      messageCount, // initializing so that it's not passed into the Modal component below
      messages,
      ...props
    } = this.props;

    return (
      <StyledModal
        fade={false}
        {...props}
      >
        <DiscussionThread
          conversationId={conversationId}
          meetingId={meetingId}
          messages={messages}
          messageCount={messageCount}
        />
      </StyledModal>
    );
  }
}

DiscussionModal.propTypes = {
  conversationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  meetingId: PropTypes.string.isRequired,
  messageCount: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
};

export default DiscussionModal;
