/* eslint no-alert: 0 */
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useClickOutside from 'hooks/shared/useClickOutside';
import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import useMessageMutations from 'hooks/message/useMessageMutations';
import useThreadMutations from 'hooks/thread/useThreadMutations';
import { DiscussionContext, MessageContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

const Container = styled.div(
  ({ isOpen, isFirstMessage, theme: { colors } }) => ({
    display: isOpen ? 'block' : 'none',
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: `0px 0px 8px ${colors.borderGrey}`,
    position: 'absolute',
    right: '-1px',
    top: '-1px',
    zIndex: 100,
    width: isFirstMessage ? '180px' : 'auto',
  })
);

const DropdownOption = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  padding: '12px 20px',

  ':hover': {
    background: colors.formGrey,
  },
  ':first-of-type': {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  ':last-of-type': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));

const IconContainer = styled.div({
  width: '18px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
  width: '18px', // Setting this for now...
}));

const OptionName = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  marginLeft: '12px',
  position: 'relative',
  top: '1px',
}));

const MessageDropdown = ({ handleCloseDropdown, isOpen, ...props }) => {
  const selector = useRef();
  const { threadPosition, setMode } = useContext(MessageContext);
  const isFirstMessage = !threadPosition;

  // If there's no discussion ID, then there has to be a thread ID
  const { discussionId } = useContext(DiscussionContext);
  const parentResourceType = discussionId ? 'discussion' : 'thread';

  const { handleDeleteDiscussion } = useDiscussionMutations();
  const { handleDeleteThread } = useThreadMutations();
  const { handleDeleteMessage } = useMessageMutations();

  const handleClickOutside = () => {
    if (!isOpen) return;
    handleCloseDropdown();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  // If the user is deleting the first message of a list of messages, ask if they
  // want to delete the whole discussion/thread.
  const handleDeleteWrapper = event => {
    event.stopPropagation();

    const handleDeleteParentResource = discussionId
      ? handleDeleteDiscussion
      : handleDeleteThread;

    const resource = isFirstMessage ? parentResourceType : 'message';
    const handleDelete = isFirstMessage
      ? handleDeleteParentResource
      : handleDeleteMessage;

    const userChoice = window.confirm(
      `Are you sure you want to delete this ${resource}?`
    );

    if (!userChoice) return;

    handleCloseDropdown();
    handleDelete();
  };

  const handleEdit = event => {
    event.stopPropagation();
    handleCloseDropdown();
    setMode('edit');
  };

  return (
    <Container
      isFirstMessage={isFirstMessage}
      isOpen={isOpen}
      ref={selector}
      {...props}
    >
      <DropdownOption onClick={handleEdit}>
        <IconContainer>
          <StyledIcon icon="edit" />
        </IconContainer>
        <OptionName>Edit</OptionName>
      </DropdownOption>
      <DropdownOption onClick={handleDeleteWrapper}>
        <IconContainer>
          <StyledIcon icon="trash" />
        </IconContainer>
        <OptionName>
          {isFirstMessage ? `Delete ${titleize(parentResourceType)}` : 'Delete'}
        </OptionName>
      </DropdownOption>
    </Container>
  );
};

MessageDropdown.propTypes = {
  handleCloseDropdown: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MessageDropdown;
