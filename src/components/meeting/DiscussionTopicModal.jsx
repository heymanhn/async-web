import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled';

const DiscussionTopicModal = ({
  conversationId,
  onDismissModal,
}) => (
  <Modal
    fade={false}
    isOpen={conversationId !== ''}
    toggle={onDismissModal}
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Modal>
);

DiscussionTopicModal.propTypes = {
  conversationId: PropTypes.string,
};

DiscussionTopicModal.defaultProps = {
  conversationId: '',
};

export default DiscussionTopicModal;
